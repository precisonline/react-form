'use client'

import React from 'react'
import {
  Control,
  FieldValues,
  FieldPath,
  useController,
  PathValue, // Import PathValue for defaultValue
} from 'react-hook-form'

interface FloatLabelSelectProps<TFieldValues extends FieldValues> {
  name: FieldPath<TFieldValues> // Use FieldPath with TFieldValues
  prompt: string
  control: Control<TFieldValues> // Use Control with TFieldValues
  options: Record<string, string> // { value: label }
}

export const FloatLabelSelect = <TFieldValues extends FieldValues>({
  name,
  prompt,
  control,
  options,
}: FloatLabelSelectProps<TFieldValues>) => {
  const { field, fieldState } = useController({
    name,
    control,
    // Ensure defaultValue is correctly typed
    defaultValue: '' as PathValue<TFieldValues, FieldPath<TFieldValues>>,
  })

  return (
    <div className='relative mb-4 mt-3'>
      <select
        id={name}
        {...field}
        className='peer h-10 w-full appearance-none rounded-md border border-gray-300 bg-transparent p-2 pr-8 text-gray-800 outline-none placeholder-transparent focus:border-[3px] focus:border-blue-400 focus:ring-0'
      >
        {/* It's good practice to map over Object.entries for consistent key order
            and to handle the options prop being potentially undefined or empty if not required.
            If options is guaranteed, the check can be removed. */}
        {options &&
          Object.entries(options).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
      </select>
      {/* Arrow for select dropdown - basic styling example */}
      <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700'>
        <svg
          className='h-4 w-4 fill-current'
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 20 20'
        >
          <path d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' />
        </svg>
      </div>
      <label
        htmlFor={name}
        className='absolute left-0 -top-2 ml-2 bg-white px-1 text-sm text-gray-500 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2 peer-focus:text-sm peer-focus:text-blue-400 peer-focus:bg-white peer-focus:font-bold'
      >
        {prompt}
      </label>
      {fieldState.error && (
        <div className='mt-1 rounded-md bg-red-500 p-2 text-sm text-white'>
          {fieldState.error.message}
        </div>
      )}
    </div>
  )
}

export default FloatLabelSelect
