import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import UserProfileForm from '../../components/UserProfileForm'
import ThemeProvider from '../../components/ThemeProvider'
import { Address } from '../../schemas/addressSchema'

// Mock the AddressFormDialog component
jest.mock('../../components/AddressFormDialog', () => ({
  __esModule: true,
  default: ({
    open,
    onClose,
    onSave,
    initialData,
  }: {
    open: boolean
    onClose: () => void
    onSave: (data: Address) => void
    initialData: Address | null
  }) => {
    if (!open) return null
    return (
      <div data-testid='address-form-dialog'>
        <button
          onClick={() =>
            onSave({
              ...(initialData || {}),
              streetAddress: '123 Main St',
              city: 'Anytown',
              state: 'CA',
              zipCode: '12345',
              country: 'USA',
              addressType: 'Home',
            } as Address)
          }
        >
          Save Address
        </button>
        <button onClick={onClose}>Close</button>
      </div>
    )
  },
}))

describe('UserProfileForm', () => {
  const renderWithProviders = (ui: React.ReactElement) => {
    return render(<ThemeProvider>{ui}</ThemeProvider>)
  }

  test('renders all form fields correctly', () => {
    renderWithProviders(<UserProfileForm />)
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /add new/i })).toBeInTheDocument()
    expect(
      screen.getByLabelText(/subscribe to our newsletter/i)
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /save profile/i })
    ).toBeInTheDocument()
  })

  test('submit button is disabled when form is invalid', () => {
    renderWithProviders(<UserProfileForm />)
    const submitButton = screen.getByRole('button', { name: /save profile/i })
    expect(submitButton).toBeDisabled()
  })

  test('enables submit button when form is valid', async () => {
    renderWithProviders(<UserProfileForm />)

    fireEvent.change(screen.getByLabelText(/first name/i), {
      target: { value: 'Jane' },
    })
    fireEvent.change(screen.getByLabelText(/last name/i), {
      target: { value: 'Doe' },
    })
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'jane.doe@example.com' },
    })
    fireEvent.change(screen.getByLabelText(/phone number/i), {
      target: { value: '1234567890' },
    })

    await waitFor(() => {
      const submitButton = screen.getByRole('button', { name: /save profile/i })
      expect(submitButton).toBeEnabled()
    })
  })

  test('adds, edits, and removes addresses', async () => {
    renderWithProviders(<UserProfileForm />)

    // Add a new address
    fireEvent.click(screen.getByRole('button', { name: /add new/i }))
    await screen.findByTestId('address-form-dialog')
    fireEvent.click(screen.getByRole('button', { name: /save address/i }))

    await waitFor(() => {
      expect(screen.getByText(/123 main st/i)).toBeInTheDocument()
    })

    // Edit the address
    fireEvent.click(screen.getByLabelText(/edit address/i))
    await screen.findByTestId('address-form-dialog')
    fireEvent.click(
      screen.getByRole('button', {
        name: /save address/i,
      })
    )

    // Remove the address
    fireEvent.click(screen.getByLabelText(/delete address/i))
    await waitFor(() => {
      expect(screen.queryByText(/123 main st/i)).not.toBeInTheDocument()
    })
  })

  test('displays an error when adding a duplicate address', async () => {
    renderWithProviders(<UserProfileForm />)

    // Add an address
    fireEvent.click(screen.getByRole('button', { name: /add new/i }))
    await screen.findByTestId('address-form-dialog')
    fireEvent.click(screen.getByRole('button', { name: /save address/i }))
    await waitFor(() => {
      expect(screen.getByText(/123 main st/i)).toBeInTheDocument()
    })

    // Try to add the same address again
    fireEvent.click(screen.getByRole('button', { name: /add new/i }))
    await screen.findByTestId('address-form-dialog')
    fireEvent.click(screen.getByRole('button', { name: /save address/i }))

    await waitFor(() => {
      expect(
        screen.getByText('This address already exists.')
      ).toBeInTheDocument()
    })
  })

  test('submits the form with valid data', async () => {
    const consoleSpy = jest.spyOn(console, 'log')
    renderWithProviders(<UserProfileForm />)

    fireEvent.change(screen.getByLabelText(/first name/i), {
      target: { value: 'Jane' },
    })
    fireEvent.change(screen.getByLabelText(/last name/i), {
      target: { value: 'Doe' },
    })
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'jane.doe@example.com' },
    })
    fireEvent.change(screen.getByLabelText(/phone number/i), {
      target: { value: '1234567890' },
    })

    const submitButton = screen.getByRole('button', { name: /save profile/i })
    await waitFor(() => expect(submitButton).toBeEnabled())

    fireEvent.click(submitButton)

    await waitFor(
      () => {
        expect(consoleSpy).toHaveBeenCalledWith(
          'Final Profile Submitted:',
          expect.objectContaining({
            contact: {
              firstName: 'Jane',
              lastName: 'Doe',
              email: 'jane.doe@example.com',
              phone: '1234567890',
            },
          })
        )
      },
      { timeout: 2000 }
    )

    expect(
      await screen.findByText(
        'Profile saved successfully!',
        {},
        { timeout: 4000 }
      )
    ).toBeInTheDocument()
    consoleSpy.mockRestore()
  })
})
