import { ContactFormData, Country } from '../schemas/contactSchema'

export type { ContactFormData, Country }

export interface FormFieldProps {
  name: string
  label: string
  required?: boolean
  type?: string
  multiline?: boolean
  rows?: number
}
