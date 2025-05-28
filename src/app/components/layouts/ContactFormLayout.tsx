'use client'

import React from 'react'
import {
  FieldValues,
  FieldPath,
  // Control, UseFormHandleSubmit, and SubmitHandler will come from TypedLayoutComponentProps
} from 'react-hook-form'

// 1. Import TypedLayoutComponentProps from your loader.ts
//    This defines the core RHF props (control, handleSubmit, onFormSubmit)
//    and allows for additional unknown props via [key: string]: unknown.
import type { TypedLayoutComponentProps } from '@/app/forms/loader' // Adjust path as needed

// Import your generic UI field components
import FloatLabelText from '@/app/components/ui/FloatLabelText'
import FloatLabelTextArea from '@/app/components/ui/FloatLabelTextArea'

/**
 * Specific props for the ContactFormLayout.
 * It extends TypedLayoutComponentProps to inherit control, handleSubmit, onFormSubmit,
 * and then adds its own specific props for field key mappings and UI customization.
 */
interface ContactFormLayoutProps<TFieldValues extends FieldValues>
  extends TypedLayoutComponentProps<TFieldValues> {
  // --- Field Key Mapping Props ---
  // These tell the layout which fields from TFieldValues to use for each input
  nameFieldKey: FieldPath<TFieldValues>
  emailFieldKey: FieldPath<TFieldValues>
  messageFieldKey: FieldPath<TFieldValues>
  phoneFieldKey?: FieldPath<TFieldValues> // Optional phone field

  // --- UI Customization Props ---
  title?: string
  submitButtonText?: string
}

export const ContactFormLayout = <TFieldValues extends FieldValues>({
  // Props from TypedLayoutComponentProps (control, handleSubmit, onFormSubmit)
  control,
  handleSubmit,
  onFormSubmit,

  // Specific props for this ContactFormLayout
  nameFieldKey,
  emailFieldKey,
  messageFieldKey,
  phoneFieldKey,
  title = 'Contact Us', // Default title
  submitButtonText = 'Send Message', // Default button text
}: // ...any other props captured by [key: string]: unknown from TypedLayoutComponentProps can be spread if needed
// or explicitly handled if known. For this layout, we mainly use the ones defined above.
ContactFormLayoutProps<TFieldValues>) => {
  return (
    // The handleSubmit function from the parent (passed via props) is wired up here.
    // It will trigger validation against the parent's schema before calling onFormSubmit.
    <form
      onSubmit={handleSubmit(onFormSubmit)}
      className='mx-auto flex max-w-xl flex-col gap-y-4 rounded-lg bg-white p-6 shadow-xl md:p-8'
    >
      <h2 className='mb-6 text-center text-3xl font-bold text-gray-800'>
        {title}
      </h2>

      <FloatLabelText<TFieldValues>
        name={nameFieldKey}
        prompt='Full Name'
        control={control}
        type='text'
      />

      <FloatLabelText<TFieldValues>
        name={emailFieldKey}
        prompt='Email Address'
        type='email'
        control={control}
      />

      {/* Conditionally render the phone field only if a key for it was provided */}
      {phoneFieldKey && (
        <FloatLabelText<TFieldValues>
          name={phoneFieldKey}
          prompt='Phone Number (Optional)'
          type='tel'
          control={control}
        />
      )}

      <FloatLabelTextArea<TFieldValues>
        name={messageFieldKey}
        prompt='Your Message'
        control={control}
        rows={5} // Example: default rows for a contact message
      />

      <button
        type='submit'
        className='mt-6 w-full rounded-md bg-blue-600 px-6 py-3 text-lg font-semibold text-white shadow-md transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
      >
        {submitButtonText}
      </button>
    </form>
  )
}
