'use client'

import { useState, useEffect } from 'react'
import { MessageSquare, Lightbulb, Heart, Send } from 'lucide-react'
import { CommentType } from '@prisma/client'
import { CommentList } from './CommentList'
import { CommentForm } from './CommentForm'

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

interface ConversationPanelProps {
    posterId: string
    scholarName: string
}

export function ConversationPanel({ posterId, scholarName }: ConversationPanelProps) {
    const [activeTab, setActiveTab] = useState<CommentType>(CommentType.QUESTION)
    const [comments, setComments] = useState<Comment[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const fetchComments = async () => {
        try {
            const res = await fetch(`/api/posters/${posterId}/comments`)
            if (res.ok) {
                const data = await res.json()
                setComments(data)
            }
        } catch (error) {
            console.error('Error fetching comments:', error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchComments()
    }, [posterId])

    const filteredComments = comments.filter(c => c.type === activeTab)

    return (
        <div className="flex flex-col h-full">
            {/* Guidance Text */}
            <div className="mb-6 rounded-2xl bg-zinc-50 p-4 text-xs text-zinc-500 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 italic">
                &ldquo;Be respectful. Share questions and ideas that can help move the work forward.&rdquo;
            </div>

            {/* Tabs */}
            <div className="mb-6 flex p-1 bg-zinc-100 dark:bg-zinc-800 rounded-2xl">
                <TabButton
                    active={activeTab === CommentType.QUESTION}
                    onClick={() => setActiveTab(CommentType.QUESTION)}
                    icon={<MessageSquare className="h-4 w-4" />}
                    label="Questions"
                />
                <TabButton
                    active={activeTab === CommentType.IDEA}
                    onClick={() => setActiveTab(CommentType.IDEA)}
                    icon={<Lightbulb className="h-4 w-4" />}
                    label="Ideas"
                />
                <TabButton
                    active={activeTab === CommentType.FEEDBACK}
                    onClick={() => setActiveTab(CommentType.FEEDBACK)}
                    icon={<Heart className="h-4 w-4" />}
                    label="Feedback"
                />
            </div>

            {/* Comment Form */}
            <div className="mb-8">
                <CommentForm
                    posterId={posterId}
                    type={activeTab}
                    scholarName={scholarName}
                    onSuccess={fetchComments}
                    placeholder={
                        activeTab === CommentType.QUESTION ? "Ask a question..." :
                            activeTab === CommentType.IDEA ? "Share an idea or connection..." :
                                "Leave feedback or encouragement..."
                    }
                    buttonLabel={
                        activeTab === CommentType.QUESTION ? "Ask Question" :
                            activeTab === CommentType.IDEA ? "Share Idea" :
                                "Leave Feedback"
                    }
                />
            </div>

            {/* Comment List */}
            <div className="flex-1 overflow-y-auto pr-2 -mr-2">
                {isLoading ? (
                    <div className="space-y-4">
                        <div className="h-24 bg-zinc-100 dark:bg-zinc-800 rounded-2xl animate-pulse" />
                        <div className="h-24 bg-zinc-100 dark:bg-zinc-800 rounded-2xl animate-pulse" />
                    </div>
                ) : filteredComments.length > 0 ? (
                    <CommentList
                        comments={filteredComments}
                        posterId={posterId}
                        scholarName={scholarName}
                        onReplySuccess={fetchComments}
                    />
                ) : (
                    <div className="py-12 text-center text-zinc-500">
                        <p className="text-sm">No {activeTab.toLowerCase()}s yet.</p>
                        <p className="text-xs mt-1">Be the first to start the conversation!</p>
                    </div>
                )}
            </div>
        </div>
    )
}

function TabButton({
    active,
    onClick,
    icon,
    label
}: {
    active: boolean;
    onClick: () => void;
    icon: React.ReactNode;
    label: string
}) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition-all",
                active
                    ? "bg-white text-brand-blue shadow-sm dark:bg-zinc-900 dark:text-blue-400"
                    : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
            )}
        >
            {icon}
            {label}
        </button>
    )
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ')
}
