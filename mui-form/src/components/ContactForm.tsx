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
  Checkbox,
  FormControlLabel,
} from '@mui/material'
import {
  Contact,
  contactSchema,
  defaultContact,
} from '../schemas/contactSchema'
import { defaultAddress } from '../schemas/addressSchema'
import AddressFormDialog from './AddressFormDialog'

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
    reset,
    watch,
    setValue,
  } = useForm<Contact>({
    resolver: zodResolver(contactSchema),
    mode: 'onChange',
    defaultValues: {
      ...defaultContact,
      addresses: [defaultAddress],
    },
  })

  const onSubmit: SubmitHandler<Contact> = async (data) => {
    try {
      // Simulate form submission
      await new Promise((resolve) => setTimeout(resolve, 1500))
      console.log('Submitted:', data)
      setSubmitted(true)
      reset()
    } catch (error) {
      console.error('Submission error:', error)
    } finally {
      setSubmitted(false)
    }
  }

  const handleAddAddress = () => {
    // Reset addresses to a new empty address when opening dialog
    setValue('addresses', [defaultAddress], { shouldValidate: true })
    setDialogOpen(true)
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

            <Box
              display='flex'
              justifyContent='space-between'
              alignItems='center'
            >
              <Typography variant='subtitle1'>Addresses</Typography>
              <Button variant='outlined' onClick={handleAddAddress}>
                Add Address
              </Button>
            </Box>

            {/* Optional: Display existing addresses */}
            {watch('addresses')?.map((address, index) => (
              <Box
                key={index}
                sx={{
                  border: 1,
                  borderColor: 'grey.300',
                  p: 2,
                  borderRadius: 2,
                }}
              >
                <Typography>
                  {address.addressType} - {address.country}
                </Typography>
                <Typography variant='body2'>
                  {address.streetAddress}, {address.city}
                </Typography>
              </Box>
            ))}

            <AddressFormDialog
              open={dialogOpen}
              onClose={() => setDialogOpen(false)}
              control={control}
              errors={errors}
              handleSubmit={handleSubmit}
            />

            <FormControlLabel
              control={
                <Checkbox
                  {...register('newsletter')}
                  checked={watch('newsletter') || false}
                />
              }
              label='Subscribe to newsletter'
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
