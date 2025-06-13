/* eslint-disable @typescript-eslint/no-unused-vars */
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
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
          } catch (_error) {}
        },
        remove(name: string, options: CookieOptions) {
          try {
            // The `set` method with an empty value is used to remove the cookie.
            cookieStore.set({ name, value: '', ...options })
          } catch (_error) {}
        },
      },
    }
  )
}
