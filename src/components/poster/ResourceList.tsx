'use client'

import { FileText, Database, Video, Link as LinkIcon, Download } from 'lucide-react'
import { Resource, ResourceType } from '@prisma/client'

interface ResourceListProps {
    resources: Resource[]
}

export function ResourceList({ resources }: ResourceListProps) {
    if (!resources || resources.length === 0) return null

    const getIcon = (type: ResourceType) => {
        switch (type) {
            case 'PDF': return <FileText className="h-4 w-4" />
            case 'DATASET': return <Database className="h-4 w-4" />
            case 'VIDEO': return <Video className="h-4 w-4" />
            default: return <LinkIcon className="h-4 w-4" />
        }
    }

    const getColor = (type: ResourceType) => {
        switch (type) {
            case 'PDF': return 'text-rose-500 bg-rose-50 dark:bg-rose-900/20 dark:text-rose-400'
            case 'DATASET': return 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400'
            case 'VIDEO': return 'text-violet-500 bg-violet-50 dark:bg-violet-900/20 dark:text-violet-400'
            default: return 'text-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400'
        }
    }

    return (
        <div className="space-y-3">
            <h4 className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2">Deep Dive Resources</h4>
            {resources.map((resource) => (
                <a
                    key={resource.id}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-100 dark:border-zinc-800 transition-colors group"
                >
                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 ${getColor(resource.type)}`}>
                        {getIcon(resource.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {resource.label}
                        </div>
                        <div className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">
                            {resource.type}
                        </div>
                    </div>
                    <Download className="h-4 w-4 text-zinc-300 dark:text-zinc-600 group-hover:text-zinc-500 dark:group-hover:text-zinc-400 transition-colors" />
                </a>
            ))}
        </div>
    )
}
