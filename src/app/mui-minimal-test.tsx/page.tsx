import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'

export default function MuiMinimalTestPage() {
  return (
    <Container maxWidth='xs'>
      {' '}
      {/* Use a small container for focus */}
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: 3,
          border: '2px solid #ccc', // Visible border
        }}
      >
        <Typography
          variant='h5'
          component='h1'
          gutterBottom
          sx={{ color: 'primary.main' }}
        >
          Minimal MUI Test
        </Typography>

        <Typography variant='body1' sx={{ marginBottom: 3 }}>
          This is a basic test of MUI SSR.
        </Typography>

        <Button variant='contained' color='primary' sx={{ marginBottom: 2 }}>
          Primary Button
        </Button>

        <Button variant='outlined' color='secondary'>
          Secondary Button
        </Button>
      </Box>
    </Container>
  )
}
