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
      // We only care about the moment a user successfully signs in
      if (event === 'SIGNED_IN' && session) {
        console.log('✅ SIGNED_IN event detected for user:', session.user.email)

        // Check if the schema_name already exists in the user's metadata.
        // This prevents us from re-provisioning for a returning user.
        const isNewUser = !session.user.user_metadata.schema_name
        console.log('Is this a new user?', isNewUser)

        if (isNewUser) {
          console.log('🚀 Provisioning new tenant...')

          // Step 1: Call the Edge Function
          console.log('Calling "provision-tenant" Edge Function...')
          const { data: funcData, error: funcError } =
            await supabase.functions.invoke('provision-tenant', {
              body: { tenant_name: session.user.email }, // Use email as a friendly name
            })

          // Check for errors from the Edge Function call itself
          if (funcError) {
            console.error('❌ Error invoking Edge Function:', funcError.message)
            return // Stop the process
          }
          console.log('✅ Edge Function returned:', funcData)

          // Step 2: Update the User's Metadata
          const { schema_name } = funcData
          if (!schema_name) {
            console.error('❌ Edge function did not return a schema_name!')
            return // Stop the process
          }

          console.log(`Updating user metadata with schema_name: ${schema_name}`)
          const { error: updateError } = await supabase.auth.updateUser({
            data: { schema_name: schema_name },
          })

          // Check for errors while updating the user
          if (updateError) {
            console.error(
              '❌ Error updating user metadata:',
              updateError.message
            )
            return // Stop the process
          }
          console.log('✅ User metadata updated successfully.')
        }

        // For both new and returning users, redirect to the main app page.
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
