'use client'

import { createClient } from '@/utils/supabase/client'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Box, Typography, Container, CircularProgress } from '@mui/material'

export default function AuthPage() {
  const supabase = createClient()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setIsLoading(true)

        router.push('/')
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
        {/* If the user has signed in, show a loading spinner instead of the form */}
        {isLoading ? (
          <>
            <Typography component='h1' variant='h5' sx={{ mb: 3 }}>
              Setting up your account...
            </Typography>
            <CircularProgress />
          </>
        ) : (
          <>
            <Typography component='h1' variant='h5'>
              Sign In / Sign Up
            </Typography>
            <Box sx={{ mt: 3, width: '100%' }}>
              <Auth
                supabaseClient={supabase}
                appearance={{ theme: ThemeSupa }}
                theme='dark'
                providers={[] /* e.g., ['github'] */}
              />
            </Box>
          </>
        )}
      </Box>
    </Container>
  )
}
