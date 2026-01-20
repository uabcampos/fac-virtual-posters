import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { v4 as uuidv4 } from 'uuid'

export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params

        // Create a new view record
        // In a real app, we might want to de-duplicate views by IP or session
        await prisma.posterView.create({
            data: {
                posterId: id,
                viewerHash: uuidv4() // In a real app, hash the IP
            }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('View tracking error:', error)
        return NextResponse.json({ error: 'Failed to record view' }, { status: 500 })
    }
}
