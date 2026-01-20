import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params

        // We also need to delete any replies to this comment to avoid foreign key issues
        // Note: If we had an 'isDeleted' flag, we might use that instead.
        // For now, we delete the comment and its sub-tree.
        await prisma.comment.delete({ where: { id } })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Comment deletion error:', error)
        return NextResponse.json({ error: 'Failed to delete comment' }, { status: 500 })
    }
}
