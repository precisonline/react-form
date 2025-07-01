import { z } from 'zod'
import { validate } from './common'

export const contactSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: validate.email(),
  phone: validate.phone(),
})

export type Contact = z.infer<typeof contactSchema>

export const defaultContact: Contact = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
}
