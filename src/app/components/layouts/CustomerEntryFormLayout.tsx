'use client'

import React from 'react'
import { Control, FieldValues, FieldPath } from 'react-hook-form'
import FloatLabelText from '../ui/FloatLabelText'
import FloatLabelPassword from '../ui/FloatLabelPassword'
import FloatLabelSelect from '../ui/FloatLabelSelect'
import FloatLabelTextArea from '../ui/FloatLabelTextArea'
import { statesObject } from '@/app/data/states'

// Define props for this specific layout
interface CustomerEntryFormLayoutProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>
  // This layout is specific, so it knows its field names.
  // No need for field key mapping props here unless you make this layout also generic.
}

export const CustomerEntryFormLayout = <TFieldValues extends FieldValues>({
  control,
}: CustomerEntryFormLayoutProps<TFieldValues>) => {
  // Since this layout is specific to CustomerSchema, we can hardcode the 'name' props.
  // TFieldValues here would be CustomerType when used in page.tsx.
  return (
    <>
      <FloatLabelText<TFieldValues>
        name={'name' as FieldPath<TFieldValues>}
        prompt='Name'
        control={control}
      />
      <FloatLabelPassword<TFieldValues>
        name={'password' as FieldPath<TFieldValues>}
        prompt='Password'
        control={control}
      />
      <FloatLabelText<TFieldValues>
        name={'address' as FieldPath<TFieldValues>}
        prompt='Address'
        control={control}
      />
      <FloatLabelText<TFieldValues>
        name={'city' as FieldPath<TFieldValues>}
        prompt='City'
        control={control}
      />
      <FloatLabelSelect<TFieldValues>
        name={'state' as FieldPath<TFieldValues>}
        prompt='State'
        control={control}
        options={statesObject}
      />
      <FloatLabelText<TFieldValues>
        name={'zip' as FieldPath<TFieldValues>}
        prompt='Postal Code'
        control={control}
      />
      <FloatLabelText<TFieldValues>
        name={'email' as FieldPath<TFieldValues>}
        prompt='Email Address'
        control={control}
        type='email'
      />
      <FloatLabelText<TFieldValues>
        name={'phone' as FieldPath<TFieldValues>}
        prompt='Phone Number'
        control={control}
        type='tel'
      />
      <FloatLabelTextArea<TFieldValues>
        name={'comments' as FieldPath<TFieldValues>}
        prompt='Comments'
        control={control}
      />
    </>
  )
}
