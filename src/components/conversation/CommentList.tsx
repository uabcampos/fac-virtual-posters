'use client'

import { useState } from 'react'
import { CommentType } from '@prisma/client'
import { CommentForm } from './CommentForm'
import { formatDistanceToNow } from 'date-fns'
import { User, MessageCircle } from 'lucide-react'

interface Comment {
    id: string
    type: CommentType
    authorName: string | null
    authorRole: string | null
    isAnonymous: boolean
    content: string
    createdAt: string
    replies?: Comment[]
}

interface CommentListProps {
    comments: Comment[]
    posterId: string
    scholarName: string
    onReplySuccess: () => void
}

export function CommentList({ comments, posterId, scholarName, onReplySuccess }: CommentListProps) {
    return (
        <div className="space-y-6">
            {comments.map((comment) => (
                <CommentItem
                    key={comment.id}
                    comment={comment}
                    posterId={posterId}
                    scholarName={scholarName}
                    onReplySuccess={onReplySuccess}
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
    isReply = false
}: {
    comment: Comment;
    posterId: string;
    scholarName: string;
    onReplySuccess: () => void;
    isReply?: boolean;
}) {
    const [showReplyForm, setShowReplyForm] = useState(false)

    const isScholar = comment.authorName === scholarName || comment.authorRole === 'Scholar'

    return (
        <div className={cn("group flex flex-col gap-3", isReply ? "ml-8 mt-4" : "")}>
            <div className="flex items-start gap-3">
                {/* Avatar */}
                <div className={cn(
                    "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold",
                    isScholar
                        ? "bg-blue-600 text-white"
                        : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
                )}>
                    {isScholar ? scholarName[0] : (comment.authorName?.[0] || 'A')}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <span className={cn(
                            "text-xs font-bold truncate",
                            isScholar ? "text-blue-600 dark:text-blue-400" : "text-zinc-900 dark:text-zinc-100"
                        )}>
                            {isScholar ? scholarName : (comment.authorName || 'Anonymous')}
                        </span>
                        {isScholar && (
                            <span className="inline-flex items-center rounded-md bg-blue-50 px-1.5 py-0.5 text-[10px] font-bold text-blue-700 ring-1 ring-inset ring-blue-700/10 dark:bg-blue-400/10 dark:text-blue-400">
                                Scholar
                            </span>
                        )}
                        <span className="text-[10px] text-zinc-400">
                            {formatDistanceToNow(new Date(comment.createdAt))} ago
                        </span>
                    </div>

                    <div className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed break-words">
                        {comment.content}
                    </div>

                    {!isReply && (
                        <button
                            onClick={() => setShowReplyForm(!showReplyForm)}
                            className="mt-2 flex items-center gap-1.5 text-[11px] font-bold text-zinc-400 hover:text-blue-600 transition-colors"
                        >
                            <MessageCircle className="h-3 w-3" />
                            Reply
                        </button>
                    )}
                </div>
            </div>

            {showReplyForm && (
                <div className="ml-11">
                    <CommentForm
                        posterId={posterId}
                        type={comment.type}
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
