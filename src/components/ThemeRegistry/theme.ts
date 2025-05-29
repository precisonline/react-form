// src/components/ThemeRegistry/theme.ts
import { createTheme } from '@mui/material/styles'
import { deepPurple, grey } from '@mui/material/colors'

// Create a basic theme instance for testing.
const theme = createTheme({
  palette: {
    mode: 'light', // or 'dark'
    primary: {
      main: deepPurple[500],
    },
    secondary: {
      main: grey[700],
    },
    background: {
      default: grey[50],
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
})

export default theme
