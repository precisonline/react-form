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
  Stack,
} from '@mui/material'
import {
  Contact,
  contactSchema,
  defaultContact,
} from '../schemas/contactSchema'

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<Contact>({
    resolver: zodResolver(contactSchema),
    mode: 'onChange',
    defaultValues: {
      ...defaultContact,
    },
  })

  const onSubmit: SubmitHandler<Contact> = async (data) => {
    try {
      // Simulate form submission
      await new Promise((resolve) => setTimeout(resolve, 1500))
      console.log('Submitted:', data)
      setSubmitted(true)
      reset()
      setTimeout(() => {
        setSubmitted(false)
      }, 3000)
    } catch (error) {
      console.error('Submission error:', error)
    }
  }

  return (
    <Container maxWidth='md'>
      <Card sx={{ p: 4 }}>
        <Typography variant='h4' gutterBottom>
          Contact Information
        </Typography>

        {submitted && (
          <Typography color='success.main' variant='body1' sx={{ mb: 2 }}>
            Form submitted successfully!
          </Typography>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>
            <Box display='flex' gap={2}>
              <TextField
                {...register('firstName')}
                label='First Name'
                error={!!errors.firstName}
                helperText={errors.firstName?.message}
                fullWidth
              />
              <TextField
                {...register('lastName')}
                label='Last Name'
                error={!!errors.lastName}
                helperText={errors.lastName?.message}
                fullWidth
              />
            </Box>

            <TextField
              {...register('email')}
              label='Email'
              type='email'
              error={!!errors.email}
              helperText={errors.email?.message}
              fullWidth
            />

            <TextField
              {...register('phone')}
              label='Phone'
              type='tel'
              error={!!errors.phone}
              helperText={errors.phone?.message}
              fullWidth
            />

            <Button type='submit' variant='contained' disabled={!isValid}>
              Submit
            </Button>
          </Stack>
        </form>
      </Card>
    </Container>
  )
}
