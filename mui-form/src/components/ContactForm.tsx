'use client'
import React, { useState, useEffect } from 'react'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
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
  defaultValues as formDefaultValues,
  // ADD IMPORTS FOR THE ADDRESS PART SCHEMAS:
  usaAddressSchema,
  canadaAddressSchema,
  ukAddressSchema,
  genericAddressSchema,
} from '../schemas/contactSchema' // Ensure this path is correct

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
    control,
    trigger,
    getValues,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: formDefaultValues,
    mode: 'onChange',
  })

  const selectedCountry = watch('country')

  useEffect(() => {
    const allSpecificCountryFields: Array<keyof ContactFormData> = [
      'usaStreetAddress',
      'usaCity',
      'usaState',
      'usaZipCode',
      'canadaStreetAddress',
      'canadaCity',
      'canadaProvince',
      'canadaPostalCode',
      'ukStreetAddress',
      'ukTownCity',
      'ukCounty',
      'ukPostcode',
    ]
    const allGenericFields: Array<keyof ContactFormData> = [
      'addressLine1',
      'cityOrTown',
      'stateOrProvinceOrRegion',
      'postalOrZipCode',
    ]
    const fieldsToKeep: Array<keyof ContactFormData> = ['addressLine2']
    let fieldsToTrigger: Array<keyof ContactFormData> = []

    // Now you can directly use the imported schemas:
    switch (selectedCountry) {
      case 'USA':
        fieldsToKeep.push(
          ...(Object.keys(usaAddressSchema.shape) as Array<
            keyof ContactFormData
          >)
        )
        fieldsToTrigger = Object.keys(usaAddressSchema.shape) as Array<
          keyof ContactFormData
        >
        break
      case 'Canada':
        fieldsToKeep.push(
          ...(Object.keys(canadaAddressSchema.shape) as Array<
            keyof ContactFormData
          >)
        )
        fieldsToTrigger = Object.keys(canadaAddressSchema.shape) as Array<
          keyof ContactFormData
        >
        break
      case 'UK':
        fieldsToKeep.push(
          ...(Object.keys(ukAddressSchema.shape) as Array<
            keyof ContactFormData
          >)
        )
        fieldsToTrigger = ['ukStreetAddress', 'ukTownCity', 'ukPostcode']
        break
      default:
        if (selectedCountry) {
          fieldsToKeep.push(
            ...(Object.keys(genericAddressSchema.shape) as Array<
              keyof ContactFormData
            >)
          )
          fieldsToTrigger = ['addressLine1', 'cityOrTown']
        }
        break
    }

    const fieldsToClear = [
      ...allSpecificCountryFields.filter((f) => !fieldsToKeep.includes(f)),
      ...allGenericFields.filter((f) => !fieldsToKeep.includes(f)),
    ].filter((f) => f !== 'addressLine2')

    fieldsToClear.forEach((field) => {
      if (getValues(field)) {
        setValue(field, '', { shouldValidate: false })
      }
    })

    if (fieldsToTrigger.length > 0) {
      setTimeout(() => trigger(fieldsToTrigger), 0)
    }
  }, [selectedCountry, setValue, trigger, getValues])

  const onSubmit: SubmitHandler<ContactFormData> = async (data) => {
    setLoading(true)
    console.log('Form submitted:', data)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setSubmitted(true)
      setTimeout(() => {
        reset(formDefaultValues)
        setValue('country', '', { shouldValidate: false })
        setSubmitted(false)
      }, 3000)
    } catch (error) {
      console.error('Form submission error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = (): void => {
    reset(formDefaultValues)
    setValue('country', '', { shouldValidate: false })
    setSubmitted(false)
  }

  const renderAddressFields = () => {
    if (!selectedCountry) return null

    switch (selectedCountry) {
      case 'USA':
        return (
          <>
            <TextField
              {...register('usaStreetAddress')}
              label='Street Address'
              error={!!errors.usaStreetAddress}
              helperText={errors.usaStreetAddress?.message}
              fullWidth
              required
              disabled={loading}
            />
            <TextField
              {...register('addressLine2')}
              label='Apt, Suite, Bldg (Optional)'
              error={!!errors.addressLine2}
              helperText={errors.addressLine2?.message}
              fullWidth
              disabled={loading}
            />
            <TextField
              {...register('usaCity')}
              label='City'
              error={!!errors.usaCity}
              helperText={errors.usaCity?.message}
              fullWidth
              required
              disabled={loading}
            />
            <TextField
              {...register('usaState')}
              label='State'
              error={!!errors.usaState}
              helperText={errors.usaState?.message}
              fullWidth
              required
              disabled={loading}
            />
            <TextField
              {...register('usaZipCode')}
              label='ZIP Code'
              error={!!errors.usaZipCode}
              helperText={errors.usaZipCode?.message}
              fullWidth
              required
              disabled={loading}
            />
          </>
        )
      case 'Canada':
        return (
          <>
            <TextField
              {...register('canadaStreetAddress')}
              label='Street Address'
              error={!!errors.canadaStreetAddress}
              helperText={errors.canadaStreetAddress?.message}
              fullWidth
              required
              disabled={loading}
            />
            <TextField
              {...register('addressLine2')}
              label='Apt, Suite, Bldg (Optional)'
              error={!!errors.addressLine2}
              helperText={errors.addressLine2?.message}
              fullWidth
              disabled={loading}
            />
            <TextField
              {...register('canadaCity')}
              label='City'
              error={!!errors.canadaCity}
              helperText={errors.canadaCity?.message}
              fullWidth
              required
              disabled={loading}
            />
            <TextField
              {...register('canadaProvince')}
              label='Province'
              error={!!errors.canadaProvince}
              helperText={errors.canadaProvince?.message}
              fullWidth
              required
              disabled={loading}
            />
            <TextField
              {...register('canadaPostalCode')}
              label='Postal Code'
              error={!!errors.canadaPostalCode}
              helperText={errors.canadaPostalCode?.message}
              fullWidth
              required
              disabled={loading}
            />
          </>
        )
      case 'UK':
        return (
          <>
            <TextField
              {...register('ukStreetAddress')}
              label='Street Address'
              error={!!errors.ukStreetAddress}
              helperText={errors.ukStreetAddress?.message}
              fullWidth
              required
              disabled={loading}
            />
            <TextField
              {...register('addressLine2')}
              label='Flat, Apt, etc. (Optional)'
              error={!!errors.addressLine2}
              helperText={errors.addressLine2?.message}
              fullWidth
              disabled={loading}
            />
            <TextField
              {...register('ukTownCity')}
              label='Town/City'
              error={!!errors.ukTownCity}
              helperText={errors.ukTownCity?.message}
              fullWidth
              required
              disabled={loading}
            />
            <TextField
              {...register('ukCounty')}
              label='County (Optional)'
              error={!!errors.ukCounty}
              helperText={errors.ukCounty?.message}
              fullWidth
              disabled={loading}
            />
            <TextField
              {...register('ukPostcode')}
              label='Postcode'
              error={!!errors.ukPostcode}
              helperText={errors.ukPostcode?.message}
              fullWidth
              required
              disabled={loading}
            />
          </>
        )
      default:
        return (
          <>
            <Typography
              variant='body2'
              sx={{ mb: 1, mt: 1, color: 'text.secondary' }}
            >
              Please provide address details for {selectedCountry}.
            </Typography>
            <TextField
              {...register('addressLine1')}
              label='Address Line 1'
              error={!!errors.addressLine1}
              helperText={errors.addressLine1?.message}
              fullWidth
              required
              disabled={loading}
            />
            <TextField
              {...register('addressLine2')}
              label='Address Line 2 (Optional)'
              error={!!errors.addressLine2}
              helperText={errors.addressLine2?.message}
              fullWidth
              disabled={loading}
            />
            <TextField
              {...register('cityOrTown')}
              label='City / Town'
              error={!!errors.cityOrTown}
              helperText={errors.cityOrTown?.message}
              fullWidth
              required
              disabled={loading}
            />
            <TextField
              {...register('stateOrProvinceOrRegion')}
              label='State / Province / Region (Optional)'
              error={!!errors.stateOrProvinceOrRegion}
              helperText={errors.stateOrProvinceOrRegion?.message}
              fullWidth
              disabled={loading}
            />
            <TextField
              {...register('postalOrZipCode')}
              label='Postal / ZIP Code (Optional)'
              error={!!errors.postalOrZipCode}
              helperText={errors.postalOrZipCode?.message}
              fullWidth
              disabled={loading}
            />
          </>
        )
    }
  }

  return (
    <Container maxWidth='md' sx={{ py: 4 }}>
      <Card sx={{ p: 4, boxShadow: 3 }}>
        <Typography variant='h4' component='h1' gutterBottom align='center'>
          {' '}
          Contact Form{' '}
        </Typography>
        {submitted && (
          <Alert severity='success' sx={{ mb: 3 }}>
            {' '}
            Form submitted successfully!{' '}
          </Alert>
        )}
        <Box component='form' onSubmit={handleSubmit(onSubmit)} noValidate>
          <Stack spacing={3}>
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
            <FormControl
              fullWidth
              error={!!errors.country}
              required
              disabled={loading}
            >
              <InputLabel id='country-select-label'>Country</InputLabel>
              <Controller
                name='country'
                control={control}
                render={({ field }) => (
                  <Select
                    labelId='country-select-label'
                    label='Country'
                    {...field}
                    value={field.value || ''}
                  >
                    <MenuItem value=''>
                      {' '}
                      <em>Select a country...</em>{' '}
                    </MenuItem>
                    {countries.map((countryName) => (
                      <MenuItem key={countryName} value={countryName}>
                        {' '}
                        {countryName}{' '}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              {errors.country && (
                <FormHelperText>{errors.country.message}</FormHelperText>
              )}
            </FormControl>

            {renderAddressFields()}

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
            <FormControlLabel
              control={
                <Checkbox
                  {...register('newsletter')}
                  checked={watch('newsletter') || false}
                  onChange={(e) =>
                    setValue('newsletter', e.target.checked, {
                      shouldValidate: true,
                    })
                  }
                  disabled={loading}
                />
              }
              label='Subscribe to our newsletter'
            />
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
                {' '}
                Reset{' '}
              </Button>
              <Button
                type='submit'
                variant='contained'
                size='large'
                startIcon={<Send />}
                disabled={loading || !isValid}
              >
                {' '}
                {loading ? 'Submitting...' : 'Submit'}{' '}
              </Button>
            </Box>
          </Stack>
        </Box>
      </Card>
    </Container>
  )
}
