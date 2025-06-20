'use server'

import { createServerClient } from '@supabase/ssr'
import { revalidatePath } from 'next/cache'
import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'

type ActionResult = { success: boolean; data?: unknown; error?: string }

export async function createNote(formData: FormData): Promise<ActionResult> {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (name: string) => cookieStore.get(name)?.value } }
  )
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  const title = formData.get('title')?.toString()
  const content = formData.get('content')?.toString()

  if (!title || !content) {
    return { success: false, error: 'Title and content are required.' }
  }

  const { data, error } = await supabase
    .from('notes')
    .insert({ title, content, user_id: user.id })
    .select()
    .single()

  if (error) {
    console.error('Error creating note:', error)
    return { success: false, error: 'Database error: Could not create note.' }
  }

  revalidatePath('/')
  return { success: true, data }
}

export async function deleteNote(noteId: number): Promise<ActionResult> {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (name: string) => cookieStore.get(name)?.value } }
  )
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  const { error } = await supabase
    .from('notes')
    .delete()
    .match({ id: noteId, user_id: user.id })

  if (error) {
    console.error('Error deleting note:', error)
    return { success: false, error: 'Database error: Could not delete note.' }
  }

  revalidatePath('/')
  return { success: true }
}

export async function updateNote(
  noteId: number,
  title: string,
  content: string
): Promise<ActionResult> {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (name: string) => cookieStore.get(name)?.value } }
  )
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  const { data, error } = await supabase
    .from('notes')
    .update({ title, content })
    .match({ id: noteId, user_id: user.id })
    .select()
    .single()

  if (error) {
    console.error('Error updating note:', error)
    return { success: false, error: 'Database error: Could not update note.' }
  }

  revalidatePath('/')
  return { success: true, data }
}

export async function signUp(formData: FormData) {
  const origin = (await headers()).get('origin')
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (name: string) => cookieStore.get(name)?.value } }
  )

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  })

  if (error) {
    console.error('Sign up error:', error.message)
    return redirect('/auth/auth-code-error?message=Could not authenticate user')
  }

  return redirect('/auth/confirm-email')
}

// 'use server'

// import { revalidatePath } from 'next/cache'
// import { headers, cookies } from 'next/headers'
// import { redirect } from 'next/navigation'
// import { withSupabaseUser } from '@/utils/supabase-utils'
// import { handleActionError } from '@/utils/error-handler'
// import { createServerClient } from '@supabase/ssr'
// import { SupabaseClient, User } from '@supabase/supabase-js'

// type ActionResult = { success: boolean; data?: unknown; error?: string }

// export async function createNote(formData: FormData) {
//   return withSupabaseUser(
//     async (
//       supabase: SupabaseClient,
//       user: User,
//       schemaName: string
//     ): Promise<ActionResult> => {
//       try {
//         const title = formData.get('title')?.toString()
//         const content = formData.get('content')?.toString()

//         if (!title || !content) {
//           return { success: false, error: 'Title and content are required.' }
//         }

//         if (title.length > 100) {
//           return {
//             success: false,
//             error: 'Title must be less than 100 characters.',
//           }
//         }

//         if (content.length > 1000) {
//           return {
//             success: false,
//             error: 'Content must be less than 1000 characters.',
//           }
//         }

//         const { data, error } = await supabase.rpc('insert_tenant_note', {
//           tenant_schema: schemaName,
//           note_title: title,
//           note_content: content,
//           note_user_id: user.id,
//         })

//         if (error) {
//           console.error('Error creating note:', error)
//           return {
//             success: false,
//             error: `Database error: Could not create the note. ${error.message}`,
//           }
//         }

//         console.log('✅ Note created successfully:', data)
//         revalidatePath('/')
//         return { success: true, data }
//       } catch (error: unknown) {
//         return handleActionError(error, 'Failed to create note')
//       }
//     }
//   )
// }

// export async function deleteNote(noteId: number) {
//   return withSupabaseUser(
//     async (
//       supabase: SupabaseClient,
//       user: User,
//       schemaName: string
//     ): Promise<ActionResult> => {
//       try {
//         const { error } = await supabase.rpc('delete_tenant_note', {
//           tenant_schema: schemaName,
//           note_id: noteId,
//         })

//         if (error) {
//           console.error('Error deleting note:', error)
//           return {
//             success: false,
//             error: `Database error: Could not delete the note. ${error.message}`,
//           }
//         }

