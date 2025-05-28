import { z } from 'zod'

/**
 * Zod schema for Tenant 2's contact form.
 * Rules and field names can be different from Tenant 1.
 */
export const tenant2ContactSchema = z.object({
  t2_contactName: z
    .string()
    .min(3, { message: 'Your name must be at least 3 characters.' }),
  t2_companyEmail: z
    .string()
    .min(1, { message: 'Company email is required.' })
    .email({ message: 'Please enter a valid company email address.' })
    .refine(
      (val) => val.endsWith('@tenant2.com') || val.endsWith('@example.com'),
      {
        // Example custom rule
        message: 'Please use your company email address from Tenant 2.',
      }
    ),
  // Tenant 2's contact form might not have a phone number field, or it's structured differently.
  // For this example, we'll omit a dedicated phone field but include a subject.
  t2_subject: z
    .string()
    .min(5, { message: 'Subject must be at least 5 characters.' }),
  t2_details: z
    .string()
    .min(15, { message: 'Please provide at least 15 characters of detail.' })
    .max(2000, { message: 'Details cannot exceed 2000 characters.' }),
})

export type Tenant2ContactData = z.infer<typeof tenant2ContactSchema>
