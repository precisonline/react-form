import { NextResponse } from 'next/server'
import pool from '../../../../../lib/db'
import { Task } from '../../../../../lib/types/index'

// Define a type for the context object that contains params
type RouteContext = {
  params: {
    id: string
  }
}

// To update a task
export async function PUT(request: Request, context: RouteContext) {
  try {
    const { id } = context.params // Access params from the context object
    const { title, completed }: Partial<Task> = await request.json()

    const client = await pool.connect()
    const result = await client.query(
      'UPDATE tasks SET title = $1, completed = $2 WHERE id = $3 RETURNING *',
      [title, completed, id]
    )
    client.release()

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }
    return NextResponse.json(result.rows[0] as Task)
  } catch (error) {
    console.error('Failed to update task:', error)
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 }
    )
  }
}

// To delete a task
export async function DELETE(request: Request, context: RouteContext) {
  try {
    const { id } = context.params
    const client = await pool.connect()
    await client.query('DELETE FROM tasks WHERE id = $1', [id])
    client.release()
    return NextResponse.json({ message: 'Task deleted successfully' })
  } catch (error) {
    console.error('Failed to delete task:', error)
    return NextResponse.json(
      { error: 'Failed to delete task' },
      { status: 500 }
    )
  }
}
