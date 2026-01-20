import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config()

const prisma = new PrismaClient()

async function generateAudio() {
    const posters = await prisma.poster.findMany({
        where: { status: 'PUBLISHED' }
    })

    console.log(`Found ${posters.length} published posters.`)

    const audioDir = path.join(process.cwd(), 'public', 'audio')
    if (!fs.existsSync(audioDir)) {
        fs.mkdirSync(audioDir, { recursive: true })
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
        console.error('Missing GEMINI_API_KEY in .env')
        return
    }

    for (const poster of posters) {
        const text = `Here is a summary of the research titled ${poster.title}. The problem: ${poster.summaryProblem}. Why this matters: ${poster.whyThisMatters}. key findings: ${poster.summaryFindings}.`
        const audioPath = path.join(audioDir, `${poster.slug}.mp3`)
        const audioUrl = `/audio/${poster.slug}.mp3`

        // Skip if already exists unless forced
        if (fs.existsSync(audioPath)) {
            console.log(`Skipping existing audio for: ${poster.title}`)

            // Still update DB if needed
            if (poster.audioGuideUrl !== audioUrl) {
                await prisma.poster.update({
                    where: { id: poster.id },
                    data: { audioGuideUrl: audioUrl }
                })
            }
            continue
        }

        console.log(`Generating audio for: ${poster.title}...`)

        try {
            const response = await fetch(
                `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        input: { text },
                        voice: { languageCode: 'en-US', name: 'en-US-Journey-D' },
                        audioConfig: { audioEncoding: 'MP3', speakingRate: 1 }
                    })
                }
            )

            if (!response.ok) {
                const error = await response.json()
                console.error(`Error for ${poster.slug}:`, JSON.stringify(error, null, 2))
                continue
            }

            const data = await response.json() as { audioContent: string }
            const buffer = Buffer.from(data.audioContent, 'base64')
            fs.writeFileSync(audioPath, buffer)

            await prisma.poster.update({
                where: { id: poster.id },
                data: { audioGuideUrl: audioUrl }
            })

            console.log(`✅ Saved: ${audioUrl}`)
        } catch (err) {
            console.error(`Failed to generate audio for ${poster.slug}:`, err)
        }
    }

    console.log('Finished audio generation.')
}

generateAudio()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect()
    })
