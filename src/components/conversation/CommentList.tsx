'use client'

import { useState } from 'react'
import { CommentType } from '@prisma/client'
import { CommentForm } from './CommentForm'
import { formatDistanceToNow } from 'date-fns'
import { User, MessageCircle, Heart } from 'lucide-react'

interface Comment {
    id: string
    type: CommentType
    authorName: string | null
    authorRole: string | null
    isAnonymous: boolean
    content: string
    likeCount?: number
    createdAt: string
    replies?: Comment[]
}

interface CommentListProps {
    comments: Comment[]
    posterId: string
    scholarName: string
    onReplySuccess: () => void
    onLikeSuccess?: () => void
}

export function CommentList({ comments, posterId, scholarName, onReplySuccess, onLikeSuccess }: CommentListProps) {
    return (
        <div className="space-y-6">
            {comments.map((comment) => (
                <CommentItem
                    key={comment.id}
                    comment={comment}
                    posterId={posterId}
                    scholarName={scholarName}
                    onReplySuccess={onReplySuccess}
                    onLikeSuccess={onLikeSuccess}
                />
            ))}
        </div>
    )
}

function CommentItem({
    comment,
    posterId,
    scholarName,
    onReplySuccess,
    onLikeSuccess,
    isReply = false
}: {
    comment: Comment;
    posterId: string;
    scholarName: string;
    onReplySuccess: () => void;
    onLikeSuccess?: () => void;
    isReply?: boolean;
}) {
    const [showReplyForm, setShowReplyForm] = useState(false)
    const [isLiking, setIsLiking] = useState(false)

    const handleLike = async () => {
        if (isLiking) return
        setIsLiking(true)
        try {
            const res = await fetch(`/api/comments/${comment.id}/like`, { method: 'POST' })
            if (res.ok) {
                onLikeSuccess?.()
            }
        } catch (error) {
            console.error('Failed to like:', error)
        } finally {
            setIsLiking(false)
        }
    }

    // Robust scholar detection:
    // 1. Explicitly tagged with 'Scholar' role
    // 2. Name matches the scholar's name (case-insensitive and trimmed)
    const isScholar =
        comment.authorRole === 'Scholar' ||
        (scholarName && comment.authorName?.toLowerCase().trim() === scholarName.toLowerCase().trim())

    const scholarDisplayName = comment.authorRole === 'Scholar' && comment.authorName
        ? comment.authorName
        : scholarName

    const scholarSymbol = scholarDisplayName ? scholarDisplayName[0] : 'S'

    return (
        <div className={cn(
            "group flex flex-col gap-3 transition-all duration-300",
            isReply ? "ml-8 mt-4" : "",
            isScholar && "relative"
        )}>
            {isScholar && (
                <div className="absolute -inset-y-2 -inset-x-3 bg-blue-50/50 dark:bg-blue-900/10 rounded-3xl -z-10 ring-1 ring-blue-100 dark:ring-blue-900/30" />
            )}

            <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className={cn(
                    "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl text-sm font-black shadow-sm transition-transform group-hover:scale-105",
                    isScholar
                        ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white ring-2 ring-white dark:ring-zinc-900"
                        : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700"
                )}>
                    {isScholar ? scholarSymbol : (comment.authorName?.[0] || 'A')}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                            <span className={cn(
                                "text-sm font-extrabold truncate",
                                isScholar ? "text-blue-700 dark:text-blue-400" : "text-zinc-900 dark:text-zinc-100"
                            )}>
                                {isScholar ? scholarDisplayName : (comment.authorName || 'Anonymous')}
                            </span>
                            {isScholar && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-blue-600 px-2.5 py-0.5 text-[10px] font-black text-white shadow-sm uppercase tracking-wider">
                                    Scholar Answer
                                </span>
                            )}
                        </div>
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest whitespace-nowrap">
                            {formatDistanceToNow(new Date(comment.createdAt))} ago
                        </span>
                    </div>

                    <div className={cn(
                        "text-sm leading-relaxed break-words",
                        isScholar
                            ? "text-zinc-900 dark:text-zinc-100 font-semibold italic"
                            : "text-zinc-700 dark:text-zinc-300"
                    )}>
                        {comment.content}
                    </div>

                    <div className="mt-3 flex items-center gap-5">
                        <button
                            onClick={handleLike}
                            disabled={isLiking}
                            className={cn(
                                "flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest transition-all",
                                (comment.likeCount || 0) > 0
                                    ? "text-rose-500 bg-rose-50 dark:bg-rose-900/20 px-2 py-0.5 rounded-full"
                                    : "text-zinc-400 hover:text-rose-500"
                            )}
                        >
                            <Heart className={cn("h-3.5 w-3.5", (comment.likeCount || 0) > 0 && "fill-current")} />
                            {(comment.likeCount || 0) > 0 && <span>{comment.likeCount}</span>}
                            <span>Like</span>
                        </button>

                        {!isReply && (
                            <button
                                onClick={() => setShowReplyForm(!showReplyForm)}
                                className="flex items-center gap-1.5 text-[11px] font-bold text-zinc-400 hover:text-blue-600 transition-colors uppercase tracking-widest"
                            >
                                <MessageCircle className="h-3.5 w-3.5" />
                                Reply
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {showReplyForm && (
                <div className="ml-11">
                    <CommentForm
                        posterId={posterId}
                        type={comment.type}
                        scholarName={scholarName}
                        parentId={comment.id}
                        placeholder={`Reply to ${comment.authorName || 'Anonymous'}...`}
                        buttonLabel="Post Reply"
                        onSuccess={() => {
                            setShowReplyForm(false)
                            onReplySuccess()
                        }}
                        onCancel={() => setShowReplyForm(false)}
                    />
                </div>
            )}

            {/* Nested Replies */}
            {comment.replies && comment.replies.length > 0 && (
                <div className="border-l-2 border-zinc-100 dark:border-zinc-800 ml-4">
                    {comment.replies.map((reply) => (
                        <CommentItem
                            key={reply.id}
                            comment={reply}
                            posterId={posterId}
                            scholarName={scholarName}
                            onReplySuccess={onReplySuccess}
                            isReply={true}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ')
}
