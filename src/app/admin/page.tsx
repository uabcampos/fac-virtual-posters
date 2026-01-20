import prisma from '@/lib/prisma'
import { PosterStatus } from '@prisma/client'
import { CheckCircle, XCircle, Clock, MessageSquare } from 'lucide-react'
import { AdminPosterCard } from '../../components/admin/AdminPosterCard'
import { AdminCommentItem } from '../../components/admin/AdminCommentItem'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
    const [posters, recentComments] = await Promise.all([
        prisma.poster.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                session: true,
                _count: {
                    select: {
                        comments: true,
                        views: true
                    }
                }
            }
        }),
        prisma.comment.findMany({
            take: 10,
            orderBy: { createdAt: 'desc' },
            include: {
                poster: {
                    include: {
                        session: true
                    }
                }
            }
        })
    ])

    const pending = posters.filter(p => p.status === PosterStatus.PENDING)
    const published = posters.filter(p => p.status === PosterStatus.PUBLISHED)
    const rejected = posters.filter(p => p.status === PosterStatus.REJECTED)

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-4 sm:p-8">
            <div className="mx-auto max-w-7xl">
                <header className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100">Admin Dashboard</h1>
                        <p className="text-zinc-500 dark:text-zinc-400">Manage submissions and moderate content.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                            <span className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
                            Live Session
                        </span>
                    </div>
                </header>

                <div className="flex flex-col gap-12">
                    {/* Poster Moderation Sections */}
                    <div className="grid gap-8 lg:grid-cols-3">
                        <StatusColumn
                            title="Pending Review"
                            posters={pending}
                            icon={<Clock className="h-4 w-4 text-amber-500" />}
                        />
                        <StatusColumn
                            title="Published"
                            posters={published}
                            icon={<CheckCircle className="h-4 w-4 text-green-500" />}
                        />
                        <StatusColumn
                            title="Rejected / Drafts"
                            posters={rejected}
                            icon={<XCircle className="h-4 w-4 text-red-500" />}
                        />
                    </div>

                    {/* Recent Comments Section */}
                    <section className="rounded-3xl bg-white p-6 sm:p-8 shadow-sm ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-800">
                        <div className="mb-6 flex items-center gap-2">
                            <MessageSquare className="h-5 w-5 text-blue-600" />
                            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Recent Comments</h2>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                            {recentComments.map(comment => (
                                <AdminCommentItem key={comment.id} comment={comment} />
                            ))}
                            {recentComments.length === 0 && (
                                <p className="col-span-2 text-sm italic text-zinc-500">No comments yet</p>
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}

function StatusColumn({ title, posters, icon }: { title: string; posters: any[]; icon: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                    {icon}
                    <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-500">{title}</h2>
                </div>
                <span className="rounded-full bg-zinc-200 px-2 py-0.5 text-[10px] font-bold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                    {posters.length}
                </span>
            </div>

            <div className="flex flex-col gap-3">
                {posters.map(poster => (
                    <AdminPosterCard key={poster.id} poster={poster} />
                ))}
                {posters.length === 0 && (
                    <div className="flex h-32 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-200 text-zinc-400 dark:border-zinc-800">
                        <p className="text-xs italic">No posters in this status</p>
                    </div>
                )}
            </div>
        </div>
    )
}
