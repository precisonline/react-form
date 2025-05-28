import { z } from 'zod'

export const tenant2ProductOrderSchema = z.object({
  // productId refers to a Tenant2DigitalProduct
  productId: z.string().min(1, { message: 'Please select a digital product.' }),

  t2_numberOfLicenses: z.coerce
    .number({ invalid_type_error: 'Number of licenses must be a number.' })
    .int({ message: 'Number of licenses must be a whole number.' })
    .positive({ message: 'You must request at least 1 license.' })
    .min(1, { message: 'At least one license is required.' })
    .default(1),

  t2_recipientEmail: z
    .string()
    .min(1, { message: 'Recipient email is required for delivery.' })
    .email({
      message: 'Please enter a valid email address for product delivery.',
    }),

  t2_acceptLicenseAgreement: z
    .boolean({
      required_error: 'You must accept the license agreement.',
      invalid_type_error: 'You must accept the license agreement.',
    })
    .refine((val) => val === true, {
      message: 'Acceptance of the license agreement is required.',
    }),

  t2_promotionalCode: z.string().max(20).optional().or(z.literal('')),
})

export type Tenant2ProductOrderData = z.infer<typeof tenant2ProductOrderSchema>
