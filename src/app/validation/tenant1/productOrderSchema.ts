import { z } from 'zod'
import { statesArray } from '../../data/states'

export const tenant1ProductOrderSchema = z.object({
  // productId can remain generic as it likely refers to a universal product ID,
  // but if Tenant 1 has its own product ID format/namespace, you could use t1_productId.
  // For this example, we'll assume productId is a common identifier.
  productId: z.string().min(1, { message: 'Please select a product.' }),

  t1_quantity: z.coerce
    .number({ invalid_type_error: 'Quantity must be a number.' })
    .int({ message: 'Quantity must be a whole number.' })
    .positive({ message: 'You must order at least 1 item.' })
    .min(1, { message: 'You must order at least 1 item.' }),

  t1_shippingFullName: z
    .string()
    .min(3, { message: 'Full name for shipping is required.' }),
  t1_shippingAddressLine1: z
    .string()
    .min(5, { message: 'A shipping address is required.' }),
  t1_shippingAddressLine2: z.string().optional(),
  t1_shippingCity: z
    .string()
    .min(2, { message: 'A city is required for shipping.' }),
  t1_shippingState: z.enum(statesArray, {
    errorMap: () => ({ message: 'Please select a valid state for shipping.' }),
  }),
  t1_shippingZip: z.string().regex(/^\d{5}(-\d{4})?$/, {
    message: 'Please enter a valid 5 or 9-digit ZIP code for shipping.',
  }),
  t1_specialInstructions: z
    .string()
    .max(500, {
      message: 'Special instructions cannot exceed 500 characters.',
    })
    .optional(),
})

export type Tenant1ProductOrderData = z.infer<typeof tenant1ProductOrderSchema>
