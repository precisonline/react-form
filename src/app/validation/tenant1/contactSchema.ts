import { z } from 'zod'

export const tenant1ContactSchema = z.object({
  t1_fullName: z
    .string()
    .min(2, { message: 'Full name must be at least 2 characters.' }),
  t1_contactEmail: z
    .string()
    .min(1, { message: 'Email address is required.' })
    .email({ message: 'Please enter a valid email address.' }),
  t1_phoneNumber: z
    .string()
    .regex(/^\d{10}$/, { message: 'Phone number must be exactly 10 digits.' })
    .optional()
    .or(z.literal('')),
  t1_messageContent: z
    .string()
    .min(10, { message: 'Message must be at least 10 characters long.' }),
})

export type Tenant1ContactData = z.infer<typeof tenant1ContactSchema>
