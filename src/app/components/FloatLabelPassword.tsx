/* 'use client'

import React from 'react';
import {
    Control,
    useController
} from 'react-hook-form';

interface FloatLabelPasswordProps {
    id:            string;
    defaultValue?: string;
    prompt:        string;
    control:       Control<any>;
}

export default function FloatLabelPassword({id, prompt, defaultValue, control } : FloatLabelPasswordProps) : React.JSX.Element {
    const { field, fieldState } = useController({ name: id, control, defaultValue: '' });
    return(
        <div className="relative mb-4 mt-3">
            <input type="password" id={id} name={id} value={defaultValue} className="peer h-10 p-2 w-full rounded-md placeholder-transparent border border-gray-300 text-gray-800 outline-none focus:border-[3px] focus:border-blue-400 focus:ring-0" placeholder={prompt} />
            <label htmlFor={id} className="absolute left-0 ml-2 pl-1 pr-1 -top-2 text-gray-500 text-sm bg-white transition-all -peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-placeholder-shown:bg-transparent peer-placeholder-shown:pl-0 peer-placeholder-shown:text-gray-800 peer-focus:-top-2 peer-focus:text-blue-400 peer-focus:text-sm peer-focus:bg-white peer-focus:pl-1 peer-focus:pr-1 peer-focus:font-bold">
            {prompt}
            </label>
            { fieldState.error ? (<div className="text-white bg-red-500 p-2 text-sm mt-1">{ fieldState.error.message }</div>) : null }
        </div>
    )
} */

/*
React's core principle is that the component's state should be the single source of truth.
For forms, this means React state, not the DOM, should own the data in the input field. To make a input "controlled", the value of the input is set from a variable in the component's state, and when the user types, the input's onChange event fires.
This event calls a function that updates the state variable, which in turn updates the input's value.
React Hook Form needs complete control over the input to manage its state, validation, and submission, and we use the `useController` hook to connect the input to the form state.
*/

'use client'

import React from 'react'
import { Control, FieldPath, useController } from 'react-hook-form'
import { CustomerType } from '../validation/CustomerValidation'

/*
In order to keep the "single source of truth" principle, it is better that defaultValue is defined in the parent component and passed down to this component.
*/

interface FloatLabelPasswordProps {
  name: FieldPath<CustomerType> // This ensures the name matches the structure of CustomerType
  prompt: string
  control: Control<CustomerType> // Now Typescript knows exactly what the form's structure is
}

const FloatLabelPassword: React.FC<FloatLabelPasswordProps> = ({
  name,
  prompt,
  control,
}) => {
  // Pass the `name` prop directly
  const { field, fieldState } = useController({ name, control })

  return (
    <div className='relative mb-4 mt-3'>
      {/* Use `field.name` for the id/htmlFor to ensure they always match */}
      <input
        type='password'
        id={field.name}
        // Spread the field object (all props in a simplified syntax) to connect the input to React Hook Form
        {...field}
        className='peer h-10 p-2 w-full rounded-md placeholder-transparent border border-gray-300 text-gray-800 outline-none focus:border-[3px] focus:border-blue-400 focus:ring-0'
        placeholder={prompt}
      />
      <label
        htmlFor={field.name}
        className='absolute left-0 ml-2 pl-1 pr-1 -top-2 text-gray-500 text-sm bg-white transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-2 peer-focus:text-blue-400 peer-focus:text-sm peer-focus:bg-white peer-focus:pl-1 peer-focus:pr-1 peer-focus:font-bold'
      >
        {prompt}
      </label>
      {fieldState.error ? (
        <div className='text-white bg-red-500 p-2 text-sm mt-1 rounded-md'>
          {fieldState.error.message}
        </div>
      ) : null}
    </div>
  )
}

export default FloatLabelPassword // Exporting at the bottom helps readability, reusability, and consistency with other components
