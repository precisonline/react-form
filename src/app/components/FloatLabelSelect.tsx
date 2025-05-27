// 'use client'

// import React           from 'react';
// import {
//     Control,
//     useController
// } from 'react-hook-form';

// interface FloatLabelSelectProps {
//     id      : string;
//     values? : object;
//     prompt  : string;
//     control : Control<any>;
// }

// export default function FloatLabelSelect({ id, prompt, values, control } : FloatLabelSelectProps) : React.JSX.Element {
//     const { field, fieldState } = useController({ name: id, control, defaultValue: '' });

//     return(
//         <div className="relative mb-4 mt-3">
//             <select {...field } className="peer h-10 p-2 w-full rounded-md placeholder-transparent border border-gray-300 text-gray-800 outline-none focus:border-[3px] focus:border-blue-400 focus:ring-0" >
//                 {
//                     values ? Object.entries(values).map(([key, desc]) => (
//                         <option key={key} value={key}>{desc}</option>
//                     )) : null
//                 }
//             </select>
//             <label htmlFor={id} className="absolute left-0 ml-2 pl-1 pr-1 -top-2 text-blue-400 text-sm bg-white transition-all -peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-placeholder-shown:bg-transparent peer-placeholder-shown:pl-0 peer-placeholder-shown:text-gray-800 peer-focus:-top-2 peer-focus:text-blue-400 peer-focus:text-sm peer-focus:bg-white peer-focus:pl-1 peer-focus:pr-1 peer-focus:font-bold">
//             {prompt}
//             </label>
//             {fieldState.error ? (<div className="text-white bg-red-500 p-2 text-sm mt-1">{ fieldState.error.message }</div>) : null}
//         </div>
//     )
// }

'use client'

import React from 'react'
import { Control, FieldPath, useController } from 'react-hook-form'
import { CustomerType } from '../validation/CustomerValidation'

interface FloatLabelSelectProps {
  // Use `name` with `FieldPath` for type-safe field names
  name: FieldPath<CustomerType>
  prompt: string
  // Use `Control<CustomerType>` for type-safe control
  control: Control<CustomerType>
  // Be specific: `values` is an object with string keys and string values
  values?: Record<string, string>
}

const FloatLabelSelect: React.FC<FloatLabelSelectProps> = ({
  name,
  prompt,
  values,
  control,
}) => {
  // Pass the `name` prop directly
  const { field, fieldState } = useController({ name, control })

  return (
    <div className='relative mb-4 mt-3'>
      {/* Pass the spread `field` object to connect to react-hook-form */}
      <select
        id={field.name}
        {...field}
        className='peer h-10 w-full appearance-none rounded-md border border-gray-300 bg-transparent p-2 text-gray-800 outline-none focus:border-[3px] focus:border-blue-400 focus:ring-0'
      >
        {
          // This mapping logic is good, and now it's fully typed!
          values
            ? Object.entries(values).map(([key, desc]) => (
                <option key={key} value={key}>
                  {desc}
                </option>
              ))
            : null
        }
      </select>
      {/* Use `field.name` for the label's `htmlFor` attribute */}
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

export default FloatLabelSelect // Exporting at the bottom helps readability, reusability, and consistency with other components