//         console.log('✅ Note deleted successfully')
//         revalidatePath('/')
//         return { success: true }
//       } catch (error: unknown) {
//         return handleActionError(error, 'Failed to delete note')
//       }
//     }
//   )
// }

// export async function updateNote(
//   noteId: number,
//   title: string,
//   content: string
// ) {
//   return withSupabaseUser(
//     async (
//       supabase: SupabaseClient,
//       user: User,
//       schemaName: string
//     ): Promise<ActionResult> => {
//       try {
//         if (!title || !content) {
//           return { success: false, error: 'Title and content cannot be empty.' }
//         }

//         if (title.length > 100) {
//           return {
//             success: false,
//             error: 'Title must be less than 100 characters.',
//           }
//         }

//         if (content.length > 1000) {
//           return {
//             success: false,
//             error: 'Content must be less than 1000 characters.',
//           }
//         }

//         const { data, error } = await supabase.rpc('update_tenant_note', {
//           tenant_schema: schemaName,
//           note_id: noteId,
//           note_title: title,
//           note_content: content,
//         })

//         if (error) {
//           console.error('Error updating note:', error)
//           return {
//             success: false,
//             error: `Database error: Could not update the note. ${error.message}`,
//           }
//         }

//         console.log('✅ Note updated successfully:', data)
//         revalidatePath('/')
//         return { success: true, data }
//       } catch (error: unknown) {
//         return handleActionError(error, 'Failed to update note')
//       }
//     }
//   )
// }

// export async function signUp(formData: FormData) {
//   console.log('[ACTION] signUp: Action started.')

//   const origin = (await headers()).get('origin')
//   const email = formData.get('email') as string
//   const password = formData.get('password') as string

//   // Create the server-side client that can read/write cookies
//   const cookieStore = await cookies()
//   const supabase = createServerClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//     {
//       cookies: {
//         get(name: string) {
//           return cookieStore.get(name)?.value
//         },
//       },
//     }
//   )

//   console.log(`[ACTION] signUp: Attempting to sign up user: ${email}`)

//   // 1. Sign up the user as usual
//   const { data, error } = await supabase.auth.signUp({
//     email,
//     password,
//     options: {
//       emailRedirectTo: `${origin}/auth/callback`,
//     },
//   })

//   if (error || !data.user) {
//     console.error('[ACTION] signUp: Supabase auth error:', error?.message)
//     return redirect('/auth/auth-code-error?message=Could not authenticate user')
//   }

//   console.log(
//     `[ACTION] signUp: User created successfully. User ID: ${data.user.id}`
//   )
//   console.log(
//     `[ACTION] signUp: Checking environment. NODE_ENV is: "${process.env.NODE_ENV}"`
//   )

//   2. DEVELOPMENT-ONLY LOGIC
//   if (process.env.NODE_ENV === 'development') {
//     console.log(
//       '[ACTION] signUp: Development mode detected. Preparing to call Edge Function.'
//     )

//     const provisionUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/provision-tenant`
//     const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

//     if (!serviceKey) {
//       console.error(
//         '[ACTION] signUp: FATAL ERROR! SUPABASE_SERVICE_ROLE_KEY is not defined in your .env.local file.'
//       )
//       return redirect('/auth/confirm-email')
//     }

//     console.log(`[ACTION] signUp: Attempting to fetch from: ${provisionUrl}`)

//     try {
//       const response = await fetch(provisionUrl, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${serviceKey}`,
//         },
//         body: JSON.stringify(data.user),
//       })

//       console.log(`[ACTION] signUp: Fetch response status: ${response.status}`)

//       if (!response.ok) {
//         const errorBody = await response.text()
//         throw new Error(
//           `Failed to provision tenant: Status ${response.status} - ${errorBody}`
//         )
//       }

//       const responseData = await response.json()
//       console.log(
//         '[ACTION] signUp: ✅ Local tenant provisioned successfully:',
//         responseData
//       )
//     } catch (provisionError) {
//       console.error(
//         '❌ [ACTION] signUp: Local provisioning FAILED:',
//         provisionError
//       )
//     }
//   }

//   // 3. Redirect the user
//   console.log('[ACTION] signUp: Action finished. Redirecting...')
//   return redirect('/auth')
// }
