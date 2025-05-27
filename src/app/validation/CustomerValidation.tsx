'use client'
import z from 'zod'

export const CustomerSchema = z.object({
  name: z.string().min(2).max(50),
  password: z
    .string()
    .min(6)
    .refine(
      (val) => {
        const alpha = (val.match(/[a-zA-Z]/g) || []).length
        const numeric = (val.match(/[0-9]/g) || []).length
        const special = (val.match(/[^a-zA-Z0-9]/g) || []).length
        return alpha >= 4 && numeric >= 2 && special >= 1
      },
      {
        message:
          'Password must contain at least 4 letters, 2 numbers, and 1 special character.',
      }
    ),
  address: z.string().min(5, 'Address is required.'),
  city: z.string().min(2, 'City is required.'),
  state: z.string().min(2, 'State is required.'),
  zip: z
    .string()
    .regex(
      /^\d{5}(-\d{4})?$/,
      'Invalid postal code format. Use 12345 or 12345-6789.'
    ),
  email: z.string().email('Invalid email format.'),
  phone: z
    .string()
    .regex(
      /^(1-)?\(?([2-9][0-8][0-9])\)?[-. ]?([2-9][0-9]{2})[-. ]?([0-9]{4})$/,
      'Invalid phone number format. Use 123-456-7890'
    ),
  comments: z.string().optional(),
})

export type CustomerType = z.infer<typeof CustomerSchema>

export const CustomerSchemaV2 = z.object({
  /*
    The following password validation uses a declarative regex approach with lookaheads.
    Each lookahead `(?=...)` acts as an AND condition, ensuring all rules (letters, numbers, special characters) are met without depending on their order.
    */
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long') // 8 considered a good minimum length
    .regex(/^(?=.*[a-zA-Z]{4,})(?=.*\d{2,})(?=.*[^a-zA-Z0-9]).*$/, {
      message:
        'Password must contain at least 4 letters, 2 numbers, and 1 special character.',
    }),

  /*
    This strategy accepts any common phone number format, then just sanitizes it to a consistent format for storage
    Remove all non-numeric characters, then after it's cleaned up, validate the result- essentially just any combo of 10 numbers
    */
  phone: z
    .string()
    .transform((val) => val.replace(/[^0-9]/g, ''))
    .pipe(
      z.string().regex(/^(1)?\d{10}$/, {
        message:
          'Must be a valid 10-digit phone number, optionally starting with 1.',
      })
    ),

  /*
    This is nit picky about error messages but according to UX principles, it's better to focus on the solution rather than the problem, and less cognitive load to be direct about what formats are acceptable.
    Please is also better than starting with 'invalid'.
     */
  zip: z
    .string()
    .regex(
      /^\d{5}(-\d{4})?$/,
      'Please enter a valid 5 or 9-digit postal code.'
    ),

  /*
    Adding trim to all string fields also helps with data consistency because people often accidentally add spaces at the beginning or end of their input, or don't notice when they're there
    */
})
