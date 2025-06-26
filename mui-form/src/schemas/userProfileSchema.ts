import { z } from 'zod'
import { addressSchema } from './addressSchema'
import { contactSchema } from './contactSchema'

export const userProfileSchema = z.object({
  contact: contactSchema,
  addresses: z.array(addressSchema).optional(),
  newsletter: z.boolean().default(false),
})

export type UserProfileFormData = z.infer<typeof userProfileSchema>

export const defaultUserProfileValues: UserProfileFormData = {
  contact: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  },
  addresses: [],
  newsletter: false,
}
