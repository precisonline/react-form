'use client'

import React, { useEffect, useState } from 'react'
import { useForm, SubmitHandler, FieldValues } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { notFound } from 'next/navigation'

import { getFormConfig, FormConfig } from '@/app/forms/loader'
import type { SelectableProduct } from '@/app/types/common'

export default function DynamicFormPage({
  params,
}: {
  params: { tenantSlug: string; formSlug: string }
}) {
  const [config, setConfig] = useState<
    FormConfig<FieldValues> | null | undefined
  >(undefined)
  const [dynamicLayoutProps, setDynamicLayoutProps] = useState<
    Record<string, unknown>
  >({})

  const { tenantSlug, formSlug } = params

  useEffect(() => {
    const loadConfigAndData = async () => {
      // Use the destructured variables
      const foundConfig = await getFormConfig(tenantSlug, formSlug)
      setConfig(foundConfig)

      if (foundConfig) {
        if (
          tenantSlug === 'tenant1' && // Use destructured variables
          formSlug === 'product-order' // Use destructured variables
        ) {
          const mockProducts: SelectableProduct[] = [
            { id: 'prod_101', name: 'Super Widget X', displayInfo: '$29.99' },
            { id: 'prod_102', name: 'Mega Gizmo Pro', displayInfo: '$49.50' },
          ]
          setDynamicLayoutProps({ selectableProducts: mockProducts })
        }
      }
    }
    loadConfigAndData()
  }, [tenantSlug, formSlug]) // Use the destructured, stable string variables as dependencies

  if (config === undefined) {
    return <div className='p-8 text-center'>Loading form configuration...</div>
  }
  if (config === null) {
    return notFound()
  }

  const {
    schema,
    LayoutComponent,
    defaultValues,
    formTitle,
    layoutStaticProps,
  } = config

  const FormRenderer = () => {
    const {
      control,
      handleSubmit,
      reset,
      formState: { errors }, // `errors` is defined here
    } = useForm({
      resolver: zodResolver(schema),
      defaultValues: defaultValues,
    })

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
      console.log(
        `Submitting data for form: ${tenantSlug}-${formSlug}`, // Use destructured variables
        data
      )
      alert(
        `Form for "${
          formTitle || `${tenantSlug} ${formSlug}` // Use destructured variables
        }" submitted! Check console.`
      )
      reset()
    }

    const allLayoutProps = {
      ...(layoutStaticProps || {}),
      ...dynamicLayoutProps,
    }

    return (
      <>
        {' '}
        {/* Use a Fragment to return multiple elements if needed */}
        <LayoutComponent
          control={control}
          handleSubmit={handleSubmit}
          onFormSubmit={onSubmit}
          {...allLayoutProps}
        />
        {/* SOLUTION: Move error display logic INSIDE FormRenderer */}
        {Object.keys(errors).length > 0 && (
          <div className='mx-auto mt-4 max-w-xl rounded-md bg-red-100 p-4 text-red-700'>
            <h3 className='font-bold'>Errors:</h3>
            <pre className='whitespace-pre-wrap'>
              {JSON.stringify(errors, null, 2)}
            </pre>
          </div>
        )}
      </>
    )
  }

  return (
    <div className='min-h-screen bg-gray-100 p-4 py-8 md:p-8'>
      <h1 className='mb-6 text-center text-3xl font-bold text-gray-800'>
        {formTitle ||
          `${params.tenantSlug.replace('-', ' ')} - ${params.formSlug.replace(
            '-',
            ' '
          )}`}
      </h1>
      <FormRenderer />
      {/* Error display logic has been moved into FormRenderer */}
    </div>
  )
}
