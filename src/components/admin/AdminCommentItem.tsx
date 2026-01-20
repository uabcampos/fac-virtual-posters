'use client'

import { formatDistanceToNow } from 'date-fns'
import { Trash2, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function AdminCommentItem({ comment }: { comment: any }) {
    const router = useRouter()
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this comment?')) return

        setIsDeleting(true)
        try {
            const res = await fetch(`/api/admin/comments/${comment.id}`, {
                method: 'DELETE'
            })
            if (res.ok) {
                router.refresh()
            }
        } catch (error) {
            console.error('Failed to delete comment:', error)
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <div className={`group flex items-start justify-between gap-4 rounded-2xl border border-zinc-100 p-4 transition-all hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800/50 ${isDeleting ? 'opacity-50 pointer-events-none' : ''}`}>
            <div className="flex-1">
                <div className="mb-1 flex items-center gap-2 text-xs text-zinc-500">
                    <span className="font-bold text-zinc-900 dark:text-zinc-100">
                        {comment.isAnonymous ? 'Anonymous' : comment.authorName}
                    </span>
                    <span>•</span>
                    <span>{formatDistanceToNow(new Date(comment.createdAt))} ago</span>
                    <span>on</span>
                    <Link
                        href={`/sessions/${comment.poster.session.slug}/posters/${comment.poster.slug}`}
                        className="font-medium text-blue-600 hover:underline"
                    >
                        {comment.poster.title}
                    </Link>
                </div>
                <p className="text-sm text-zinc-700 dark:text-zinc-300">{comment.content}</p>
            </div>

            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={handleDelete}
                    className="rounded-lg p-2 text-zinc-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                    title="Delete Comment"
                >
                    <Trash2 className="h-4 w-4" />
                </button>
            </div>
        </div>
    )
}
