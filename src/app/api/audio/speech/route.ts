import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const { text, gender = 'MALE' } = await request.json()

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json(
                { error: 'Missing API Key' },
                { status: 500 }
            )
        }

        // Use "Journey" voices for maximum realism
        // en-US-Journey-D is a deep, warm male voice
        // en-US-Journey-F is a warm, articulate female voice
        const voiceName = gender === 'FEMALE' ? 'en-US-Journey-F' : 'en-US-Journey-D'

        const response = await fetch(
            `https://texttospeech.googleapis.com/v1/text:synthesize?key=${process.env.GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    input: { text },
                    voice: {
                        languageCode: 'en-US',
                        name: voiceName,
                    },
                    audioConfig: {
                        audioEncoding: 'MP3',
                        effectsProfileId: ['headphone-class-device'], // Optimized for headphones
                        pitch: 0,
                        speakingRate: 1
                    },
                }),
            }
        )

        if (!response.ok) {
            const error = await response.json()
            console.error('Google TTS Error Info:', JSON.stringify(error, null, 2))
            return NextResponse.json(
                { error: error.error?.message || 'Failed to synthesize speech' },
                { status: response.status }
            )
        }

        const data = await response.json()

        // Google returns base64 string in audioContent
        return NextResponse.json({ audioContent: data.audioContent })

    } catch (error) {
        console.error('TTS Proxy Error:', error)
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        )
    }
}
