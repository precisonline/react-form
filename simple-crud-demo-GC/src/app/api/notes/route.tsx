import { NextResponse, NextRequest } from 'next/server'
import prisma from '../../../../lib/prisma'

// GET /api/notes - Fetches all notes
export async function GET() {
  const notes = await prisma.note.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  })
  return NextResponse.json(notes)
}

// POST /api/notes - Creates a new note
export async function POST(request: NextRequest) {
  const data = await request.json()
  const newNote = await prisma.note.create({
    data: {
      title: data.title,
      content: data.content,
      userId: 'user_123',
    },
  })
  return NextResponse.json(newNote)
}
