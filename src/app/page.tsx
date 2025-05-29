// src/app/page.tsx
'use client'

import React from 'react'
import { useForm, Controller, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

// Assuming CustomerValidation.tsx is at this path
import { CustomerSchema, CustomerType } from './validation/CustomerValidation'
import { statesObject } from './data/states'

// MUI Components
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid' // This should be the new CSS Grid-based Grid in MUI v7
import Paper from '@mui/material/Paper'
import MenuItem from '@mui/material/MenuItem'

export default function HomePageWithMuiForm() {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CustomerType>({
    resolver: zodResolver(CustomerSchema),
    mode: 'onBlur',
    defaultValues: {
      name: '',
      password: '',
      address: '',
      city: '',
      state: undefined,
      zip: '',
      email: '',
      phone: '',
      comments: '',
    },
  })

  const onSubmit: SubmitHandler<CustomerType> = async (data) => {
    console.log('MUI Customer Data Submitted:', data)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    alert('Customer form (MUI) submitted! Check the console.')
    reset()
  }

  return (
    <Container component='main' maxWidth='md'>
      <Paper
        elevation={3}
        sx={{
          marginTop: { xs: 4, sm: 8 },
          padding: { xs: 2, sm: 4 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component='h1' variant='h4' gutterBottom sx={{ mb: 3 }}>
          Customer Entry (MUI)
        </Typography>
        <Box
          component='form'
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          sx={{ width: '100%' }}
        >
          <Grid container spacing={2}>
            <Grid xs={12} sm={6}>
              {' '}
              <Controller
                name='name'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    fullWidth
                    label='Full Name'
                    autoComplete='name'
                    variant='outlined'
                    error={!!errors.name}
                    helperText={errors.name?.message || ' '}
                  />
                )}
              />
            </Grid>
            <Grid xs={12} sm={6}>
              <Controller
                name='password'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    fullWidth
                    type='password'
                    label='Password'
                    autoComplete='new-password'
                    variant='outlined'
                    error={!!errors.password}
                    helperText={errors.password?.message || ' '}
                  />
                )}
              />
            </Grid>
            <Grid xs={12}>
              <Controller
                name='address'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    fullWidth
                    label='Address'
                    variant='outlined'
                    error={!!errors.address}
                    helperText={errors.address?.message || ' '}
                  />
                )}
              />
            </Grid>
            <Grid xs={12} sm={6}>
              <Controller
                name='city'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    fullWidth
                    label='City'
                    variant='outlined'
                    error={!!errors.city}
                    helperText={errors.city?.message || ' '}
                  />
                )}
              />
            </Grid>
            <Grid xs={12} sm={3}>
              <Controller
                name='state'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    required
                    fullWidth
                    label='State'
                    variant='outlined'
                    error={!!errors.state}
                    helperText={errors.state?.message || ' '}
                  >
                    {Object.entries(statesObject).map(([value, label]) => (
                      <MenuItem key={value} value={value}>
                        {label}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>
            <Grid xs={12} sm={3}>
              <Controller
                name='zip'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    fullWidth
                    label='ZIP Code'
                    variant='outlined'
                    error={!!errors.zip}
                    helperText={errors.zip?.message || ' '}
                  />
                )}
              />
            </Grid>
            <Grid xs={12} sm={6}>
              <Controller
                name='email'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    fullWidth
                    type='email'
                    label='Email Address'
                    autoComplete='email'
                    variant='outlined'
                    error={!!errors.email}
                    helperText={errors.email?.message || ' '}
                  />
                )}
              />
            </Grid>
            <Grid xs={12} sm={6}>
              <Controller
                name='phone'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label='Phone Number'
                    type='tel'
                    autoComplete='tel'
                    variant='outlined'
                    error={!!errors.phone}
                    helperText={errors.phone?.message || ' '}
                  />
                )}
              />
            </Grid>
            <Grid xs={12}>
              <Controller
                name='comments'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label='Comments (Optional)'
                    multiline
                    rows={3}
                    variant='outlined'
                    error={!!errors.comments}
                    helperText={errors.comments?.message || ' '}
                  />
                )}
              />
            </Grid>
          </Grid>
          <Button
            type='submit'
            fullWidth
            variant='contained'
            disabled={isSubmitting}
            sx={{ mt: 3, mb: 2, py: 1.5, fontSize: '1rem' }}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Customer'}
          </Button>
        </Box>
      </Paper>
    </Container>
  )
}
