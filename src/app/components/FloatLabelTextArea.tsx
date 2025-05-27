// 'use client'

// import React from 'react';
// import {
//     Control,
//     useController
// } from 'react-hook-form';

// import { ZodString } from 'zod';
// interface FloatLabelTextAreaProps {
//     id:            string;
//     prompt:        string;
//     control:       Control<any>;
// }

// export default function FloatLabelTextArea({ id, prompt, control } : FloatLabelTextAreaProps) : React.JSX.Element {
//     const { field, fieldState } = useController({ name: id, control, defaultValue: '' });

//     return(
//         <div className="relative mb-4 mt-3">
//             <textarea {...field } className="peer h-50 p-2 w-full rounded-md placeholder-transparent border border-gray-300 text-gray-800 outline-none focus:border-[3px] focus:border-blue-400 focus:ring-0" placeholder={prompt} />
//             <label htmlFor={id} className="absolute left-0 ml-2 pl-1 pr-1 -top-2 text-blue-400 text-sm bg-white transition-all -peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-placeholder-shown:bg-transparent peer-placeholder-shown:pl-0 peer-placeholder-shown:text-gray-800 peer-focus:-top-2 peer-focus:text-blue-400 peer-focus:text-sm peer-focus:bg-white peer-focus:pl-1 peer-focus:pr-1">
//             {prompt}
//             </label>
//             { fieldState.error ? (<div className="text-white bg-red-500 p-2 text-sm mt-1">{ fieldState.error.message }</div>) : null }
//         </div>
//     )
// }

'use client'

import React from 'react'
// Import FieldPath for the best type safety
import { Control, FieldPath, useController } from 'react-hook-form'
import { CustomerType } from '../validation/CustomerValidation'

interface FloatLabelTextAreaProps {
  // Use `name` with `FieldPath` for type-safe field names
  name: FieldPath<CustomerType>
  prompt: string
  control: Control<CustomerType>
}

const FloatLabelTextArea: React.FC<FloatLabelTextAreaProps> = ({
  name,
  prompt,
  control,
}) => {
  const { field, fieldState } = useController({ name, control })

  return (
    <div className='relative mb-4 mt-3'>
      {/* Same change here for connecting the input to React Hook State */}
      <textarea
        id={field.name}
        {...field}
        // I had a custom height [48px] because that's how I was standardizing the dropdown, there might be a better solution though
        className='peer h-48 w-full rounded-md border border-gray-300 bg-transparent p-2 text-gray-800 outline-none placeholder-transparent focus:border-[3px] focus:border-blue-400 focus:ring-0'
        placeholder={prompt}
      />
      <label
        htmlFor={field.name}
        // Standardized label styling
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

export default FloatLabelTextArea
