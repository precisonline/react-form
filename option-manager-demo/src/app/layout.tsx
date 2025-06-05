// src/app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter'
import { ThemeProvider } from '@mui/material/styles'
import {
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Container,
} from '@mui/material'
import Link from 'next/link'
import { theme } from './theme'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Options Manager Demo',
  description: 'Showcasing configurable component implementations',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <AppBar position='static' elevation={1}>
              <Container maxWidth='lg'>
                <Toolbar>
                  <Typography
                    variant='h6'
                    component={Link}
                    href='/'
                    sx={{
                      textDecoration: 'none',
                      color: 'inherit',
                      '&:hover': {
                        opacity: 0.8,
                      },
                    }}
                  >
                    Options Manager Demo
                  </Typography>
                </Toolbar>
              </Container>
            </AppBar>
            {children}
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  )
}
