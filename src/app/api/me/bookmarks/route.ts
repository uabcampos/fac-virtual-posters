import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

const VISITOR_COOKIE = 'fac_visitor_id'

function getVisitorId(request: NextRequest): string | null {
    return request.cookies.get(VISITOR_COOKIE)?.value ?? null
}

export async function GET(request: NextRequest) {
    const visitorId = getVisitorId(request)
    if (!visitorId) {
        return NextResponse.json({ posterIds: [] })
    }
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')
    if (!sessionId) {
        return NextResponse.json({ error: 'sessionId required' }, { status: 400 })
    }
    try {
        const bookmarks = await prisma.posterBookmark.findMany({
            where: {
                visitorId,
                poster: { sessionId, status: 'PUBLISHED' },
            },
            select: { posterId: true },
        })
        return NextResponse.json({
            posterIds: bookmarks.map((b) => b.posterId),
        })
    } catch (error) {
        console.error('List bookmarks error:', error)
        return NextResponse.json({ error: 'Failed to list bookmarks' }, { status: 500 })
    }
}
