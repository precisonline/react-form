// 'use client'

// import React from 'react';
// import {
//     Control,
//     useController
// } from 'react-hook-form';

// interface FloatLabelTextProps {
//     id           : string;
//     defaultValue?: string;
//     prompt       : string;
//     control      : Control<any>;
// }

// export default function FloatLabelText({ id, prompt, control }: FloatLabelTextProps): React.JSX.Element {
//     const { field, fieldState } = useController({ name: id, control, defaultValue: '' });

//     return (
//         <div className="relative mb-4 mt-3">
//             <input {...field} type="text" className="peer h-10 p-2 w-full rounded-md placeholder-transparent border border-gray-300 text-gray-800 outline-none focus:border-[3px] focus:border-blue-400 focus:ring-0" placeholder={prompt} />
//             <label htmlFor={id} className="absolute left-0 ml-2 pl-1 pr-1 -top-2 text-blue-400 text-sm bg-white transition-all -peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-placeholder-shown:bg-transparent peer-placeholder-shown:pl-0 peer-placeholder-shown:text-gray-800 peer-focus:-top-2 peer-focus:text-blue-400 peer-focus:text-sm peer-focus:bg-white peer-focus:pl-1 peer-focus:pr-1 peer-focus:font-bold">
//                 {prompt}
//             </label>
//             {fieldState.error ? (<div className="text-white bg-red-500 p-2 text-sm mt-1">{ fieldState.error.message }</div>) : null}
//         </div>
//     )
// }

'use client'

import React, { FC } from 'react'
// Import FieldPath for the best type safety
import { Control, FieldPath, useController } from 'react-hook-form'
import { CustomerType } from '../validation/CustomerValidation'

interface FloatLabelTextProps {
  // Use `name` with `FieldPath` for type-safe field names
  name: FieldPath<CustomerType>
  prompt: string
  control: Control<CustomerType>
}

const FloatLabelText: FC<FloatLabelTextProps> = ({ name, prompt, control }) => {
  // Remove `defaultValue` and use the `name` prop directly.
  // Default values should be set in the `useForm` hook.
  const { field, fieldState } = useController({ name, control })

  return (
    <div className='relative mb-4 mt-3'>
      {/* Same change as others for connecting the input to React Hook Form*/}
      <input
        type='text'
        id={field.name}
        {...field}
        className='peer h-10 w-full rounded-md border border-gray-300 bg-transparent p-2 text-gray-800 outline-none placeholder-transparent focus:border-[3px] focus:border-blue-400 focus:ring-0'
        placeholder={prompt}
      />
      <label
        htmlFor={field.name}
        // Using the same classes as your other components for a consistent look
        className='absolute left-0 -top-2 ml-2 bg-white pl-1 pr-1 text-sm text-gray-500 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2 peer-focus:text-sm peer-focus:text-blue-400 peer-focus:bg-white peer-focus:pl-1 peer-focus:pr-1 peer-focus:font-bold'
      >
        {prompt}
      </label>
      {fieldState.error ? (
        <div className='mt-1 rounded-md bg-red-500 p-2 text-sm text-white'>
          {fieldState.error.message}
        </div>
      ) : null}
    </div>
  )
}

export default FloatLabelText
