import CustomThemeProvider from '../components/ThemeProvider'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MUI Form App',
  description: 'A Next.js app with Material-UI forms',
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang='en'>
      <body>
        <CustomThemeProvider>{children}</CustomThemeProvider>
      </body>
    </html>
  )
}
