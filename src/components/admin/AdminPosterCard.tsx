'use client'

import { PosterStatus } from '@prisma/client'
import { ExternalLink, User } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function AdminPosterCard({ poster }: { poster: any }) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const updateStatus = async (newStatus: PosterStatus) => {
        setIsLoading(true)
        try {
            const res = await fetch(`/api/admin/posters/${poster.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            })
            if (res.ok) {
                router.refresh()
            }
        } catch (error) {
            console.error('Failed to update status:', error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className={`group relative rounded-2xl bg-white p-5 shadow-sm ring-1 ring-zinc-200 transition-all hover:shadow-md dark:bg-zinc-900 dark:ring-zinc-800 ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}>
            <div className="mb-3 flex items-start justify-between gap-4">
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 line-clamp-2">
                    {poster.title}
                </h3>
            </div>

            <div className="mb-4 flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1.5 text-[10px] font-medium text-zinc-500">
                    <User className="h-3 w-3" />
                    {poster.scholarNames[0]}
                </div>
                <span className="text-zinc-300 dark:text-zinc-700">•</span>
                <div className="text-[10px] font-medium text-zinc-500">
                    {poster._count.views} views
                </div>
                <span className="text-zinc-300 dark:text-zinc-700">•</span>
                <div className="text-[10px] font-medium text-zinc-500">
                    {poster.session.name}
                </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <Link
                    href={`/sessions/${poster.session.slug}/posters/${poster.slug}?preview=true`}
                    className="flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:text-blue-700 transition-colors"
                >
                    Preview <ExternalLink className="h-3 w-3" />
                </Link>

                <div className="flex items-center gap-2">
                    {poster.status === PosterStatus.PENDING && (
                        <>
                            <button
                                className="rounded-lg bg-zinc-100 px-2 py-1 text-[10px] font-bold text-zinc-600 hover:bg-red-100 hover:text-red-700 transition-all"
                                onClick={() => updateStatus(PosterStatus.REJECTED)}
                            >
                                Reject
                            </button>
                            <button
                                className="rounded-lg bg-blue-600 px-2 py-1 text-[10px] font-bold text-white hover:bg-blue-700 transition-all"
                                onClick={() => updateStatus(PosterStatus.PUBLISHED)}
                            >
                                Publish
                            </button>
                        </>
                    )}
                    {poster.status === PosterStatus.PUBLISHED && (
                        <button
                            className="rounded-lg bg-zinc-100 px-2 py-1 text-[10px] font-bold text-zinc-600 hover:bg-zinc-200 transition-all underline-offset-2 hover:underline"
                            onClick={() => updateStatus(PosterStatus.PENDING)}
                        >
                            Unpublish
                        </button>
                    )}
                    {poster.status === PosterStatus.REJECTED && (
                        <button
                            className="rounded-lg bg-zinc-900 px-2 py-1 text-[10px] font-bold text-white hover:bg-zinc-800 transition-all"
                            onClick={() => updateStatus(PosterStatus.PENDING)}
                        >
                            Restore
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
