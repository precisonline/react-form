'use server'

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

async function getSupabaseWithUser() {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth')
  }

  const schemaName = user.user_metadata?.schema_name
  if (!schemaName) {
    // This is a critical application error. A user should not exist
    // without their tenant schema. Consider logging them out.
    await supabase.auth.signOut()
    redirect('/auth?error=No tenant assigned. Please contact support.')
  }

  return { supabase, user, schemaName }
}

export async function createNote(formData: FormData) {
  try {
    const { supabase, user, schemaName } = await getSupabaseWithUser()

    const title = formData.get('title')?.toString()
    const content = formData.get('content')?.toString()

    if (!title || !content) {
      return { success: false, error: 'Title and content are required.' }
    }

    const { data, error } = await supabase.rpc('insert_tenant_note', {
      tenant_schema: schemaName,
      note_title: title,
      note_content: content,
      note_user_id: user.id,
    })

    if (error) {
      console.error('Error creating note:', error.message)
      return {
        success: false,
        error: 'Database error: Could not create the note.',
      }
    }

    console.log('✅ Note created successfully:', data)
    revalidatePath('/')
    return { success: true, data }
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unexpected error occurred.'
    console.error('❌ Failed to create note:', errorMessage)
    return { success: false, error: errorMessage }
  }
}

export async function deleteNote(noteId: number) {
  try {
    const { supabase, schemaName } = await getSupabaseWithUser()

    const { error } = await supabase.rpc('delete_tenant_note', {
      tenant_schema: schemaName,
      note_id: noteId,
    })

    if (error) {
      console.error('Error deleting note:', error.message)
      return {
        success: false,
        error: 'Database error: Could not delete the note.',
      }
    }

    console.log('✅ Note deleted successfully')
    revalidatePath('/')
    return { success: true }
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unexpected error occurred.'
    console.error('❌ Failed to delete note:', errorMessage)
    return { success: false, error: errorMessage }
  }
}

export async function updateNote(
  noteId: number,
  title: string,
  content: string
) {
  try {
    const { supabase, schemaName } = await getSupabaseWithUser()

    if (!title || !content) {
      return { success: false, error: 'Title and content cannot be empty.' }
    }

    const { data, error } = await supabase.rpc('update_tenant_note', {
      tenant_schema: schemaName,
      note_id: noteId,
      note_title: title,
      note_content: content,
    })

    if (error) {
      console.error('Error updating note:', error.message)
      return {
        success: false,
        error: 'Database error: Could not update the note.',
      }
    }

    console.log('✅ Note updated successfully:', data)
    revalidatePath('/')
    return { success: true, data }
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unexpected error occurred.'
    console.error('❌ Failed to update note:', errorMessage)
    return { success: false, error: errorMessage }
  }
}
