'use client'

import { useState } from 'react'
import { Bookmark } from 'lucide-react'

interface BookmarkButtonProps {
    posterId: string
    bookmarked: boolean
    onToggle?: () => void
    className?: string
}

export function BookmarkButton({
    posterId,
    bookmarked: initialBookmarked,
    onToggle,
    className = '',
}: BookmarkButtonProps) {
    const [bookmarked, setBookmarked] = useState(initialBookmarked)
    const [loading, setLoading] = useState(false)

    const handleClick = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (loading) return
        setLoading(true)
        try {
            if (bookmarked) {
                await fetch(`/api/posters/${posterId}/bookmark`, { method: 'DELETE' })
                setBookmarked(false)
            } else {
                await fetch(`/api/posters/${posterId}/bookmark`, { method: 'POST' })
                setBookmarked(true)
            }
            onToggle?.()
        } catch (err) {
            console.error('Bookmark toggle failed:', err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <button
            type="button"
            onClick={handleClick}
            disabled={loading}
            className={`rounded-full p-1.5 transition-all ${bookmarked ? 'bg-amber-400/90 text-amber-950' : 'bg-black/40 text-white hover:bg-black/60'} backdrop-blur-md ${className}`}
            title={bookmarked ? 'Remove from bookmarks' : 'Bookmark poster'}
            aria-label={bookmarked ? 'Remove from bookmarks' : 'Bookmark poster'}
        >
            <Bookmark
                className={`h-4 w-4 ${bookmarked ? 'fill-current' : ''}`}
            />
        </button>
    )
}
