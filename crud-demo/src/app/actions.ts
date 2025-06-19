'use server'

import { revalidatePath } from 'next/cache'
import { withSupabaseUser } from '@/utils/supabase-utils'
import { handleActionError } from '@/utils/error-handler'
import { SupabaseClient, User } from '@supabase/supabase-js'

type ActionResult = { success: boolean; data?: unknown; error?: string }

export async function createNote(formData: FormData) {
  return withSupabaseUser(
    async (
      supabase: SupabaseClient,
      user: User,
      schemaName: string
    ): Promise<ActionResult> => {
      try {
        const title = formData.get('title')?.toString()
        const content = formData.get('content')?.toString()

        if (!title || !content) {
          return { success: false, error: 'Title and content are required.' }
        }

        if (title.length > 100) {
          return {
            success: false,
            error: 'Title must be less than 100 characters.',
          }
        }

        if (content.length > 1000) {
          return {
            success: false,
            error: 'Content must be less than 1000 characters.',
          }
        }

        const { data, error } = await supabase.rpc('insert_tenant_note', {
          tenant_schema: schemaName,
          note_title: title,
          note_content: content,
          note_user_id: user.id,
        })

        if (error) {
          console.error('Error creating note:', error)
          return {
            success: false,
            error: `Database error: Could not create the note. ${error.message}`,
          }
        }

        console.log('✅ Note created successfully:', data)
        revalidatePath('/')
        return { success: true, data }
      } catch (error: unknown) {
        return handleActionError(error, 'Failed to create note')
      }
    }
  )
}

export async function deleteNote(noteId: number) {
  return withSupabaseUser(
    async (
      supabase: SupabaseClient,
      user: User,
      schemaName: string
    ): Promise<ActionResult> => {
      try {
        const { error } = await supabase.rpc('delete_tenant_note', {
          tenant_schema: schemaName,
          note_id: noteId,
        })

        if (error) {
          console.error('Error deleting note:', error)
          return {
            success: false,
            error: `Database error: Could not delete the note. ${error.message}`,
          }
        }

        console.log('✅ Note deleted successfully')
        revalidatePath('/')
        return { success: true }
      } catch (error: unknown) {
        return handleActionError(error, 'Failed to delete note')
      }
    }
  )
}

export async function updateNote(
  noteId: number,
  title: string,
  content: string
) {
  return withSupabaseUser(
    async (
      supabase: SupabaseClient,
      user: User,
      schemaName: string
    ): Promise<ActionResult> => {
      try {
        if (!title || !content) {
          return { success: false, error: 'Title and content cannot be empty.' }
        }

        if (title.length > 100) {
          return {
            success: false,
            error: 'Title must be less than 100 characters.',
          }
        }

        if (content.length > 1000) {
          return {
            success: false,
            error: 'Content must be less than 1000 characters.',
          }
        }

        const { data, error } = await supabase.rpc('update_tenant_note', {
          tenant_schema: schemaName,
          note_id: noteId,
          note_title: title,
          note_content: content,
        })

        if (error) {
          console.error('Error updating note:', error)
          return {
            success: false,
            error: `Database error: Could not update the note. ${error.message}`,
          }
        }

        console.log('✅ Note updated successfully:', data)
        revalidatePath('/')
        return { success: true, data }
      } catch (error: unknown) {
        return handleActionError(error, 'Failed to update note')
      }
    }
  )
}
