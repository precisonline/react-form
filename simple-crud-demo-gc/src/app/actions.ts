'use server'

import { revalidatePath } from 'next/cache'
import pool from '../../lib/db'
import { Task } from '../../lib/types'

// Action to get all tasks
export async function getTasks(): Promise<Task[]> {
  try {
    const client = await pool.connect()
    const result = await client.query(
      'SELECT * FROM tasks ORDER BY created_at DESC'
    )
    client.release()
    return result.rows as Task[]
  } catch (error) {
    console.error('Failed to fetch tasks:', error)
    return []
  }
}

// Action to add a new task
export async function addTask(formData: FormData) {
  const title = formData.get('title') as string

  if (!title) {
    return { error: 'Title is required' }
  }

  try {
    const client = await pool.connect()
    await client.query('INSERT INTO tasks (title) VALUES ($1)', [title])
    client.release()

    // Revalidate the path to trigger a data refetch and update the UI
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Failed to create task:', error)
    return { error: 'Failed to create task' }
  }
}

// Action to toggle task completion
export async function toggleTask(id: number, completed: boolean) {
  try {
    const client = await pool.connect()
    await client.query('UPDATE tasks SET completed = $1 WHERE id = $2', [
      !completed,
      id,
    ])
    client.release()
    revalidatePath('/')
  } catch (error) {
    console.error('Failed to toggle task:', error)
    return { error: 'Failed to toggle task' }
  }
}

// Action to delete a task
export async function deleteTask(id: number) {
  try {
    const client = await pool.connect()
    await client.query('DELETE FROM tasks WHERE id = $1', [id])
    client.release()
    revalidatePath('/')
  } catch (error) {
    console.error('Failed to delete task:', error)
    return { error: 'Failed to delete task' }
  }
}

// Action to update a task's title
export async function updateTask(id: number, newTitle: string) {
  try {
    const client = await pool.connect()
    await client.query('UPDATE tasks SET title = $1 WHERE id = $2', [
      newTitle,
      id,
    ])
    client.release()
    revalidatePath('/')
  } catch (error) {
    console.error('Failed to update task:', error)
    return { error: 'Failed to update task' }
  }
}
