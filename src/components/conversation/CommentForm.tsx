'use client'

import { useState } from 'react'
import { Send, User, UserCheck } from 'lucide-react'
import { CommentType } from '@prisma/client'

interface CommentFormProps {
    posterId: string
    type: CommentType
    scholarName: string
    parentId?: string
    placeholder: string
    buttonLabel: string
    onSuccess: () => void
    onCancel?: () => void
}

export function CommentForm({
    posterId,
    type,
    scholarName,
    parentId,
    placeholder,
    buttonLabel,
    onSuccess,
    onCancel
}: CommentFormProps) {
    const [content, setContent] = useState('')
    const [authorName, setAuthorName] = useState('')
    const [isAnonymous, setIsAnonymous] = useState(false)
    const [isScholarMode, setIsScholarMode] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!content.trim()) return

        setIsSubmitting(true)

        try {
            const res = await fetch(`/api/posters/${posterId}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type,
                    content,
                    authorName: isScholarMode ? scholarName : (isAnonymous ? null : authorName || 'Anonymous'),
                    authorRole: isScholarMode ? 'Scholar' : null,
                    isAnonymous: isScholarMode ? false : isAnonymous,
                    parentId
                }),
            })

            if (res.ok) {
                setContent('')
                setAuthorName('')
                onSuccess()
            } else {
                const errorData = await res.json()
                console.error('Failed to submit comment:', errorData)
                alert('Failed to submit comment. Please try again.')
            }
        } catch (error) {
            console.error('Error submitting comment:', error)
            alert('An error occurred. Please check your connection.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={placeholder}
                    className="w-full min-h-[100px] rounded-2xl border border-zinc-200 bg-white p-4 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 transition-all resize-none"
                    required
                />
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                {!isScholarMode && !isAnonymous && (
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
                        <input
                            type="text"
                            placeholder="Your name (optional)"
                            value={authorName}
                            onChange={(e) => setAuthorName(e.target.value)}
                            className="rounded-full border border-zinc-200 bg-white py-1.5 pl-9 pr-4 text-xs outline-none focus:border-blue-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
                        />
                    </div>
                )}

                {!isScholarMode && (
                    <button
                        type="button"
                        onClick={() => setIsAnonymous(!isAnonymous)}
                        className={cn(
                            "flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold transition-all",
                            isAnonymous
                                ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                                : "text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        )}
                    >
                        {isAnonymous ? <UserCheck className="h-3.5 w-3.5" /> : <User className="h-3.5 w-3.5" />}
                        {isAnonymous ? "Posting Anonymously" : "Post Anonymously"}
                    </button>
                )}

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => {
                            const newMode = !isScholarMode
                            setIsScholarMode(newMode)
                            if (newMode) {
                                setIsAnonymous(false)
                                setAuthorName('')
                            }
                        }}
                        className={cn(
                            "flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold transition-all",
                            isScholarMode
                                ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                                : "text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        )}
                    >
                        <UserCheck className="h-3.5 w-3.5" />
                        {isScholarMode ? "Scholar Mode ON" : "Are you the Scholar?"}
                    </button>

                    {isScholarMode && (
                        <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest animate-pulse">
                            Replying as {scholarName}
                        </span>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-2">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="text-xs font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 px-4 py-2"
                    >
                        Cancel
                    </button>
                )}
                <button
                    type="submit"
                    disabled={isSubmitting || !content.trim()}
                    className="flex items-center gap-2 rounded-full bg-blue-600 px-6 py-2 text-sm font-bold text-white shadow-lg transition-all hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                    {isSubmitting ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                        <>
                            {buttonLabel}
                            <Send className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </>
                    )}
                </button>
            </div>
        </form>
    )
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ')
}
