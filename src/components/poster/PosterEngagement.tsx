'use client'

import { useState, useEffect } from 'react'
import { Bookmark, ThumbsUp, Eye, MessageSquare } from 'lucide-react'
import { BookmarkButton } from '@/components/gallery/BookmarkButton'

interface PosterEngagementProps {
    posterId: string
    initialUpvoteCount: number
    initialViewCount: number
    initialCommentCount: number
}

export function PosterEngagement({
    posterId,
    initialUpvoteCount,
    initialViewCount,
    initialCommentCount,
}: PosterEngagementProps) {
    const [upvoted, setUpvoted] = useState(false)
    const [upvoteCount, setUpvoteCount] = useState(initialUpvoteCount)
    const [loading, setLoading] = useState(false)
    const [bookmarked, setBookmarked] = useState(false)

    useEffect(() => {
        fetch(`/api/posters/${posterId}/upvote`)
            .then((r) => r.json())
            .then((d) => d.upvoted && setUpvoted(true))
            .catch(() => {})
        fetch(`/api/posters/${posterId}/bookmark`)
            .then((r) => r.json())
            .then((d) => d.bookmarked && setBookmarked(true))
            .catch(() => {})
    }, [posterId])

    const handleUpvote = async () => {
        if (loading) return
        setLoading(true)
        try {
            const res = await fetch(`/api/posters/${posterId}/upvote`, {
                method: 'POST',
            })
            if (res.ok) {
                const data = await res.json()
                setUpvoted(true)
                if (data.upvoteCount != null) setUpvoteCount(data.upvoteCount)
            }
        } catch (err) {
            console.error('Upvote failed:', err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-wrap items-center gap-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 px-4 py-3 border border-zinc-100 dark:border-zinc-800">
            <BookmarkButton
                posterId={posterId}
                bookmarked={bookmarked}
                onToggle={() => setBookmarked(!bookmarked)}
                className="!p-2"
            />
            <span className="flex items-center gap-1.5 text-sm text-zinc-600 dark:text-zinc-400">
                <Eye className="h-4 w-4" />
                <span className="font-semibold">{initialViewCount}</span> views
            </span>
            <span className="flex items-center gap-1.5 text-sm text-zinc-600 dark:text-zinc-400">
                <MessageSquare className="h-4 w-4" />
                <span className="font-semibold">{initialCommentCount}</span> comments
            </span>
            <button
                type="button"
                onClick={handleUpvote}
                disabled={loading || upvoted}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold transition-all ${
                    upvoted
                        ? 'bg-brand-blue text-white dark:bg-blue-600'
                        : 'bg-zinc-200 text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600'
                }`}
            >
                <ThumbsUp className={`h-4 w-4 ${upvoted ? 'fill-current' : ''}`} />
                {upvoteCount} upvote{upvoteCount !== 1 ? 's' : ''}
            </button>
        </div>
    )
}
