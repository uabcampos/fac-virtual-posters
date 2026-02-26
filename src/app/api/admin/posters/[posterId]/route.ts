import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { PosterStatus } from '@prisma/client'

const ADMIN_COOKIE = 'fac_admin'

function isAdmin(request: NextRequest) {
    return request.cookies.get(ADMIN_COOKIE)?.value === '1'
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ posterId: string }> }
) {
    try {
        if (!isAdmin(request)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { posterId } = await params
        const { status } = await request.json()

        if (!Object.values(PosterStatus).includes(status)) {
            return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
        }

        const poster = await prisma.poster.update({
            where: { id: posterId },
            data: {
                status,
                publishedAt: status === PosterStatus.PUBLISHED ? new Date() : undefined
            },
        })

        return NextResponse.json(poster)
    } catch (error) {
        console.error('Moderation error:', error)
        return NextResponse.json({ error: 'Failed to update poster' }, { status: 500 })
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ posterId: string }> }
) {
    try {
        if (!isAdmin(request)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { posterId } = await params
        await prisma.poster.delete({ where: { id: posterId } })
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Delete error:', error)
        return NextResponse.json({ error: 'Failed to delete poster' }, { status: 500 })
    }
}
