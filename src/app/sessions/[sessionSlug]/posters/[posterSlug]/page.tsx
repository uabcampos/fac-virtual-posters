import { ChevronLeft, ChevronRight, Hash } from 'lucide-react'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { PosterViewer } from '@/components/gallery/PosterViewer'
import { ConversationPanel } from '@/components/conversation/ConversationPanel'
import { PosterViewTracker } from '@/components/gallery/PosterViewTracker'
import { PosterStatus } from '@prisma/client'

interface PosterDetailPageProps {
    params: Promise<{
        sessionSlug: string
        posterSlug: string
    }>
}

export default async function PosterDetailPage({ params }: PosterDetailPageProps) {
    const { sessionSlug, posterSlug } = await params

    const poster = await prisma.poster.findUnique({
        where: { slug: posterSlug },
        include: {
            session: true,
            _count: {
                select: { comments: true },
            },
        },
    })

    if (!poster || poster.session.slug !== sessionSlug || poster.status !== PosterStatus.PUBLISHED) {
        return notFound()
    }

    // Find next and previous posters for navigation
    const allPosters = await prisma.poster.findMany({
        where: { sessionId: poster.sessionId, status: PosterStatus.PUBLISHED },
        orderBy: { publishedAt: 'desc' },
        select: { slug: true },
    })

    const currentIndex = allPosters.findIndex((p) => p.slug === posterSlug)
    const prevPoster = currentIndex > 0 ? allPosters[currentIndex - 1] : null
    const nextPoster = currentIndex < allPosters.length - 1 ? allPosters[currentIndex + 1] : null

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <PosterViewTracker posterId={poster.id} />
            {/* Navigation Header */}
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <Link
                    href={`/sessions/${sessionSlug}/posters`}
                    className="flex items-center gap-2 text-sm font-semibold text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
                >
                    <ChevronLeft className="h-4 w-4" />
                    Back to Gallery
                </Link>

                <div className="flex items-center gap-4">
                    <Link
                        href={prevPoster ? `/sessions/${sessionSlug}/posters/${prevPoster.slug}` : '#'}
                        className={cn(
                            "flex items-center gap-1 rounded-full px-4 py-2 text-xs font-bold transition-all",
                            prevPoster
                                ? "bg-zinc-100 text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-100"
                                : "opacity-30 cursor-not-allowed pointer-events-none"
                        )}
                    >
                        <ChevronLeft className="h-3 w-3" />
                        Previous
                    </Link>
                    <Link
                        href={nextPoster ? `/sessions/${sessionSlug}/posters/${nextPoster.slug}` : '#'}
                        className={cn(
                            "flex items-center gap-1 rounded-full px-4 py-2 text-xs font-bold transition-all",
                            nextPoster
                                ? "bg-zinc-100 text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-100"
                                : "opacity-30 cursor-not-allowed pointer-events-none"
                        )}
                    >
                        Next
                        <ChevronRight className="h-3 w-3" />
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start">
                {/* Left Column: Poster & Summary */}
                <div className="lg:col-span-8 flex flex-col gap-10">
                    <section>
                        <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-100">
                            {poster.title}
                        </h1>
                        <div className="mb-8 flex flex-wrap items-center gap-4 text-sm text-zinc-600 dark:text-zinc-400">
                            <span className="font-bold text-zinc-900 dark:text-zinc-100">{poster.scholarNames.join(', ')}</span>
                            <span className="hidden sm:inline">•</span>
                            <span>{poster.institutions.join(', ')}</span>
                        </div>

                        <PosterViewer imageUrl={poster.posterImageUrl} pdfUrl={poster.posterPdfUrl} />
                    </section>

                    <section className="rounded-3xl bg-zinc-50 p-8 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800">
                        <h2 className="mb-8 flex items-center gap-2 text-xl font-bold text-zinc-900 dark:text-zinc-100">
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400">
                                <Hash className="h-4 w-4" />
                            </span>
                            5-Minute Summary
                        </h2>

                        <div className="space-y-8">
                            <SummaryField title="What problem does this address?" content={poster.summaryProblem} />
                            <SummaryField title="Who does it matter to?" content={poster.summaryAudience} />
                            <SummaryField title="What did you do?" content={poster.summaryMethods} />
                            <SummaryField title="What did you find?" content={poster.summaryFindings} />
                            <SummaryField title="What could this change?" content={poster.summaryChange} />
                        </div>
                    </section>
                </div>

                {/* Right Column: Scholar & Conversation (Sticky) */}
                <div className="lg:col-span-4 lg:sticky lg:top-8 flex flex-col gap-8">
                    {/* Scholar Presence */}
                    <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-800">
                        <div className="mb-6 flex items-center gap-4">
                            <div className="h-16 w-16 overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex-shrink-0 border-2 border-white dark:border-zinc-800 shadow-md">
                                {poster.scholarPhotoUrl ? (
                                    <img src={poster.scholarPhotoUrl} alt={poster.scholarNames[0]} className="h-full w-full object-cover" />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center text-2xl font-bold text-zinc-400">
                                        {poster.scholarNames[0][0]}
                                    </div>
                                )}
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{poster.scholarNames[0]}</h3>
                                <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-bold text-blue-700 ring-1 ring-inset ring-blue-700/10 dark:bg-blue-400/10 dark:text-blue-400">
                                    Scholar
                                </span>
                            </div>
                        </div>

                        {poster.welcomeMessage && (
                            <p className="text-sm italic text-zinc-600 dark:text-zinc-400 mb-6 bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-2xl">
                                &ldquo;{poster.welcomeMessage}&rdquo;
                            </p>
                        )}

                        {poster.feedbackPrompt && (
                            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30 p-4 rounded-2xl">
                                <h4 className="text-xs font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider mb-2">What I'd love feedback on</h4>
                                <p className="text-sm text-amber-900 dark:text-amber-300 font-medium">
                                    {poster.feedbackPrompt}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Conversation Panel */}
                    <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-800 flex-1 overflow-hidden flex flex-col min-h-[500px]">
                        <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-6">Conversation</h3>
                        <ConversationPanel posterId={poster.id} scholarName={poster.scholarNames[0]} />
                    </div>
                </div>
            </div>
        </div>
    )
}

function SummaryField({ title, content }: { title: string; content: string }) {
    return (
        <div>
            <h3 className="text-sm font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-3">
                {title}
            </h3>
            <div className="text-lg leading-relaxed text-zinc-800 dark:text-zinc-200 font-medium">
                {content}
            </div>
        </div>
    )
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ')
}
