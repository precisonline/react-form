'use client'

import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'

export default function MuiTestPage() {
  const [clickCount, setClickCount] = React.useState(0)

  return (
    <Container maxWidth='sm'>
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: 4,
          border: '1px dashed grey',
        }}
      >
        <Typography
          variant='h4'
          component='h1'
          gutterBottom
          sx={{ color: 'primary.main' }}
        >
          Minimal MUI Test
        </Typography>

        <Box sx={{ my: 2 }}>
          <Button
            variant='contained'
            color='primary'
            onClick={() => setClickCount((prev) => prev + 1)}
          >
            Primary Button Clicked: {clickCount}
          </Button>
        </Box>

        <Typography variant='h6' sx={{ mt: 4, mb: 1 }}>
          Simple Grid Test:
        </Typography>
        <Box sx={{ width: '100%', border: '1px solid #f0f' }}>
          {' '}
          <Grid
            container
            spacing={1}
            columns={12}
            sx={{ border: '1px solid blue' }}
          >
            <Grid xs={6} sx={{ border: '1px solid green' }}>
              <Paper sx={{ p: 1, textAlign: 'center' }}>Item A (xs=6)</Paper>
            </Grid>
            <Grid xs={6} sx={{ border: '1px solid green' }}>
              <Paper sx={{ p: 1, textAlign: 'center' }}>Item B (xs=6)</Paper>
            </Grid>
            <Grid xs={12} sx={{ border: '1px solid orange' }}>
              <Paper sx={{ p: 1, textAlign: 'center' }}>
                Item C (xs=12, should be full width)
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  )
}
