import { PrismaClient, SessionStatus, PosterStatus, CommentType } from '@prisma/client'

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
            slug: 'live-session',
            status: SessionStatus.LIVE,
            startAt: new Date(),
            endAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
    })

    const realPosters = [
        { file: 'Allen Watts.pdf', scholar: 'Allen Watts', title: 'Healthcare Innovation in Rural Communities' },
        { file: 'Andrabi.pdf', scholar: 'Andrabi', title: 'Molecular Markers in Diagnostic Imaging' },
        { file: 'Caldwell.pdf', scholar: 'Caldwell', title: 'Sustainable Infrastructure Development' },
        { file: 'Cardozo.pdf', scholar: 'Cardozo', title: 'Public Policy and Social Equity' },
        { file: 'Clarkson.pdf', scholar: 'Clarkson', title: 'Advances in Pediatric Care' },
        { file: 'Crockett.pdf', scholar: 'Crockett', title: 'Behavioral Economics and Financial Literacy' },
        { file: 'Gazaway.pdf', scholar: 'Gazaway', title: 'Quantum Computing and Cryptography' },
        { file: 'Gerke.pdf', scholar: 'Gerke', title: 'Machine Learning for Environmental Protection' },
        { file: 'Ghazi.pdf', scholar: 'Ghazi', title: 'Renewable Energy Solutions for Developing Nations' },
        { file: 'Gravett.pdf', scholar: 'Gravett', title: 'Artificial Intelligence in Legal Systems' },
        { file: 'Karlson.pdf', scholar: 'Karlson', title: 'Urban Planning and Green Spaces' },
        { file: 'Khodneva.pdf', scholar: 'Khodneva', title: 'Nanotechnology in Cancer Treatment' },
        { file: 'Kinsey.pdf', scholar: 'Kinsey', title: 'Educational Technology for Inclusive Learning' },
        { file: 'Lai.pdf', scholar: 'Lai', title: 'Cybersecurity Strategies for Modern Enterprises' },
        { file: 'Myers.pdf', scholar: 'Myers', title: 'Neuroscience and Cognitive Development' },
        { file: 'Worthington.pdf', scholar: 'Worthington', title: 'Space Exploration and Colonization Ethics' },
        { file: 'Xie1.pdf', scholar: 'Xie', title: 'Big Data Analytics for Retail Optimization' },
        { file: 'Xie2.pdf', scholar: 'Xie', title: 'Blockchain for Secure Supply Chain Management' },
    ]

    console.log(`Seeding ${realPosters.length} real posters...`)

    for (const [index, p] of realPosters.entries()) {
        const slug = p.file.toLowerCase().replace(/\s+/g, '-').replace('.pdf', '')

        await prisma.poster.create({
            data: {
                title: p.title,
                scholarNames: [p.scholar],
                institutions: ['FAC Scholars Program'],
                tags: ['Research', 'Innovation', '2026'],
                whyThisMatters: 'This research addresses a critical gap in our current understanding of the field, offering data-driven insights for future development.',
                summaryProblem: 'Traditional models lack the flexibility required for modern dynamic environments.',
                summaryAudience: 'Researchers, industry leaders, and policy makers.',
                summaryMethods: 'A multi-disciplinary approach combining quantitative analysis with qualitative case studies.',
                summaryFindings: 'Significant improvements in efficiency and accuracy compared to legacy systems.',
                summaryChange: 'A shift towards more adaptive and decentralized frameworks.',
                welcomeMessage: `Hi, I am ${p.scholar}. Welcome to my poster session!`,
                feedbackPrompt: 'I am particularly interested in how this model can be applied in different geographical contexts.',
                sessionId: session.id,
                slug,
                status: PosterStatus.PUBLISHED,
                publishedAt: new Date(),
                posterPdfUrl: `/uploads/${p.file}`,
                // Using a high-quality vertical placeholder for the UI while the PDF is the main asset
                posterImageUrl: `https://picsum.photos/seed/${slug}/1200/1800`,
                posterImageWidth: 1200,
                posterImageHeight: 1800,
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
