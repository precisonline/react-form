import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import AddressFormDialog from '../../components/AddressFormDialog'
import { AddressFormDialogProps } from '../../types/form'
import { AddressFormData } from '../../schemas/userProfileSchema'

// A reusable mock address that ensures the form starts in a known state
const mockUsaAddress: AddressFormData = {
  id: '123',
  addressType: 'Home',
  country: 'USA',
  usaStreetAddress: '123 Main St',
  usaCity: 'Denver',
  usaState: 'CO',
  usaZipCode: '80202',
}

// Helper to render the component with sensible defaults that can be overridden
const renderComponent = (props: Partial<AddressFormDialogProps> = {}) => {
  const defaultProps = {
    open: true,
    onClose: jest.fn(),
    onSave: jest.fn(),
    initialData: null,
  }
  const finalProps = { ...defaultProps, ...props }
  const theme = createTheme()

  return {
    user: userEvent.setup(),
    ...render(
      <ThemeProvider theme={theme}>
        <AddressFormDialog {...finalProps} />
      </ThemeProvider>
    ),
    // Return mock functions for easy access in tests
    onSave: finalProps.onSave,
    onClose: finalProps.onClose,
  }
}

// Mock any API calls if your component makes them
beforeEach(() => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({
      countries: [
        { name: 'USA', code: 'US' },
        { name: 'Canada', code: 'CA' },
      ],
      states: [
        { name: 'Colorado', code: 'CO' },
        { name: 'New York', code: 'NY' },
      ],
      provinces: [
        { name: 'Ontario', code: 'ON' },
        { name: 'Quebec', code: 'QC' },
      ],
    }),
  })
})

describe('AddressFormDialog', () => {
  it('renders correctly after loading', async () => {
    renderComponent()

    // THE KEY FIX: Wait for any loading indicators to disappear first.
    // We use queryByRole because it returns null instead of throwing an error if not found.
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
    })

    // NOW that loading is done, we can safely find our elements.
    expect(
      screen.getByRole('combobox', { name: /country/i })
    ).toBeInTheDocument()
    expect(screen.getByLabelText(/street address/i)).toBeInTheDocument()
  })

  describe('User Interaction and Form Validation', () => {
    it('switches to Canada address fields when country is changed', async () => {
      const { user } = renderComponent({ initialData: mockUsaAddress })

      const countrySelect = await screen.findByRole('combobox', {
        name: /country/i,
      })
      await user.click(countrySelect)

      const canadaOption = await screen.findByRole('option', {
        name: 'Canada',
      })
      await user.click(canadaOption)

      expect(await screen.findByLabelText(/province/i)).toBeInTheDocument()
      expect(screen.queryByLabelText(/state/i)).not.toBeInTheDocument()
    })

    it('displays validation errors for incomplete USA address', async () => {
      const { user } = renderComponent({ initialData: mockUsaAddress })
      const saveButton = await screen.findByRole('button', {
        name: /save address/i,
      })

      // Submit the form without filling it out to trigger validation
      await user.click(saveButton)

      // Assert that validation messages appear
      expect(
        await screen.findByText('Street address is required for USA')
      ).toBeInTheDocument()
    })
  })

  describe('Form Submission', () => {
    it('calls onSave with the correct data when form is valid', async () => {
      // THE FIX: Render with initial data to ensure the form fields exist
      const { user, onSave } = renderComponent({ initialData: mockUsaAddress })

      const streetInput = await screen.findByLabelText(/street address/i)
      const saveButton = screen.getByRole('button', { name: /save address/i })

      // The form should be valid initially with the mock data, so the button is enabled
      await waitFor(() => expect(saveButton).toBeEnabled())

      // Make a change
      await user.clear(streetInput)
      await user.type(streetInput, '456 New Street')

      await user.click(saveButton)

      expect(onSave).toHaveBeenCalledTimes(1)
      expect(onSave).toHaveBeenCalledWith(
        expect.objectContaining({ usaStreetAddress: '456 New Street' })
      )
    })
  })
})
