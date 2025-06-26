import { z } from 'zod'
import { ENUMS, validate } from './common'
import { addressSchema } from './addressSchema'

export const contactSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: validate.email(),
  phone: validate.phone(),
  addresses: z.array(addressSchema).optional(),
  newsletter: z.boolean().optional().default(false),
})

export type Contact = z.infer<typeof contactSchema>

export const defaultContact: Contact = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  newsletter: false,
  addresses: [],
}
