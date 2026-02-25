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
        return NextResponse.json({ upvoted: false })
    }
    try {
        const u = await prisma.posterUpvote.findUnique({
            where: {
                posterId_visitorId: { posterId, visitorId },
            },
        })
        return NextResponse.json({ upvoted: !!u })
    } catch (error) {
        console.error('Check upvote error:', error)
        return NextResponse.json({ upvoted: false })
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
        try {
            await prisma.posterUpvote.create({
                data: { posterId, visitorId },
            })
        } catch (e: unknown) {
            if (e && typeof e === 'object' && 'code' in e && e.code === 'P2002') {
                return NextResponse.json({ upvoted: true, already: true })
            }
            throw e
        }
        await prisma.poster.update({
            where: { id: posterId },
            data: { upvoteCount: { increment: 1 } },
        })
        const poster = await prisma.poster.findUnique({
            where: { id: posterId },
            select: { upvoteCount: true },
        })
        return NextResponse.json({
            upvoted: true,
            upvoteCount: poster?.upvoteCount ?? 0,
        })
    } catch (error) {
        console.error('Upvote error:', error)
        return NextResponse.json({ error: 'Failed to upvote' }, { status: 500 })
    }
}
