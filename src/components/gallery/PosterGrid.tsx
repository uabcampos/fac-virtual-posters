'use client'

import { useState, useEffect, useCallback } from 'react'
import { PosterCard } from './PosterCard'

interface Poster {
    id: string
    slug: string
    title: string
    scholarNames: string[]
    institutions: string[]
    whyThisMatters: string
    tags: string[]
    posterImageUrl: string
    upvoteCount: number
    _count: { comments: number; views: number }
}

interface PosterGridProps {
    sessionSlug: string
    sessionId: string
    posters: Poster[]
}

function cn(...inputs: (string | boolean | undefined)[]) {
    return inputs.filter(Boolean).join(' ')
}

export function PosterGrid({ sessionSlug, sessionId, posters }: PosterGridProps) {
    const [tab, setTab] = useState<'all' | 'bookmarked'>('all')
    const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set())

    const fetchBookmarks = useCallback(async () => {
        try {
            const res = await fetch(`/api/me/bookmarks?sessionId=${sessionId}`)
            if (res.ok) {
                const { posterIds } = await res.json()
                setBookmarkedIds(new Set(posterIds ?? []))
            }
        } catch (err) {
            console.error('Failed to fetch bookmarks:', err)
        }
    }, [sessionId])

    useEffect(() => {
        fetchBookmarks()
    }, [fetchBookmarks])

    const filtered =
        tab === 'bookmarked'
            ? posters.filter((p) => bookmarkedIds.has(p.id))
            : posters

    return (
        <div className="space-y-6">
            {/* Tabs: All | Bookmarked (Fourwaves-style) */}
            <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-4">
                <button
                    type="button"
                    onClick={() => setTab('all')}
                    className={cn(
                        'rounded-full px-4 py-2 text-sm font-bold transition-all',
                        tab === 'all'
                            ? 'bg-forge-teal text-white dark:bg-brand-blue'
                            : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800'
                    )}
                >
                    All posters
                </button>
                <button
                    type="button"
                    onClick={() => setTab('bookmarked')}
                    className={cn(
                        'rounded-full px-4 py-2 text-sm font-bold transition-all flex items-center gap-1.5',
                        tab === 'bookmarked'
                            ? 'bg-forge-teal text-white dark:bg-brand-blue'
                            : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800'
                    )}
                >
                    Bookmarked
                    {bookmarkedIds.size > 0 && (
                        <span className="rounded-full bg-white/20 px-1.5 py-0.5 text-xs">
                            {bookmarkedIds.size}
                        </span>
                    )}
                </button>
            </div>

            {filtered.length > 0 ? (
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filtered.map((poster) => (
                        <PosterCard
                            key={poster.id}
                            sessionSlug={sessionSlug}
                            poster={poster}
                            bookmarked={bookmarkedIds.has(poster.id)}
                            onBookmarkChange={fetchBookmarks}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20">
                    <p className="text-lg font-medium text-zinc-600 dark:text-zinc-400">
                        {tab === 'bookmarked'
                            ? 'No bookmarked posters. Click the bookmark icon on any poster to save it here.'
                            : 'No posters found matching your criteria.'}
                    </p>
                </div>
            )}
        </div>
    )
}
