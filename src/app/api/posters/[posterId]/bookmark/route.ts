import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

const VISITOR_COOKIE = 'fac_visitor_id'

function getVisitorId(request: NextRequest): string | null {
    return request.cookies.get(VISITOR_COOKIE)?.value ?? null
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ posterId: string }> }
) {
    const visitorId = getVisitorId(request)
    const { posterId } = await params
    if (!visitorId) {
        return NextResponse.json({ bookmarked: false })
    }
    try {
        const b = await prisma.posterBookmark.findUnique({
            where: {
                posterId_visitorId: { posterId, visitorId },
            },
        })
        return NextResponse.json({ bookmarked: !!b })
    } catch (error) {
        console.error('Check bookmark error:', error)
        return NextResponse.json({ bookmarked: false })
    }
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ posterId: string }> }
) {
    const visitorId = getVisitorId(request)
    if (!visitorId) {
        return NextResponse.json(
            { error: 'Visitor ID required. Allow cookies and refresh.' },
            { status: 400 }
        )
    }
    const { posterId } = await params
    try {
        await prisma.posterBookmark.upsert({
            where: {
                posterId_visitorId: { posterId, visitorId },
            },
            create: { posterId, visitorId },
            update: {},
        })
        return NextResponse.json({ bookmarked: true })
    } catch (error) {
        console.error('Add bookmark error:', error)
        return NextResponse.json({ error: 'Failed to add bookmark' }, { status: 500 })
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ posterId: string }> }
) {
    const visitorId = getVisitorId(request)
    if (!visitorId) {
        return NextResponse.json({ bookmarked: false })
    }
    const { posterId } = await params
    try {
        await prisma.posterBookmark.deleteMany({
            where: { posterId, visitorId },
        })
        return NextResponse.json({ bookmarked: false })
    } catch (error) {
        console.error('Remove bookmark error:', error)
        return NextResponse.json({ error: 'Failed to remove bookmark' }, { status: 500 })
    }
}
