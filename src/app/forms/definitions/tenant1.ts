import type { FormConfig } from '../loader'

import {
  tenant1ContactSchema,
  tenant1ProductOrderSchema,
} from '@/app/validation/tenant1'

import { ContactFormLayout } from '@/app/components/layouts/ContactFormLayout'
import { ProductOrderFormLayout } from '@/app/components/layouts/ProductOrderFormLayout'

const tenant1Forms: Record<string, FormConfig<any>> = {
  contact: {
    schema: tenant1ContactSchema,
    LayoutComponent: ContactFormLayout,
    defaultValues: {
      t1_fullName: '',
      t1_contactEmail: '',
      t1_phoneNumber: '',
      t1_messageContent: '',
    },
    formTitle: 'Tenant 1 - Contact Us',
    layoutStaticProps: {
      // These props are passed directly to ContactFormLayout
      nameFieldKey: 't1_fullName',
      emailFieldKey: 't1_contactEmail',
      phoneFieldKey: 't1_phoneNumber',
      messageFieldKey: 't1_messageContent',
      submitButtonText: 'Send Message to Tenant 1',
    },
  },

  'product-order': {
    schema: tenant1ProductOrderSchema,
    LayoutComponent: ProductOrderFormLayout,
    defaultValues: {
      productId: '', // Assuming schema uses generic 'productId'
      t1_quantity: 1,
      t1_shippingFullName: '',
      t1_shippingAddressLine1: '',
      t1_shippingAddressLine2: '',
      t1_shippingCity: '',
      t1_shippingState: '',
      t1_shippingZip: '',
      t1_specialInstructions: '',
    },
    formTitle: 'Tenant 1 - Place Your Order',
    layoutStaticProps: {
      // These props are passed directly to ProductOrderFormLayout
      // Note: `products` (the actual list) is dynamic and will be passed by the page component.
      productIdFieldKey: 'productId',
      quantityFieldKey: 't1_quantity',
      shippingAddressFieldKey: 't1_shippingAddressLine1',
      shippingCityFieldKey: 't1_shippingCity',
      shippingStateFieldKey: 't1_shippingState',
      shippingZipFieldKey: 't1_shippingZip',
      specialInstructionsFieldKey: 't1_specialInstructions',
      submitButtonText: 'Submit Order for Tenant 1',
    },
  },
}

export default tenant1Forms
