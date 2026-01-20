import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { PosterStatus } from '@prisma/client'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')
    const q = searchParams.get('q')
    const tag = searchParams.get('tag')
    const sort = searchParams.get('sort') || 'recently_active'

    try {
        const where: any = {
            status: PosterStatus.PUBLISHED,
        }

        if (sessionId) {
            where.sessionId = sessionId
        }

        if (q) {
            where.OR = [
                { title: { contains: q, mode: 'insensitive' } },
                { scholarNames: { hasSome: [q] } }, // Simple search, might need refinement
                { institutions: { hasSome: [q] } },
                { tags: { hasSome: [q] } },
            ]
        }

        if (tag) {
            where.tags = { has: tag }
        }

        let orderBy: any = {}
        if (sort === 'most_commented') {
            orderBy = { comments: { _count: 'desc' } }
        } else if (sort === 'az') {
            orderBy = { title: 'asc' }
        } else {
            // Default: recently active (based on comments or publishedAt)
            orderBy = { publishedAt: 'desc' }
        }

        const posters = await prisma.poster.findMany({
            where,
            orderBy,
            include: {
                _count: {
                    select: { comments: true },
                },
            },
        })

        return NextResponse.json(posters)
    } catch (error) {
        console.error('Error fetching posters:', error)
        return NextResponse.json({ error: 'Failed to fetch posters' }, { status: 500 })
    }
}
