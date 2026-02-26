import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

const ADMIN_COOKIE = 'fac_admin'

function isAdmin(request: NextRequest) {
    return request.cookies.get(ADMIN_COOKIE)?.value === '1'
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ commentId: string }> }
) {
    try {
        if (!isAdmin(request)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { commentId } = await params

        // We also need to delete any replies to this comment to avoid foreign key issues
        // Note: If we had an 'isDeleted' flag, we might use that instead.
        // For now, we delete the comment and its sub-tree.
        await prisma.comment.delete({ where: { id: commentId } })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Comment deletion error:', error)
        return NextResponse.json({ error: 'Failed to delete comment' }, { status: 500 })
    }
}
