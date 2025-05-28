'use client'

import React from 'react' // FC is implicitly available with React import
import {
  Control,
  FieldValues,
  FieldPath,
  UseFormHandleSubmit,
  SubmitHandler,
} from 'react-hook-form'

// Import your generic UI components using the '@/app/' path alias
import FloatLabelText from '@/app/components/ui/FloatLabelText'
import FloatLabelTextArea from '@/app/components/ui/FloatLabelTextArea'
import FloatLabelSelect from '@/app/components/ui/FloatLabelSelect'

// Import types & data using the '@/app/' path alias,
// assuming barrel files (index.ts) are used in 'types/common'
import type { SelectableProduct } from '@/app/types/common'
import { statesObject } from '@/app/data/states'

/**
 * Props for the ProductOrderFormLayout.
 * It's generic to work with any form data structure (TFieldValues).
 */
interface ProductOrderFormLayoutProps<TFieldValues extends FieldValues> {
  // Core react-hook-form props passed from the dynamic page
  control: Control<TFieldValues>
  handleSubmit: UseFormHandleSubmit<TFieldValues>
  onFormSubmit: SubmitHandler<TFieldValues>

  // Dynamic data: a list of products formatted for the dropdown.
  // The parent page component is responsible for mapping its specific product type
  // to this SelectableProduct structure if needed.
  selectableProducts: SelectableProduct[]

  // --- Field Key Mapping Props ---
  // These allow the parent page to specify which keys in its schema
  // correspond to the fields this layout expects.
  productIdFieldKey: FieldPath<TFieldValues>
  quantityFieldKey: FieldPath<TFieldValues>
  shippingAddressFieldKey: FieldPath<TFieldValues>
  shippingCityFieldKey: FieldPath<TFieldValues>
  shippingStateFieldKey: FieldPath<TFieldValues>
  shippingZipFieldKey: FieldPath<TFieldValues>
  specialInstructionsFieldKey?: FieldPath<TFieldValues> // Optional

  // --- UI Customization Props ---
  title?: string
  submitButtonText?: string
}

export const ProductOrderFormLayout = <TFieldValues extends FieldValues>({
  control,
  handleSubmit,
  onFormSubmit,
  selectableProducts,
  productIdFieldKey,
  quantityFieldKey,
  shippingAddressFieldKey,
  shippingCityFieldKey,
  shippingStateFieldKey,
  shippingZipFieldKey,
  specialInstructionsFieldKey,
  title = 'Product Order Form', // Default title
  submitButtonText = 'Place Order', // Default button text
}: ProductOrderFormLayoutProps<TFieldValues>) => {
  // Transform the selectableProducts data for the FloatLabelSelect options
  const productOptions = selectableProducts.reduce(
    (acc, product) => {
      acc[product.id] = `${product.name}${
        product.displayInfo ? ` - ${product.displayInfo}` : ''
      }`
      return acc
    },
    { '': 'Select a Product...' } as Record<string, string> // Add a default placeholder
  )

  return (
    <form
      onSubmit={handleSubmit(onFormSubmit)}
      className='mx-auto flex max-w-2xl flex-col gap-y-4 rounded-lg bg-white p-6 shadow-xl md:p-8'
    >
      <h2 className='mb-6 text-center text-3xl font-bold text-gray-800'>
        {title}
      </h2>

      {/* Product Information Section */}
      <fieldset className='rounded-md border border-gray-300 p-4'>
        <legend className='-ml-1 px-2 font-semibold text-gray-700'>
          Product Details
        </legend>
        <div className='flex flex-col gap-y-4 md:flex-row md:gap-x-4'>
          <div className='flex-grow-[3] md:flex-grow'>
            {' '}
            {/* Adjust flex-grow as needed */}
            <FloatLabelSelect<TFieldValues>
              name={productIdFieldKey}
              prompt='Product'
              control={control}
              options={productOptions}
            />
          </div>
          <div className='w-full md:w-1/3'>
            <FloatLabelText<TFieldValues>
              name={quantityFieldKey}
              prompt='Quantity'
              type='number'
              control={control}
            />
          </div>
        </div>
      </fieldset>

      {/* Shipping Details Section */}
      <fieldset className='mt-4 rounded-md border border-gray-300 p-4'>
        <legend className='-ml-1 px-2 font-semibold text-gray-700'>
          Shipping Information
        </legend>
        <FloatLabelText<TFieldValues>
          name={shippingAddressFieldKey}
          prompt='Street Address'
          control={control}
        />
        <div className='mt-4 grid grid-cols-1 gap-4 md:grid-cols-3'>
          <FloatLabelText<TFieldValues>
            name={shippingCityFieldKey}
            prompt='City'
            control={control}
          />
          <FloatLabelSelect<TFieldValues>
            name={shippingStateFieldKey}
            prompt='State'
            control={control}
            options={statesObject} // Using the imported statesObject
          />
          <FloatLabelText<TFieldValues>
            name={shippingZipFieldKey}
            prompt='ZIP Code'
            control={control}
          />
        </div>
      </fieldset>

      {/* Optional Special Instructions */}
      {specialInstructionsFieldKey && (
        <fieldset className='mt-4 rounded-md border border-gray-300 p-4'>
          <legend className='-ml-1 px-2 font-semibold text-gray-700'>
            Additional Details
          </legend>
          <FloatLabelTextArea<TFieldValues>
            name={specialInstructionsFieldKey}
            prompt='Special Instructions (Optional)'
            control={control}
            rows={3}
          />
        </fieldset>
      )}

      <button
        type='submit'
        className='mt-6 w-full rounded-md bg-green-600 px-6 py-3 text-lg font-semibold text-white shadow-md transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2'
      >
        {submitButtonText}
      </button>
    </form>
  )
}
