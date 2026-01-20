import { SubmissionForm } from '@/components/submission/SubmissionForm'
import prisma from '@/lib/prisma'
import { SessionStatus } from '@prisma/client'

export default async function SubmitPage() {
    // Get the active session to display its name
    const activeSession = await prisma.session.findFirst({
        where: { status: SessionStatus.LIVE },
        orderBy: { startAt: 'desc' }
    })

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
            <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="mb-12 text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-5xl">
                        Submit Your Poster
                    </h1>
                    <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
                        {activeSession
                            ? `Share your research with the ${activeSession.name} community.`
                            : 'Join our research community and share your work.'}
                    </p>
                </div>

                <div className="rounded-3xl bg-white p-8 shadow-xl ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-800 sm:p-12">
                    <SubmissionForm sessionId={activeSession?.id} />
                </div>

                <p className="mt-8 text-center text-xs text-zinc-500">
                    Trouble with your submission? Contact support at support@fac-posters.org
                </p>
            </div>
        </div>
    )
}
