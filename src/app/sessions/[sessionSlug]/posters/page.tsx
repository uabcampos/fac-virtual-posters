import prisma from '@/lib/prisma'
import { PosterCard } from '@/components/gallery/PosterCard'
import { PosterFilters } from '@/components/gallery/PosterFilters'
import { notFound } from 'next/navigation'
import { SessionStatus, PosterStatus } from '@prisma/client'

interface GalleryPageProps {
    params: {
        sessionSlug: string
    }
    searchParams: {
        q?: string
        tag?: string
        sort?: string
    }
}

export default async function GalleryPage({ params, searchParams }: GalleryPageProps) {
    const { sessionSlug } = params
    const { q, tag, sort } = searchParams

    const session = await prisma.session.findUnique({
        where: { slug: sessionSlug },
        include: {
            posters: {
                select: { tags: true },
                where: { status: PosterStatus.PUBLISHED }
            }
        },
    })

    if (!session || session.status === SessionStatus.DRAFT) {
        return notFound()
    }

    // Extract unique tags for filtering
    const allTags = Array.from(new Set(session.posters.flatMap(p => p.tags))).sort()

    // Fetch posters for this session
    const where: any = {
        sessionId: session.id,
        status: PosterStatus.PUBLISHED,
    }

    if (q) {
        where.OR = [
            { title: { contains: q, mode: 'insensitive' } },
            { scholarNames: { hasSome: [q] } },
            { institutions: { hasSome: [q] } },
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

    return (
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            {/* Gallery Header */}
            <div className="mb-12 flex flex-col items-center text-center">
                <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-5xl dark:text-zinc-100">
                    Virtual Poster Gallery
                </h1>
                <p className="mt-4 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
                    Explore the latest research and innovations from our scholars.
                    Each poster includes a 5-minute summary and a space for discussion.
                </p>
            </div>

            {/* Filters */}
            <PosterFilters tags={allTags} />

            {/* Grid */}
            {posters.length > 0 ? (
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {posters.map((poster) => (
                        <PosterCard key={poster.id} sessionSlug={sessionSlug} poster={poster as any} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20">
                    <p className="text-lg font-medium text-zinc-600 dark:text-zinc-400">
                        No posters found matching your criteria.
                    </p>
                </div>
            )}
        </div>
    )
}
