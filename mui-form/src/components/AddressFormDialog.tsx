'use client'
import React, { useEffect } from 'react'
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
  useForm,
  Controller,
  SubmitHandler,
  useWatch,
  FieldPath,
} from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Address,
  addressSchema,
  defaultAddress,
} from '../schemas/addressSchema'
import { ENUMS } from '../schemas/common'

interface AddressFormDialogProps {
  open: boolean
  onClose: () => void
  onSave: (data: Address) => void
  initialData: Address | null
}

export default function AddressFormDialog({
  open,
  onClose,
  onSave,
  initialData,
}: AddressFormDialogProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Address>({
    resolver: zodResolver(addressSchema),
    defaultValues: initialData || defaultAddress,
    mode: 'onChange',
  })

  // useEffect(() => {
  //   if (open) {
  //     reset(initialData || defaultAddress)
  //   }
  // }, [open, initialData, reset])

  const selectedCountry = useWatch({
    control,
    name: 'country',
    defaultValue: (initialData || defaultAddress).country,
  })

  const onSubmit: SubmitHandler<Address> = (data) => {
    onSave(data)
    onClose()
  }

  const addressFields = {
    USA: [
      { name: 'streetAddress', label: 'Street Address', required: true },
      { name: 'city', label: 'City', required: true },
      { name: 'state', label: 'State', required: true },
      { name: 'zipCode', label: 'ZIP Code', required: true },
    ],
    Canada: [
      { name: 'streetAddress', label: 'Street Address', required: true },
      { name: 'city', label: 'City', required: true },
      { name: 'province', label: 'Province', required: true },
      { name: 'postalCode', label: 'Postal Code', required: true },
    ],
    UK: [
      { name: 'streetAddress', label: 'Street Address', required: true },
      { name: 'city', label: 'City', required: true },
      { name: 'postcode', label: 'Postcode', required: true },
    ],
    Other: [
      { name: 'streetAddress', label: 'Street Address', required: true },
      { name: 'city', label: 'City', required: true },
      {
        name: 'state',
        label: 'State/Province/Region (Optional)',
        required: false,
      },
      { name: 'zipCode', label: 'ZIP/Postal Code (Optional)', required: false },
    ],
  }

  console.log('selectedCountry:', selectedCountry)
  console.log('errors:', errors)

  return (
    <Dialog open={open} onClose={onClose} maxWidth='md' fullWidth>
      <DialogTitle>Address Details</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Controller
            name='addressType'
            control={control}
            render={({ field }) => (
              <FormControl fullWidth margin='normal'>
                <InputLabel id='address-type-select-label'>
                  Address Type
                </InputLabel>
                <Select
                  {...field}
                  labelId='address-type-select-label'
                  label='Address Type'
                  error={!!errors.addressType}
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

          <Controller
            name='country'
            control={control}
            render={({ field }) => (
              <FormControl fullWidth margin='normal'>
                <InputLabel id='country-select-label'>Country</InputLabel>
                <Select
                  {...field}
                  labelId='country-select-label'
                  label='Country'
                  error={!!errors.country}
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

          {/* Dynamic address fields */}
          {selectedCountry &&
            (() => {
              console.log(
                '👉 addressFields[selectedCountry]',
                addressFields[selectedCountry as keyof typeof addressFields]
              )
              return addressFields[
                selectedCountry as keyof typeof addressFields
              ]?.map((addressField) => {
                console.log('👉 Rendering field:', addressField.name)
                return (
                  <Controller
                    key={addressField.name}
                    name={addressField.name as FieldPath<Address>}
                    control={control}
                    render={({ field: inputField }) => {
                      console.log(
                        '👉 inputField for',
                        addressField.name,
                        inputField
                      )
                      const fieldError =
                        errors[addressField.name as keyof Address]
                      return (
                        <TextField
                          {...inputField}
                          margin='normal'
                          label={addressField.label}
                          required={addressField.required}
                          fullWidth
                          error={!!fieldError}
                          helperText={
                            fieldError?.message ? (
                              <span data-testid={`${addressField.name}-error`}>
                                {fieldError.message}
                              </span>
                            ) : null
                          }
                        />
                      )
                    }}
                  />
                )
              })
            })()}
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
