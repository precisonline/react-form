'use client'
import React, { useEffect } from 'react'
import { useForm, Controller, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Typography,
} from '@mui/material'
import {
  addressSchema,
  AddressFormData,
  countries,
  addressTypes,
  getNewAddressDefaultValues,
} from '../schemas/userProfileSchema'
import { AddressFormDialogProps } from '../types/form'

export default function AddressFormDialog({
  open,
  onClose,
  onSave,
  initialData,
}: AddressFormDialogProps) {
  const isEditing = !!initialData

  const {
    register,
    handleSubmit,
    watch,
    control,
    reset,
    formState: { errors, isValid },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    mode: 'onChange',
  })

  const selectedCountry = watch('country')

  useEffect(() => {
    if (open) {
      reset(initialData || getNewAddressDefaultValues())
    }
  }, [open, initialData, reset])

  const onSubmit: SubmitHandler<AddressFormData> = (data) => {
    onSave(data)
    onClose()
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
            />
            <TextField
              {...register('addressLine2')}
              label='Apt, Suite, Bldg (Optional)'
              error={!!errors.addressLine2}
              helperText={errors.addressLine2?.message}
              fullWidth
            />
            <TextField
              {...register('usaCity')}
              label='City'
              error={!!errors.usaCity}
              helperText={errors.usaCity?.message}
              fullWidth
              required
            />
            <TextField
              {...register('usaState')}
              label='State'
              error={!!errors.usaState}
              helperText={errors.usaState?.message}
              fullWidth
              required
            />
            <TextField
              {...register('usaZipCode')}
              label='ZIP Code'
              error={!!errors.usaZipCode}
              helperText={errors.usaZipCode?.message}
              fullWidth
              required
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
            />
            <TextField
              {...register('addressLine2')}
              label='Apt, Suite, Bldg (Optional)'
              error={!!errors.addressLine2}
              helperText={errors.addressLine2?.message}
              fullWidth
            />
            <TextField
              {...register('canadaCity')}
              label='City'
              error={!!errors.canadaCity}
              helperText={errors.canadaCity?.message}
              fullWidth
              required
            />
            <TextField
              {...register('canadaProvince')}
              label='Province'
              error={!!errors.canadaProvince}
              helperText={errors.canadaProvince?.message}
              fullWidth
              required
            />
            <TextField
              {...register('canadaPostalCode')}
              label='Postal Code'
              error={!!errors.canadaPostalCode}
              helperText={errors.canadaPostalCode?.message}
              fullWidth
              required
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
            />
            <TextField
              {...register('addressLine2')}
              label='Flat, Apt, etc. (Optional)'
              error={!!errors.addressLine2}
              helperText={errors.addressLine2?.message}
              fullWidth
            />
            <TextField
              {...register('ukTownCity')}
              label='Town/City'
              error={!!errors.ukTownCity}
              helperText={errors.ukTownCity?.message}
              fullWidth
              required
            />
            <TextField
              {...register('ukCounty')}
              label='County (Optional)'
              error={!!errors.ukCounty}
              helperText={errors.ukCounty?.message}
              fullWidth
            />
            <TextField
              {...register('ukPostcode')}
              label='Postcode'
              error={!!errors.ukPostcode}
              helperText={errors.ukPostcode?.message}
              fullWidth
              required
            />
          </>
        )
      default:
        return (
          <>
            <Typography variant='body2' sx={{ color: 'text.secondary' }}>
              Please provide address details for {selectedCountry}.
            </Typography>
            <TextField
              {...register('addressLine1')}
              label='Address Line 1'
              error={!!errors.addressLine1}
              helperText={errors.addressLine1?.message}
              fullWidth
              required
            />
            <TextField
              {...register('addressLine2')}
              label='Address Line 2 (Optional)'
              error={!!errors.addressLine2}
              helperText={errors.addressLine2?.message}
              fullWidth
            />
            <TextField
              {...register('cityOrTown')}
              label='City / Town'
              error={!!errors.cityOrTown}
              helperText={errors.cityOrTown?.message}
              fullWidth
              required
            />
            <TextField
              {...register('stateOrProvinceOrRegion')}
              label='State / Province / Region (Optional)'
              error={!!errors.stateOrProvinceOrRegion}
              helperText={errors.stateOrProvinceOrRegion?.message}
              fullWidth
            />
            <TextField
              {...register('postalOrZipCode')}
              label='Postal / ZIP Code (Optional)'
              error={!!errors.postalOrZipCode}
              helperText={errors.postalOrZipCode?.message}
              fullWidth
            />
          </>
        )
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
      <DialogTitle>
        {isEditing ? 'Edit Address' : 'Add New Address'}
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <FormControl fullWidth required error={!!errors.addressType}>
              <InputLabel>Address Type</InputLabel>
              <Controller
                name='addressType'
                control={control}
                render={({ field }) => (
                  <Select {...field} label='Address Type'>
                    {addressTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              {errors.addressType && (
                <FormHelperText>{errors.addressType.message}</FormHelperText>
              )}
            </FormControl>
            <FormControl fullWidth required error={!!errors.country}>
              <InputLabel>Country</InputLabel>
              <Controller
                name='country'
                control={control}
                render={({ field }) => (
                  <Select {...field} label='Country' value={field.value || ''}>
                    <MenuItem value=''>
                      <em>Select a country...</em>
                    </MenuItem>
                    {countries.map((c) => (
                      <MenuItem key={c} value={c}>
                        {c}
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
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: '16px 24px' }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button type='submit' variant='contained' disabled={!isValid}>
            Save Address
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
