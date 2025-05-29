'use client'

import React from 'react'
import {
  useForm,
  Controller,
  SubmitHandler,
  ControllerRenderProps,
} from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

// Import Tenant 1's specific contact schema and its inferred type
import {
  tenant1ContactSchema,
  Tenant1ContactData,
} from '@/app/validation/tenant1' // Assumes barrel file at validation/tenant1/index.ts

// MUI Components
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'

export default function Tenant1ContactPage() {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Tenant1ContactData>({
    resolver: zodResolver(tenant1ContactSchema),
    mode: 'onBlur', // Or 'onChange'
    defaultValues: {
      // Default values must match the keys in tenant1ContactSchema
      t1_fullName: '',
      t1_contactEmail: '',
      t1_phoneNumber: '',
      t1_messageContent: '',
    },
  })

  const onSubmit: SubmitHandler<Tenant1ContactData> = async (data) => {
    console.log('Tenant 1 Contact Form Data (Specific Page):', data)
    // TODO: Replace with actual API call for Tenant 1's contact submissions
    await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API delay
    alert(`Message sent for Tenant 1! Thank you, ${data.t1_fullName}.`)
    reset() // Clear the form
  }

  return (
    <Container component='main' maxWidth='sm'>
      <Paper
        elevation={3}
        sx={{
          marginTop: { xs: 4, sm: 8 },
          padding: { xs: 3, sm: 4 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component='h1' variant='h4' gutterBottom sx={{ mb: 3 }}>
          Tenant 1 - Contact Us
        </Typography>
        <Box
          component='form'
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          sx={{ width: '100%' }}
        >
          <Grid container spacing={2} component='div'>
            <Grid xs={12}>
              <div>
                <Controller
                  name='t1_fullName'
                  control={control}
                  render={({
                    field,
                  }: {
                    field: ControllerRenderProps<
                      Tenant1ContactData,
                      't1_messageContent'
                    >
                  }) => (
                    <TextField
                      {...field}
                      required
                      fullWidth
                      id='t1_fullName'
                      label='Your Full Name'
                      autoComplete='name'
                      variant='outlined'
                      error={!!errors.t1_fullName}
                      helperText={errors.t1_fullName?.message || ' '}
                    />
                  )}
                />
              </div>
            </Grid>
            <Grid xs={12} component='div'>
              <div>
                <Controller
                  name='t1_contactEmail'
                  control={control}
                  render={({
                    field,
                  }: {
                    field: ControllerRenderProps<
                      Tenant1ContactData,
                      't1_contactEmail'
                    >
                  }) => (
                    <TextField
                      {...field}
                      required
                      fullWidth
                      id='t1_contactEmail'
                      label='Your Email Address'
                      type='email'
                      autoComplete='email'
                      variant='outlined'
                      error={!!errors.t1_contactEmail}
                      helperText={errors.t1_contactEmail?.message || ' '}
                    />
                  )}
                />
              </div>
            </Grid>
            <Grid xs={12} component='div'>
              <div>
                <Controller
                  name='t1_phoneNumber'
                  control={control}
                  render={({
                    field,
                  }: {
                    field: ControllerRenderProps<
                      Tenant1ContactData,
                      't1_phoneNumber'
                    >
                  }) => (
                    <TextField
                      {...field}
                      fullWidth
                      id='t1_phoneNumber'
                      label='Phone Number (Optional)'
                      type='tel'
                      autoComplete='tel'
                      variant='outlined'
                      error={!!errors.t1_phoneNumber}
                      helperText={errors.t1_phoneNumber?.message || ' '}
                    />
                  )}
                />
              </div>
            </Grid>
            <Grid xs={12} component='div'>
              <div>
                <Controller
                  name='t1_messageContent'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      required
                      fullWidth
                      id='t1_messageContent'
                      label='Your Message'
                      multiline
                      rows={5}
                      variant='outlined'
                      error={!!errors.t1_messageContent}
                      helperText={errors.t1_messageContent?.message || ' '}
                    />
                  )}
                />
              </div>
            </Grid>
          </Grid>
          <Button
            type='submit'
            fullWidth
            variant='contained'
            disabled={isSubmitting}
            sx={{ mt: 3, mb: 2, py: 1.5, fontSize: '1rem' }}
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </Button>
        </Box>
      </Paper>
    </Container>
  )
}
