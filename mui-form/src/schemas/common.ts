import { z } from 'zod'

export const VALIDATION = {
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  phone: /^\+?1?\d{10,14}$/,
  zipCode: {
    usa: /^\d{5}(-\d{4})?$/,
    canada: /^[A-Z]\d[A-Z] \d[A-Z]\d$/,
  },
} as const

export const ENUMS = {
  countries: ['USA', 'Canada', 'UK', 'Other'] as const,
  addressTypes: ['Home', 'Work', 'Shipping', 'Billing'] as const,
  contactMethods: ['Email', 'Phone', 'Mail'] as const,
} as const

export const validate = {
  email: (message = 'Invalid email address') =>
    z.string().regex(VALIDATION.email, message),

  phone: (message = 'Invalid phone number') =>
    z.string().regex(VALIDATION.phone, message),

  required: (message = 'This field is required') => z.string().min(1, message),
}
