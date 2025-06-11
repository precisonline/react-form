import { AddressFormData } from '../schemas/userProfileSchema'

export interface AddressFormDialogProps {
  open: boolean

  onClose: () => void

  onSave: (data: AddressFormData) => void

  initialData?: AddressFormData | null
}
