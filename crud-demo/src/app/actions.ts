'use server'

import { createServerClient } from '@supabase/ssr'
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
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth')
  }

  const schemaName = user.user_metadata.schema_name
  if (!schemaName) {
    throw new Error('User does not have a tenant schema assigned')
  }

  return { supabase, user, schemaName }
}

export async function createNote(formData: FormData) {
  try {
    const { supabase, user, schemaName } = await getSupabaseWithUser()

    const title = formData.get('title') as string
    const content = formData.get('content') as string

    if (!title || !content) {
      throw new Error('Title and content are required')
    }

    const { data, error } = await supabase.rpc('insert_tenant_note', {
      tenant_schema: schemaName,
      note_title: title,
      note_content: content,
      note_user_id: user.id,
    })

    if (error) {
      console.error('Error creating note:', error)
      throw error
    }

    console.log('✅ Note created successfully:', data)
    revalidatePath('/')
    return { success: true, data }
  } catch (error: any) {
    console.error('❌ Failed to create note:', error.message)
    return { success: false, error: error.message }
  }
}

export async function deleteNote(noteId: number) {
  try {
    const { supabase, schemaName } = await getSupabaseWithUser()

    const { data, error } = await supabase.rpc('delete_tenant_note', {
      tenant_schema: schemaName,
      note_id: noteId,
    })

    if (error) {
      console.error('Error deleting note:', error)
      throw error
    }

    console.log('✅ Note deleted successfully')
    revalidatePath('/')
    return { success: true }
  } catch (error: any) {
    console.error('❌ Failed to delete note:', error.message)
    return { success: false, error: error.message }
  }
}

export async function updateNote(
  noteId: number,
  title: string,
  content: string
) {
  try {
    const { supabase, schemaName } = await getSupabaseWithUser()

    const { data, error } = await supabase.rpc('update_tenant_note', {
      tenant_schema: schemaName,
      note_id: noteId,
      note_title: title,
      note_content: content,
    })

    if (error) {
      console.error('Error updating note:', error)
      throw error
    }

    console.log('✅ Note updated successfully:', data)
    revalidatePath('/')
    return { success: true, data }
  } catch (error: any) {
    console.error('❌ Failed to update note:', error.message)
    return { success: false, error: error.message }
  }
}
