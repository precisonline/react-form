import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import AddressFormDialog from '../../components/AddressFormDialog'
import { addressSchema, AddressFormData } from '../../schemas/addressSchema'
import { SafeParseReturnType } from 'zod'

jest.mock('../../schemas/addressSchema', () => ({
  ...jest.requireActual('../../schemas/addressSchema'),
  countries: ['USA', 'Canada', 'UK'],
  addressTypes: ['Home', 'Work', 'Shipping', 'Billing', 'Other'],
}))

// We will build our mock data precisely for each test case
const mockEditAddress: AddressFormData = {
  id: 'abc-123',
  addressType: 'Work',
  country: 'USA',
  usaStreetAddress: '123 Main St',
  usaCity: 'Denver',
  usaState: 'CO',
  usaZipCode: '80202',
}

const renderComponent = (props = {}) => {
  const defaultProps = {
    open: true,
    onClose: jest.fn(),
    onSave: jest.fn(),
    initialData: null,
  }
  const finalProps = { ...defaultProps, ...props }
  const theme = createTheme()

  return {
    ...render(
      <ThemeProvider theme={theme}>
        <AddressFormDialog {...finalProps} />
      </ThemeProvider>
    ),
    ...finalProps,
  }
}

// Validation helper
const logValidationErrors = (result: SafeParseReturnType<unknown, unknown>) => {
  if (!result.success) {
    console.error('Validation Errors:', result.error.errors)
  }
}

describe('Address Schema Validation', () => {
  it('should validate USA address', () => {
    const result = addressSchema.safeParse(mockEditAddress)
    logValidationErrors(result)
    expect(result.success).toBe(true)
  })

  describe('Form Rendering', () => {
    it('should render populated USA fields in edit mode', () => {
      const { getByLabelText } = renderComponent({
        initialData: mockEditAddress,
      })

      // Verify specific fields are populated
      expect(getByLabelText(/street address/i)).toHaveValue('123 Main St')
      expect(getByLabelText(/city/i)).toHaveValue('Denver')
      expect(getByLabelText(/state/i)).toHaveValue('CO')
      expect(getByLabelText(/zip code/i)).toHaveValue('80202')
    })

    it('should enable Save button with valid address', async () => {
      const { getByRole, getByLabelText } = renderComponent()

      // Select country and address type
      const countrySelect = getByRole('combobox', { name: /country/i })
      const addressTypeSelect = getByRole('combobox', { name: /address type/i })

      // Select USA
      await userEvent.click(countrySelect)
      const countryListbox = await screen.findByRole('listbox')
      await userEvent.click(within(countryListbox).getByText('USA'))

      // Select address type
      await userEvent.click(addressTypeSelect)
      const addressTypeListbox = await screen.findByRole('listbox')
      await userEvent.click(within(addressTypeListbox).getByText('Shipping'))

      // Fill out required fields
      await userEvent.type(getByLabelText(/street address/i), '456 Market St')
      await userEvent.type(getByLabelText(/city/i), 'San Francisco')
      await userEvent.type(getByLabelText(/state/i), 'CA')
      await userEvent.type(getByLabelText(/zip code/i), '94105')

      const saveButton = getByRole('button', { name: /save address/i })

      await waitFor(
        () => {
          expect(saveButton).toBeEnabled()
        },
        { timeout: 2000 }
      )
    })
  })
})
