'use client'
import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material'
import {
  Control,
  Controller,
  FieldErrors,
  UseFormHandleSubmit,
  useWatch,
} from 'react-hook-form'
import { Address } from '../schemas/addressSchema'
import { ENUMS } from '../schemas/common'

interface AddressFormDialogProps {
  open: boolean
  onClose: () => void
  control: Control<{ addresses: Address[] }>
  errors: FieldErrors<{ addresses: Address[] }>
  handleSubmit: UseFormHandleSubmit<{ addresses: Address[] }>
}

export default function AddressFormDialog({
  open,
  onClose,
  control,
  errors,
  handleSubmit,
}: AddressFormDialogProps) {
  // Use useWatch to get the current country value
  const selectedCountry = useWatch({
    control,
    name: 'addresses.0.country',
  })

  const addressFields = {
    USA: [
      {
        name: 'streetAddress',
        label: 'Street Address',
        required: true,
      },
      {
        name: 'city',
        label: 'City',
        required: true,
      },
      {
        name: 'state',
        label: 'State',
        required: true,
      },
      {
        name: 'zipCode',
        label: 'ZIP Code',
        required: true,
      },
    ],
    Canada: [
      {
        name: 'streetAddress',
        label: 'Street Address',
        required: true,
      },
      {
        name: 'city',
        label: 'City',
        required: true,
      },
      {
        name: 'province',
        label: 'Province',
        required: true,
      },
      {
        name: 'postalCode',
        label: 'Postal Code',
        required: true,
      },
    ],
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth='md' fullWidth>
      <DialogTitle>Address Details</DialogTitle>
      <form
        onSubmit={handleSubmit((data) => {
          console.log(data)
          onClose()
        })}
      >
        <DialogContent>
          {/* Address Type Selection */}
          <Controller
            name='addresses.0.addressType'
            control={control}
            render={({ field }) => (
              <FormControl fullWidth margin='normal'>
                <InputLabel>Address Type</InputLabel>
                <Select
                  {...field}
                  label='Address Type'
                  error={!!errors.addresses?.[0]?.addressType}
                >
                  {ENUMS.addressTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />

          {/* Country Selection */}
          <Controller
            name='addresses.0.country'
            control={control}
            render={({ field }) => (
              <FormControl fullWidth margin='normal'>
                <InputLabel>Country</InputLabel>
                <Select
                  {...field}
                  label='Country'
                  error={!!errors.addresses?.[0]?.country}
                >
                  {ENUMS.countries.map((country) => (
                    <MenuItem key={country} value={country}>
                      {country}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />

          {/* Dynamically render address fields based on selected country */}
          {selectedCountry &&
            addressFields[selectedCountry as keyof typeof addressFields]?.map(
              (addressField) => (
                <Controller
                  key={addressField.name}
                  name={`addresses.0.${addressField.name}` as const}
                  control={control}
                  render={({ field: inputField }) => (
                    <TextField
                      {...inputField}
                      margin='normal'
                      label={addressField.label}
                      required={addressField.required}
                      fullWidth
                      error={
                        !!errors.addresses?.[0]?.[
                          addressField.name as keyof Address
                        ]
                      }
                      helperText={
                        errors.addresses?.[0]?.[
                          addressField.name as keyof Address
                        ]?.message
                      }
                    />
                  )}
                />
              )
            )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type='submit' variant='contained'>
            Save Address
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
