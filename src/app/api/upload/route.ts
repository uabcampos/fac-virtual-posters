import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData()
        const file = formData.get('file') as Blob | null

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
        }

        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'application/pdf']
        if (!validTypes.includes(file.type)) {
            return NextResponse.json({ error: 'Invalid file type. Only JPG, PNG, and PDF are allowed.' }, { status: 400 })
        }

        // Validate file size (e.g., 10MB)
        const maxSize = 10 * 1024 * 1024
        if (file.size > maxSize) {
            return NextResponse.json({ error: 'File too large. Maximum size is 10MB.' }, { status: 400 })
        }

        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Create a unique filename
        const extension = file.type === 'application/pdf' ? 'pdf' : file.type.split('/')[1]
        const filename = `${uuidv4()}.${extension}`
        const path = join(process.cwd(), 'public/uploads', filename)

        await writeFile(path, buffer)

        return NextResponse.json({
            url: `/uploads/${filename}`,
            filename: filename
        }, { status: 201 })

    } catch (error) {
        console.error('Upload error:', error)
        return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 })
    }
}
