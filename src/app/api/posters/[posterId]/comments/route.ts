import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { CommentType } from '@prisma/client'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const createCommentSchema = z.object({
    type: z.nativeEnum(CommentType),
    authorName: z.string().nullable().optional(),
    authorRole: z.string().nullable().optional(),
    isAnonymous: z.boolean().default(false),
    content: z.string().min(1).max(2000),
    parentId: z.string().uuid().nullable().optional(),
})

export async function GET(
    request: Request,
    { params }: { params: Promise<{ posterId: string }> }
) {
    const { posterId } = await params

    try {
        const comments = await prisma.comment.findMany({
            where: {
                posterId,
                isHidden: false,
                parentId: null // Only fetch top-level comments; replies will be included or fetched separately
            },
            include: {
                replies: {
                    where: { isHidden: false },
                    orderBy: { createdAt: 'asc' }
                }
            },
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json(comments)
    } catch (error) {
        console.error('Error fetching comments:', error)
        return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 })
    }
}

export async function POST(
    request: Request,
    { params }: { params: Promise<{ posterId: string }> }
) {
    const { posterId } = await params

    try {
        const body = await request.json()
        const validatedData = createCommentSchema.parse(body)

        const comment = await prisma.comment.create({
            data: {
                ...validatedData,
                posterId,
            },
        })

        return NextResponse.json(comment, { status: 201 })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.issues }, { status: 400 })
        }
        console.error('Error creating comment:', error)
        return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 })
    }
}
