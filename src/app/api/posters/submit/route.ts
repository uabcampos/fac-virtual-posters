import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { z } from 'zod'
import { PosterStatus } from '@prisma/client'

const submitPosterSchema = z.object({
    sessionId: z.string(),
    title: z.string().min(3),
    scholarNames: z.array(z.string().min(1)),
    institutions: z.array(z.string().min(1)),
    tags: z.array(z.string()),
    whyThisMatters: z.string().min(10),
    summaryProblem: z.string().min(10),
    summaryAudience: z.string().min(10),
    summaryMethods: z.string().min(10),
    summaryFindings: z.string().min(10),
    summaryChange: z.string().min(10),
    posterImageUrl: z.string().url(),
    posterPdfUrl: z.string().url().nullable(),
    scholarPhotoUrl: z.string().url().nullable(),
    welcomeMessage: z.string().optional(),
    feedbackPrompt: z.string().optional(),
})

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const validatedData = submitPosterSchema.parse(body)

        // Generate a unique slug from title
        const baseSlug = validatedData.title
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')

        let slug = baseSlug
        let counter = 1

        // Check for existing slug and increment if necessary
        while (await prisma.poster.findUnique({ where: { slug } })) {
            slug = `${baseSlug}-${counter}`
            counter++
        }

        const poster = await prisma.poster.create({
            data: {
                ...validatedData,
                slug,
                status: PosterStatus.PENDING, // Always start as pending for moderation
                publishedAt: null, // Not published yet
            }
        })

        return NextResponse.json(poster, { status: 201 })

    } catch (error) {
        console.error('Submission error:', error)
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.issues }, { status: 400 })
        }
        return NextResponse.json({ error: 'Failed to submit poster' }, { status: 500 })
    }
}
