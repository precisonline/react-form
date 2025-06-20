import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import NotesClient from './notes-client'

export default async function NotesPage() {
  const cookieStore = await cookies()

  // 1. Create a server-side Supabase client
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

  // 2. Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 3. Protect the route
  if (!user) {
    redirect('/auth')
  }

  // 4. Fetch the initial data for the page
  const { data: notes, error } = await supabase.from('notes').select('*')

  // 5. Handle potential errors during the initial data fetch
  if (error) {
    // For the developer: Log the error to the server console
    console.error('Error fetching initial notes:', error)
    // For the user: We'll render the page with an empty list of notes.
    // The NotesClient component will then show the "You have no notes yet" message.
  }

  // 6. Render the Client Component, passing the initial data down as props
  return <NotesClient initialNotes={notes || []} user={user} />
}
