import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { SessionStatus, PosterStatus } from '@prisma/client'
import { PosterHall } from '@/components/hall/PosterHall'

export const runtime = 'nodejs'

interface HallPageProps {
    params: Promise<{
        sessionSlug: string
    }>
}

function ErrorState({ title, message }: { title: string; message: string }) {
    return (
        <main className="fixed inset-0 flex items-center justify-center bg-black px-6">
            <div className="max-w-xl text-center">
                <h1 className="text-2xl font-black text-white">{title}</h1>
                <p className="mt-3 text-sm text-zinc-400">{message}</p>
            </div>
        </main>
    )
}

export default async function HallPage({ params }: HallPageProps) {
    const { sessionSlug } = await params

    if (!process.env.DATABASE_URL) {
        return (
            <ErrorState
                title="Hall unavailable"
                message="The database connection is not configured for this deployment."
            />
        )
    }

    try {
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
    } catch (error) {
        console.error('HallPage error:', error)
        return (
            <ErrorState
                title="Hall unavailable"
                message="We ran into a problem loading posters. Please try again soon."
            />
        )
    }
}
