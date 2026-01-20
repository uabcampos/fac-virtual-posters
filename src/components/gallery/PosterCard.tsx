import Link from 'next/link'
import Image from 'next/image'
import { MessageSquare } from 'lucide-react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

interface PosterCardProps {
    sessionSlug: string
    poster: {
        id: string
        slug: string
        title: string
        scholarNames: string[]
        institutions: string[]
        whyThisMatters: string
        tags: string[]
        posterImageUrl: string
        _count: {
            comments: number
        }
    }
}

export function PosterCard({ sessionSlug, poster }: PosterCardProps) {
    return (
        <Link
            href={`/sessions/${sessionSlug}/posters/${poster.slug}`}
            className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800"
        >
            {/* Thumbnail */}
            <div className="relative aspect-square w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                <Image
                    src={poster.posterImageUrl}
                    alt={poster.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute top-4 right-4 flex items-center gap-1 rounded-full bg-black/40 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
                    <MessageSquare className="h-3.5 w-3.5" />
                    {poster._count.comments}
                </div>
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col p-5">
                <div className="mb-2 flex flex-wrap gap-1.5">
                    {poster.tags.slice(0, 3).map((tag) => (
                        <span
                            key={tag}
                            className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                <h3 className="mb-1 line-clamp-2 text-lg font-bold leading-tight text-zinc-900 group-hover:text-forge-teal dark:text-zinc-100 dark:group-hover:text-brand-blue">
                    {poster.title}
                </h3>

                <p className="mb-3 text-sm font-medium text-zinc-600 dark:text-zinc-400">
                    {poster.scholarNames.join(', ')}
                </p>

                <p className="mb-4 line-clamp-2 text-sm text-zinc-500 dark:text-zinc-500 italic">
                    &ldquo;{poster.whyThisMatters}&rdquo;
                </p>

                <div className="mt-auto flex items-center justify-between border-t border-zinc-100 pt-4 dark:border-zinc-800">
                    <span className="text-xs font-medium text-zinc-400 dark:text-zinc-600">
                        {poster.institutions[0]}
                    </span>
                    <span className="text-xs font-bold text-forge-teal opacity-0 transition-opacity group-hover:opacity-100 dark:text-brand-blue">
                        View Poster →
                    </span>
                </div>
            </div>
        </Link>
    )
}
