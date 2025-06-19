import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { SupabaseClient, User } from '@supabase/supabase-js'

export async function getSupabaseClient() {
  const cookieStore = cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: async (name: string) => {
          const cookieStoreResolved = await cookieStore
          const cookie = cookieStoreResolved.get(name)
          return cookie?.value
        },
        set: async (name: string, value: string, options: CookieOptions) => {
          try {
            const cookieStoreResolved = await cookieStore
            await cookieStoreResolved.set({ name, value, ...options })
          } catch {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        remove: async (name: string) => {
          try {
            const cookieStoreResolved = await cookieStore
            await cookieStoreResolved.delete(name)
          } catch {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )

  return supabase
}

type ActionResult = { success: boolean; data?: unknown; error?: string }

type Action = (
  supabase: SupabaseClient,
  user: User,
  schemaName: string
) => Promise<ActionResult>

export async function withSupabaseUser(action: Action) {
  const supabase = await getSupabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth')
  }

  const schemaName = user?.user_metadata?.schema_name
  if (!schemaName) {
    await supabase.auth.signOut()
    redirect('/auth?error=No tenant assigned. Please contact support.')
  }

  return action(supabase, user, schemaName)
}
