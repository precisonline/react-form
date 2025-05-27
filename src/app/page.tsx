'use client'

import React from 'react'
import FloatLabelPassword from './components/FloatLabelPassword'
import FloatLabelSelect from './components/FloatLabelSelect'
import FloatLabelText from './components/FloatLabelText'
import FloatLabelTextArea from './components/FloatLabelTextArea'
import { states } from './data/states' // Moved the states data to a separate file for better organization and reusability
import { CustomerSchema, CustomerType } from './validation/CustomerValidation'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

export default function Home() {
  const { control, handleSubmit } = useForm<CustomerType>({
    resolver: zodResolver(CustomerSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      password: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      email: '',
      phone: '',
      comments: '',
    },
  })

  /* 
Add the defaultValues property to your UseForm configuration, matching the keys in your CustomerType schema. This ensures that the form starts with empty fields, which is useful for a new customer entry form and keeps the "single source of truth" principle.
It also makes it so that the form is controlled, meaning React Hook Form will manage the state of the form inputs, and you can easily access the values when the form is submitted or when you need to reset the form.
It also makes the component more predictable and easier to test, and makes it reusable in different contexts.
IDs were changed to names also because the `name` attribute is what React Hook Form uses to identify the fields, and it should match the keys in your validation schema.
*/

  const onSubmit: SubmitHandler<CustomerType> = (data) => {
    console.log(data)
  }

  return (
    <>
      <div className='p-[2rem]'>
        <h1 className='text-[2rem]'>Customer Entry</h1>
        <form className='flex flex-col p-4' onSubmit={handleSubmit(onSubmit)}>
          <FloatLabelText name='name' prompt='Name' control={control} />
          <FloatLabelPassword
            name='password'
            prompt='Password'
            control={control}
          />
          <FloatLabelText name='city' prompt='City' control={control} />
          <FloatLabelText
            name='address'
            prompt='Address'
            control={control}
          />{' '}
          {/* There was a typo in the original code, it should be "address" not "addr"*/}
          <FloatLabelSelect
            name='state'
            prompt='State'
            control={control}
            values={states}
          />
          <FloatLabelText name='zip' prompt='Postal Code' control={control} />
          <FloatLabelText
            name='email'
            prompt='Email Address'
            control={control}
          />
          <FloatLabelText
            name='phone'
            prompt='Phone Number'
            control={control}
          />
          <FloatLabelTextArea
            name='comments'
            prompt='Comments'
            control={control}
          />
          <button
            type='submit'
            className='p-3 bg-blue-600 rounded-md text-white font-bold'
          >
            Submit
          </button>{' '}
          {/* Corrected some tailwind classes using what it seemed like you meant, br-2 and bold to rounded-md and font-bold*/}
        </form>
      </div>
    </>
  )
}
