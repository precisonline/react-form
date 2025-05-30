'use client'
import React, { useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Card,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Alert,
  Stack,
  FormHelperText,
} from '@mui/material'
import { Send, Refresh } from '@mui/icons-material'
import {
  contactSchema,
  ContactFormData,
  countries,
} from '../schemas/contactSchema'

const defaultValues: ContactFormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  country: '',
  message: '',
  newsletter: false, // Now this will work correctly
}

export default function SimplifiedContactForm(): React.ReactElement {
  const [submitted, setSubmitted] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
    watch,
    setValue,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues,
    mode: 'onChange',
  })

  const onSubmit: SubmitHandler<ContactFormData> = async (data) => {
    setLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      console.log('Form submitted:', data)
      setSubmitted(true)

      setTimeout(() => {
        reset(defaultValues)
        setSubmitted(false)
      }, 3000)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = (): void => {
    reset(defaultValues)
    setSubmitted(false)
  }

  return (
    <Container maxWidth='md' sx={{ py: 4 }}>
      <Card sx={{ p: 4, boxShadow: 3 }}>
        <Typography variant='h4' component='h1' gutterBottom align='center'>
          Contact Form
        </Typography>

        {submitted && (
          <Alert severity='success' sx={{ mb: 3 }}>
            Form submitted successfully!
          </Alert>
        )}

        <Box component='form' onSubmit={handleSubmit(onSubmit)} noValidate>
          <Stack spacing={3}>
            {/* Name Fields*/}
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                flexDirection: { xs: 'column', sm: 'row' },
              }}
            >
              <TextField
                {...register('firstName')}
                label='First Name'
                error={!!errors.firstName}
                helperText={errors.firstName?.message}
                fullWidth
                required
                disabled={loading}
              />

              <TextField
                {...register('lastName')}
                label='Last Name'
                error={!!errors.lastName}
                helperText={errors.lastName?.message}
                fullWidth
                required
                disabled={loading}
              />
            </Box>

            {/* Email Field */}
            <TextField
              {...register('email')}
              label='Email Address'
              type='email'
              error={!!errors.email}
              helperText={errors.email?.message}
              fullWidth
              required
              disabled={loading}
            />

            {/* Phone Field */}
            <TextField
              {...register('phone')}
              label='Phone Number'
              type='tel'
              error={!!errors.phone}
              helperText={errors.phone?.message}
              fullWidth
              required
              disabled={loading}
            />

            {/* Country Select */}
            <FormControl
              fullWidth
              error={!!errors.country}
              required
              disabled={loading}
            >
              <InputLabel>Country</InputLabel>
              <Select
                {...register('country')}
                label='Country'
                value={watch('country') || ''}
                onChange={(e) => setValue('country', e.target.value)}
              >
                {countries.map((country) => (
                  <MenuItem key={country} value={country}>
                    {country}
                  </MenuItem>
                ))}
              </Select>
              {errors.country && (
                <FormHelperText>{errors.country.message}</FormHelperText>
              )}
            </FormControl>

            {/* Message Field */}
            <TextField
              {...register('message')}
              label='Message (Optional)'
              multiline
              rows={4}
              error={!!errors.message}
              helperText={errors.message?.message}
              fullWidth
              disabled={loading}
            />

            {/* Newsletter Checkbox */}
            <FormControlLabel
              control={
                <Checkbox
                  {...register('newsletter')}
                  checked={watch('newsletter')}
                  onChange={(e) => setValue('newsletter', e.target.checked)}
                  disabled={loading}
                />
              }
              label='Subscribe to our newsletter'
            />

            {/* Buttons */}
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                justifyContent: 'flex-end',
                flexDirection: { xs: 'column', sm: 'row' },
              }}
            >
              <Button
                type='button'
                variant='outlined'
                onClick={handleReset}
                startIcon={<Refresh />}
                disabled={loading}
              >
                Reset
              </Button>
              <Button
                type='submit'
                variant='contained'
                size='large'
                startIcon={<Send />}
                disabled={loading || !isValid}
              >
                {loading ? 'Submitting...' : 'Submit'}
              </Button>
            </Box>
          </Stack>
        </Box>
      </Card>
    </Container>
  )
}
