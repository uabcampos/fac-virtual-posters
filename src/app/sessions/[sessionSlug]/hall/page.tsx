import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { SessionStatus, PosterStatus } from '@prisma/client'
import { PosterHall } from '@/components/hall/PosterHall'

interface HallPageProps {
    params: Promise<{
        sessionSlug: string
    }>
}

export default async function HallPage({ params }: HallPageProps) {
    const { sessionSlug } = await params

    const session = await prisma.session.findUnique({
        where: { slug: sessionSlug },
        include: {
            posters: {
                where: { status: PosterStatus.PUBLISHED },
                orderBy: { publishedAt: 'desc' },
                include: {
                    _count: {
                        select: { comments: true },
                    },
                },
            },
        },
    })

    if (!session || session.status === SessionStatus.DRAFT) {
        return notFound()
    }

    return (
        <main className="fixed inset-0 overflow-hidden bg-black">
            <PosterHall
                posters={session.posters as any}
                sessionSlug={sessionSlug}
            />
        </main>
    )
}
