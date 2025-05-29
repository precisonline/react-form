// src/app/layout.tsx
import type { Metadata } from 'next'
// Adjust path if your ThemeRegistry folder is not directly under 'components'
import ThemeRegistry from '@/components/ThemeRegistry/ThemeRegistry'

export const metadata: Metadata = {
  title: 'My MUI App with Corrected Setup',
  description: 'Testing MUI SSR setup thoroughly',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en'>
      <body>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  )
}
