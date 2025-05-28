import type { FormConfig } from '../loader'

// Import Tenant 2 specific schemas
import {
  tenant2ContactSchema,
  tenant2ProductOrderSchema,
} from '@/app/validation/tenant2' // Uses the barrel file

// Import Reusable Layout Components
import { ContactFormLayout } from '@/app/components/layouts/ContactFormLayout'
import { ProductOrderFormLayout } from '@/app/components/layouts/ProductOrderFormLayout'

const tenant2Forms: Record<string, FormConfig<any>> = {
  contact: {
    schema: tenant2ContactSchema,
    LayoutComponent: ContactFormLayout, // Reusing the same layout!
    defaultValues: {
      t2_contactName: '',
      t2_companyEmail: '',
      t2_subject: '',
      t2_details: '',
    },
    formTitle: 'Tenant 2 - Get In Touch',
    layoutStaticProps: {
      // Mapping ContactFormLayout's expected prop names to Tenant 2's schema field names
      nameFieldKey: 't2_contactName',
      emailFieldKey: 't2_companyEmail',
      messageFieldKey: 't2_details',
      // `phoneFieldKey` is omitted, so ContactFormLayout won't render a phone input.
      // We also need to pass the `title` for the layout if it's different from formTitle.
      title: 'Tenant 2 Inquiry', // This title is for inside the <ContactFormLayout>
      submitButtonText: 'Submit to Tenant 2 Support',
    },
  },

  'product-order': {
    schema: tenant2ProductOrderSchema,
    LayoutComponent: ProductOrderFormLayout, // Reusing the same layout!
    defaultValues: {
      productId: '',
      t2_numberOfLicenses: 1,
      t2_recipientEmail: '',
      t2_acceptLicenseAgreement: false,
      t2_promotionalCode: '',
    },
    formTitle: 'Tenant 2 - Digital Product Acquisition',
    layoutStaticProps: {
      // Mapping ProductOrderFormLayout's expected prop names to Tenant 2's schema field names
      productIdFieldKey: 'productId',
      quantityFieldKey: 't2_numberOfLicenses', // ProductOrderFormLayout calls it "Quantity"

      // --- IMPORTANT NOTE FOR DIGITAL PRODUCTS ---
      // ProductOrderFormLayout expects shipping fields. Since Tenant 2's order is digital,
      // these shipping fields from the schema are not present.
      // We will OMIT shippingFieldKey props. Your ProductOrderFormLayout
      // needs to be robust enough to conditionally render these sections
      // (e.g., `if (shippingAddressFieldKey) { ...render shipping fields... }`).
      // If not, you'd create a new DigitalProductOrderFormLayout.
      // For now, we assume ProductOrderFormLayout can handle missing shipping keys.

      // No specialInstructionsFieldKey needed for this example for Tenant 2
      // specialInstructionsFieldKey: 't2_orderNotes',

      submitButtonText: 'Complete Digital Order',
      // The `selectableProducts` prop for ProductOrderFormLayout will be passed dynamically
      // by the page component for Tenant 2's digital products.
    },
  },
}

export default tenant2Forms
