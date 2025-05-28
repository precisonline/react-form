import type { BaseProduct } from '../common/productTypes' // Import the BaseProduct

// Tenant2DigitalProduct includes all fields from BaseProduct
// plus the fields defined specifically here.
export interface Tenant2DigitalProduct extends BaseProduct {
  // Fields specific to Tenant 2's digital products
  fileFormat?: string
  downloadUrl: string
  version?: string
  licenseType: 'subscription' | 'perpetual' | 'one-time'
  platformCompatibility?: string[]
  fileSizeMb?: number
}
