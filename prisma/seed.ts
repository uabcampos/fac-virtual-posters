import { PrismaClient, SessionStatus, PosterStatus, CommentType, IntroMediaType } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Clearing database...')
    await prisma.posterView.deleteMany()
    await prisma.comment.deleteMany()
    await prisma.poster.deleteMany()
    await prisma.session.deleteMany()

    console.log('Creating live session...')
    const session = await prisma.session.create({
        data: {
            name: 'FAC Summer 2026 Virtual Poster Session',
            slug: 'summer-2026',
            status: SessionStatus.LIVE,
            startAt: new Date(),
            endAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        },
    })

    console.log('Creating sample posters...')
    const postersData = [
        {
            title: 'Community Engagement in Urban Health Initiatives',
            scholarNames: ['Dr. Sarah Chen', 'James Wilson'],
            institutions: ['University of Metro', 'Global Health Corp'],
            tags: ['Health', 'Urban', 'Community'],
            whyThisMatters: 'Urban health initiatives often fail due to lack of community trust. This work bridges that gap.',
            summaryProblem: 'Low participation rates in urban screening programs.',
            summaryAudience: 'City planners and public health officials.',
            summaryMethods: 'Six-month ethnographic study in three neighborhoods.',
            summaryFindings: 'Trust is built through local navigators rather than digital outreach.',
            summaryChange: 'Future programs should allocate 40% of budget to community-led outreach.',
            welcomeMessage: 'Hi! I am Sarah. I love talking about how people interact with city services. Ask me anything!',
            feedbackPrompt: 'I would love feedback on how to scale the local navigator model.',
        },
        {
            title: 'Sustainable Water Reclamation in Arid Climates',
            scholarNames: ['Mateo Rodriguez'],
            institutions: ['Desert Research Institute'],
            tags: ['Sustainability', 'Water', 'Engineering'],
            whyThisMatters: 'Water scarcity is the defining crisis of our century in arid zones.',
            summaryProblem: 'Current reclamation systems lose 15% through evaporation.',
            summaryAudience: 'Agricultural engineers and municipal water boards.',
            summaryMethods: 'Pilot testing of a closed-loop subterranean filtration system.',
            summaryFindings: 'Evaporation was reduced to 2% and water quality exceeded standards.',
            summaryChange: 'This could save 200 million gallons annually in the Southwest.',
            welcomeMessage: 'Welcome! This project is the result of three years of field work.',
        },
        // Adding more mock data to reach 10
        ...Array.from({ length: 8 }).map((_, i) => ({
            title: `Poster Title ${i + 3}: Exploring Topic ${String.fromCharCode(65 + i)}`,
            scholarNames: [`Scholar ${i + 3}`],
            institutions: [`Institution ${i + 3}`],
            tags: ['Research', 'Science', 'Innovation'],
            whyThisMatters: `Brief explanation of why research ${i + 3} is important.`,
            summaryProblem: 'Description of the problem being solved.',
            summaryAudience: 'Target stakeholders.',
            summaryMethods: 'Overview of methodology used.',
            summaryFindings: 'Key results and outcomes.',
            summaryChange: 'Potential impact on the field.',
        })),
    ]

    for (const [index, p] of postersData.entries()) {
        const poster = await prisma.poster.create({
            data: {
                ...p,
                sessionId: session.id,
                slug: `poster-${index + 1}`,
                status: PosterStatus.PUBLISHED,
                publishedAt: new Date(),
                posterImageUrl: `https://picsum.photos/seed/poster${index}/1200/1800`,
                posterPdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
                posterImageWidth: 1200,
                posterImageHeight: 1800,
            },
        })

        // Create some comments
        await prisma.comment.create({
            data: {
                posterId: poster.id,
                type: CommentType.QUESTION,
                authorName: 'Curious Researcher',
                authorRole: 'Peer',
                content: `Very interesting work! How did you handle the data validation in step ${index + 1}?`,
            },
        })

        await prisma.comment.create({
            data: {
                posterId: poster.id,
                type: CommentType.FEEDBACK,
                authorName: 'Prof. Miller',
                authorRole: 'Mentor',
                content: 'Excellent presentation. The visual hierarchy is very clear.',
            },
        })
    }

    console.log('Seed completed successfully!')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
