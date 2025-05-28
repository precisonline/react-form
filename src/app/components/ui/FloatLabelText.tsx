'use client'

import React from 'react'
import {
  Control,
  FieldPath,
  FieldValues,
  useController,
  PathValue,
} from 'react-hook-form'

interface FloatLabelTextProps<TFieldValues extends FieldValues> {
  name: FieldPath<TFieldValues>
  prompt: string
  control: Control<TFieldValues>
  type?: 'text' | 'email' | 'tel' | 'number' | 'url'
}

const FloatLabelText = <TFieldValues extends FieldValues>({
  name,
  prompt,
  control,
  type = 'text',
}: FloatLabelTextProps<TFieldValues>) => {
  const { field, fieldState } = useController({
    name,
    control,
    defaultValue: '' as PathValue<TFieldValues, FieldPath<TFieldValues>>,
  })

  return (
    <div className='relative mb-4 mt-3'>
      <input
        id={name}
        type={type}
        {...field}
        className='peer h-10 w-full rounded-md border border-gray-300 bg-transparent p-2 text-gray-800 outline-none placeholder-transparent focus:border-[3px] focus:border-blue-400 focus:ring-0'
        placeholder={prompt}
      />
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

export default FloatLabelText
