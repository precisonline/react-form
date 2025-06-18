'use client'

import { createClient } from '@/utils/supabase/client'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Box, Typography, Container } from '@mui/material'

export default function AuthPage() {
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        console.log('✅ SIGNED_IN event detected for user:', session.user.email)

        const isNewUser = !session.user.user_metadata.schema_name
        console.log('Is this a new user?', isNewUser)

        if (isNewUser) {
          console.log('🚀 Provisioning new tenant...')

          const { data: funcData, error: funcError } =
            await supabase.functions.invoke('provision-tenant', {
              body: { tenant_name: session.user.email },
            })

          if (funcError) {
            console.error('❌ Error invoking Edge Function:', funcError.message)
            return
          }

          const { tenant } = funcData
          if (!tenant?.schema_name) {
            console.error('❌ Edge function did not return a schema_name!')
            return
          }
          const schema_name = tenant.schema_name

          const { error: updateError } = await supabase.auth.updateUser({
            data: { schema_name: schema_name },
          })

          if (updateError) {
            console.error(
              '❌ Error updating user metadata:',
              updateError.message
            )
            return
          }
          console.log('✅ User metadata updated successfully.')
        }

        console.log('Redirecting to homepage...')
        router.push('/')
        router.refresh() // Important to make sure layout re-fetches session data
      }
    })

    // Cleanup the subscription when the component unmounts
    return () => subscription.unsubscribe()
  }, [supabase, router])

  return (
    <Container component='main' maxWidth='xs'>
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component='h1' variant='h5'>
          Sign In / Sign Up
        </Typography>
        <Box sx={{ mt: 3, width: '100%' }}>
          <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            theme='dark'
            providers={[]}
          />
        </Box>
      </Box>
    </Container>
  )
}
