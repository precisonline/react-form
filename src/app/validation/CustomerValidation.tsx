import { z } from 'zod'

import { statesArray } from '../data/states'

export const CustomerSchema = z.object({
  name: z
    .string({
      required_error: 'Name is required.',
      invalid_type_error: 'Name must be a string.',
    })
    .trim() // Remove leading/trailing whitespace
    .min(2, { message: 'Name must be at least 2 characters.' })
    .max(50, { message: 'Name cannot exceed 50 characters.' }),

  password: z
    .string({ required_error: 'Password is required.' })
    .min(8, { message: 'Password must be at least 8 characters long.' })

    .regex(/^(?=.*[a-zA-Z]{4,})(?=.*\d{2,})(?=.*[^a-zA-Z0-9]).*$/, {
      message:
        'Password must have min 4 letters, 2 numbers, 1 special character.',
    }),

  address: z
    .string({ required_error: 'Address is required.' })
    .trim()
    .min(5, { message: 'Address must be at least 5 characters.' }),

  city: z
    .string({ required_error: 'City is required.' })
    .trim()
    .min(2, { message: 'City must be at least 2 characters.' }),

  state: z.enum(statesArray, {
    required_error: 'State is required.',
    invalid_type_error: 'Please select a valid state.',
  }),

  zip: z
    .string({ required_error: 'Postal code is required.' })
    .trim()
    .regex(/^\d{5}(-\d{4})?$/, {
      message:
        'Please enter a valid 5 or 9-digit postal code (e.g., 12345 or 12345-6789).',
    }),

  email: z
    .string({ required_error: 'Email is required.' })
    .trim()
    .toLowerCase()
    .email({ message: 'Please enter a valid email address.' }),

  phone: z
    .string({ required_error: 'Phone number is required.' })
    .trim()

    .transform((val) => val.replace(/\D/g, ''))
    .pipe(
      z.string().regex(/^(1)?\d{10}$/, {
        // Allows optional '1' prefix, then 10 digits
        message:
          'Please enter a valid 10-digit phone number (e.g., 1234567890).',
      })
    ),

  comments: z
    .string()
    .trim()
    .max(1000, { message: 'Comments cannot exceed 1000 characters.' }) // Added max length
    .optional(), // Optional field
})

export type CustomerType = z.infer<typeof CustomerSchema>
