import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(
    request: Request,
    { params }: { params: Promise<{ commentId: string }> }
) {
    const { commentId } = await params

    try {
        const comment = await prisma.comment.update({
            where: { id: commentId },
            data: {
                likeCount: {
                    increment: 1
                }
            }
        })

        return NextResponse.json(comment)
    } catch (error) {
        console.error('Failed to like comment:', error)
        return NextResponse.json(
            { error: 'Failed to like comment' },
            { status: 500 }
        )
    }
}
