'use client'

import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { CustomerSchema, CustomerType } from './validation/CustomerValidation'

import { CustomerEntryFormLayout } from './components/layouts/CustomerEntryFormLayout'

export default function Home() {
  const {
    control,
    handleSubmit,
    reset, // Good to destructure reset if you want to clear form on submission
    formState: { errors }, // For displaying errors
  } = useForm<CustomerType>({
    resolver: zodResolver(CustomerSchema),
    mode: 'onChange', // Or 'onBlur' or 'onSubmit' based on preference
    defaultValues: {
      name: '',
      password: '',
      address: '',
      city: '',
      state: '', // Default to empty, placeholder in statesObject will show "Select a State..."
      zip: '',
      email: '',
      phone: '',
      comments: '',
    },
  })

  const onSubmit: SubmitHandler<CustomerType> = (data) => {
    console.log('Customer Data Submitted:', data)
    alert('Customer form submitted! Check the console.')
    // reset(); // Optionally reset the form to defaultValues after submission
  }

  return (
    <>
      <div className='min-h-screen bg-gray-50 p-4 py-8 md:p-8'>
        <div className='mx-auto max-w-xl rounded-lg bg-white p-6 shadow-xl md:p-8'>
          <h1 className='mb-6 text-center text-3xl font-bold text-gray-800'>
            Customer Entry
          </h1>
          <form
            className='flex flex-col gap-y-4'
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* Use the dedicated layout component */}
            <CustomerEntryFormLayout<CustomerType> control={control} />

            <button
              type='submit'
              className='mt-6 w-full rounded-md bg-blue-600 px-6 py-3 text-lg font-semibold text-white shadow-md transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
            >
              Submit Customer
            </button>
          </form>
          {/* Optional: Display errors for debugging or user feedback */}
          {Object.keys(errors).length > 0 && (
            <div className='mt-4 rounded-md bg-red-100 p-4 text-sm text-red-700'>
              <h3 className='font-bold'>
                Please correct the following errors:
              </h3>
              <ul className='list-inside list-disc'>
                {Object.values(errors).map(
                  (error, index) =>
                    error?.message && (
                      <li key={index}>{String(error.message)}</li>
                    )
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
