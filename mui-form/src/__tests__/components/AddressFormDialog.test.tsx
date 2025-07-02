import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AddressFormDialog from '../../components/AddressFormDialog'
import ThemeProvider from '../../components/ThemeProvider'
import { Address } from '../../schemas/addressSchema'

const mockOnSave = jest.fn()
const mockOnClose = jest.fn()

const setup = (initialData: Address | null = null) => {
  const user = userEvent.setup()
  render(
    <ThemeProvider>
      <AddressFormDialog
        open={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
        initialData={initialData}
      />
    </ThemeProvider>
  )
  return { user }
}

describe('AddressFormDialog', () => {
  it('validates required fields', async () => {
    const user = userEvent.setup()

    render(
      <ThemeProvider>
        <AddressFormDialog
          open={true}
          onClose={jest.fn()}
          onSave={jest.fn()}
          initialData={null}
        />
      </ThemeProvider>
    )

    await user.click(screen.getByRole('button', { name: /save address/i }))

    await waitFor(() => {
      expect(screen.getByTestId('streetAddress-error')).toHaveTextContent(
        'Street address is required'
      )
      expect(screen.getByTestId('city-error')).toHaveTextContent(
        'City is required'
      )
      expect(screen.getByTestId('state-error')).toHaveTextContent(
        'State is required'
      )
      expect(screen.getByTestId('zipCode-error')).toHaveTextContent(
        'ZIP code is required'
      )
    })
  })

  test('shows different fields for Canada', async () => {
    const { user } = setup()
    await user.click(screen.getByLabelText(/country/i))
    await user.click(screen.getByRole('option', { name: 'Canada' }))

    expect(await screen.findByLabelText(/province/i)).toBeInTheDocument()
    expect(await screen.findByLabelText(/postal code/i)).toBeInTheDocument()
  })

  test('shows different fields for UK', async () => {
    const { user } = setup()
    await user.click(screen.getByLabelText(/country/i))
    await user.click(screen.getByRole('option', { name: 'UK' }))

    expect(await screen.findByLabelText(/postcode/i)).toBeInTheDocument()
  })

  test('calls onSave with correct data', async () => {
    const { user } = setup()
    await user.type(screen.getByLabelText(/street address/i), '123 Main St')
    await user.type(screen.getByLabelText(/city/i), 'Anytown')
    await user.type(screen.getByLabelText(/state/i), 'CA')
    await user.type(screen.getByLabelText(/zip code/i), '12345')

    await user.click(screen.getByLabelText(/address type/i))
    await user.click(screen.getByRole('option', { name: 'Home' }))

    await user.click(screen.getByRole('button', { name: /save address/i }))

    expect(mockOnSave).toHaveBeenCalledWith(
      expect.objectContaining({
        streetAddress: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        zipCode: '12345',
        addressType: 'Home',
        country: 'USA',
      })
    )
  })

  test('loads initial data for editing', () => {
    const initialData: Address = {
      id: '1',
      streetAddress: '456 Oak Ave',
      city: 'Othertown',
      state: 'TX',
      zipCode: '67890',
      country: 'USA',
      addressType: 'Work',
    }

    setup(initialData)

    expect(screen.getByDisplayValue('456 Oak Ave')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Othertown')).toBeInTheDocument()
    expect(screen.getByDisplayValue('TX')).toBeInTheDocument()
    expect(screen.getByDisplayValue('67890')).toBeInTheDocument()
  })
})
