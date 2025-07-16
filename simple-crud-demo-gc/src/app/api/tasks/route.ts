import { NextResponse } from 'next/server'
import pool from '../../../../lib/db'
import { Task } from '../../../../lib/types/index'

// To get all tasks
export async function GET() {
  try {
    const client = await pool.connect()
    const result = await client.query(
      'SELECT * FROM tasks ORDER BY created_at DESC'
    )
    client.release()
    return NextResponse.json(result.rows as Task[])
  } catch (error) {
    console.error('Failed to fetch tasks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    )
  }
}

// To create a new task
export async function POST(request: Request) {
  try {
    const { title } = await request.json()
    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }
    const client = await pool.connect()
    const result = await client.query(
      'INSERT INTO tasks (title) VALUES ($1) RETURNING *',
      [title]
    )
    client.release()
    return NextResponse.json(result.rows[0] as Task, { status: 201 })
  } catch (error) {
    console.error('Failed to create task:', error)
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    )
  }
}
