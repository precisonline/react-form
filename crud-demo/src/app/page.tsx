import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import NotesClient from './notes-client'

type Note = {
  id: number
  title: string
  content: string
  user_id: string
  tags: string[]
  is_favorite: boolean
  created_at: string
  updated_at: string
}

export default async function NotesPage() {
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

  const schemaName = user.user_metadata.schemaName
  console.log('Schema Name from metadata:', schemaName)

  let notes: Note[] = []

  if (schemaName) {
    // Use RPC to query the tenant schema
    const { data, error } = await supabase.rpc('get_tenant_notes', {
      tenant_schema: schemaName,
    })

    if (error) {
      console.error('Error fetching notes:', error)
      console.error('Full error details:', JSON.stringify(error, null, 2))
    } else {
      notes = data as Note[]
      console.log(
        `✅ Successfully fetched ${notes.length} notes from ${schemaName}`
      )
    }
  } else {
    console.error(
      'Could not fetch notes because schemaName is missing from user metadata!'
    )
  }

  return (
    <NotesClient
      initialNotes={notes}
      user={user}
      schemaName={schemaName || 'Not Found'}
    />
  )
}
