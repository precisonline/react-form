'use client'
import React, { useState } from 'react'
import { useForm, useFieldArray, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Card,
  FormControlLabel,
  Checkbox,
  Alert,
  Stack,
  CardContent,
  CardActions,
  IconButton,
  Divider,
} from '@mui/material'
import { Send, Add, Edit, Delete } from '@mui/icons-material'
import {
  userProfileSchema,
  UserProfileFormData,
  AddressFormData,
  defaultUserProfileValues,
} from '../schemas/userProfileSchema'
import AddressFormDialog from './AddressFormDialog'

export default function UserProfileForm(): React.ReactElement {
  const [submitted, setSubmitted] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingAddress, setEditingAddress] = useState<AddressFormData | null>(
    null
  )

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isValid },
  } = useForm<UserProfileFormData>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: defaultUserProfileValues,
    mode: 'onChange',
  })

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'addresses',
    keyName: 'key', // Use 'key' to avoid conflicts with our own 'id' field
  })

  const handleOpenAdd = () => {
    setEditingAddress(null)
    setIsModalOpen(true)
  }

  const handleOpenEdit = (index: number) => {
    setEditingAddress(fields[index])
    setIsModalOpen(true)
  }

  const handleCloseModal = () => setIsModalOpen(false)

  const handleSaveAddress = (data: AddressFormData) => {
    const index = fields.findIndex((field) => field.id === data.id)
    if (index > -1) {
      update(index, data)
    } else {
      append(data)
    }
    handleCloseModal()
  }

  const onFinalSubmit: SubmitHandler<UserProfileFormData> = async (data) => {
    setLoading(true)
    console.log('Final Profile Submitted:', data)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setSubmitted(true)
      setTimeout(() => {
        reset(defaultUserProfileValues)
        setSubmitted(false)
      }, 3000)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth='md' sx={{ py: 4 }}>
      <Card sx={{ p: { xs: 2, sm: 4 }, boxShadow: 3 }}>
        <Typography variant='h4' component='h1' gutterBottom align='center'>
          User Profile
        </Typography>
        {submitted && (
          <Alert severity='success' sx={{ mb: 3 }}>
            Profile saved successfully!
          </Alert>
        )}

        <Box component='form' onSubmit={handleSubmit(onFinalSubmit)} noValidate>
          <Stack spacing={3}>
            {/* --- Personal Details Section --- */}
            <Typography variant='h6'>Personal Details</Typography>
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

            <Divider sx={{ my: 2 }} />

            {/* --- Address Management Section --- */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography variant='h6'>My Addresses</Typography>
              <Button
                variant='outlined'
                startIcon={<Add />}
                onClick={handleOpenAdd}
              >
                Add New
              </Button>
            </Box>

            {fields.length === 0 && (
              <Card
                variant='outlined'
                sx={{ textAlign: 'center', py: 3, borderColor: 'divider' }}
              >
                <Typography color='text.secondary'>
                  No addresses added yet.
                </Typography>
              </Card>
            )}

            <Stack spacing={2}>
              {fields.map((field, index) => (
                <Card key={field.key} variant='outlined'>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <CardContent>
                      <Typography
                        variant='h6'
                        component='div'
                        sx={{ fontWeight: 500 }}
                      >
                        {field.addressType} Address
                      </Typography>
                      <Typography color='text.secondary'>
                        {field.usaStreetAddress ||
                          field.canadaStreetAddress ||
                          field.ukStreetAddress ||
                          field.addressLine1}
                        , {field.country}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <IconButton
                        onClick={() => handleOpenEdit(index)}
                        aria-label='edit address'
                      >
                        <Edit fontSize='small' />
                      </IconButton>
                      <IconButton
                        onClick={() => remove(index)}
                        aria-label='delete address'
                      >
                        <Delete fontSize='small' />
                      </IconButton>
                    </CardActions>
                  </Box>
                </Card>
              ))}
            </Stack>

            <Divider sx={{ my: 2 }} />

            {/* --- Other Details Section --- */}
            <TextField
              {...register('deliveryInstructions')}
              label='Delivery Instructions (Optional)'
              multiline
              rows={3}
              error={!!errors.deliveryInstructions}
              helperText={errors.deliveryInstructions?.message}
              fullWidth
              disabled={loading}
            />
            <FormControlLabel
              control={<Checkbox {...register('newsletter')} />}
              label='Subscribe to our newsletter'
            />

            {/* --- Buttons --- */}
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                justifyContent: 'flex-end',
                flexDirection: { xs: 'column', sm: 'row' },
              }}
            >
              <Button
                type='submit'
                variant='contained'
                size='large'
                startIcon={<Send />}
                disabled={loading || !isValid}
              >
                {loading ? 'Saving Profile...' : 'Save Profile'}
              </Button>
            </Box>
          </Stack>
        </Box>
      </Card>

      {/* The Dialog is rendered here but its visibility is controlled by state */}
      <AddressFormDialog
        open={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveAddress}
        initialData={editingAddress}
      />
    </Container>
  )
}
