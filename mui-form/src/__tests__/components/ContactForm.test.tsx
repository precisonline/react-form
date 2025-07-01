import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ContactForm from '../../components/ContactForm'
import ThemeProvider from '../../components/ThemeProvider'

describe('ContactForm', () => {
  const renderWithProviders = (ui: React.ReactElement) => {
    return render(<ThemeProvider>{ui}</ThemeProvider>)
  }

  test('renders all form fields correctly', () => {
    renderWithProviders(<ContactForm />)
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument()
  })

  test('submit button is disabled when form is invalid', () => {
    renderWithProviders(<ContactForm />)
    const submitButton = screen.getByRole('button', { name: /submit/i })
    expect(submitButton).toBeDisabled()
  })

  test('enables submit button when form is valid', async () => {
    renderWithProviders(<ContactForm />)

    fireEvent.change(screen.getByLabelText(/first name/i), {
      target: { value: 'John' },
    })
    fireEvent.change(screen.getByLabelText(/last name/i), {
      target: { value: 'Doe' },
    })
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'john.doe@example.com' },
    })
    fireEvent.change(screen.getByLabelText(/phone/i), {
      target: { value: '1234567890' },
    })

    await waitFor(() => {
      const submitButton = screen.getByRole('button', { name: /submit/i })
      expect(submitButton).toBeEnabled()
    })
  })

  test('shows validation errors for invalid input', async () => {
    renderWithProviders(<ContactForm />)

    fireEvent.change(screen.getByLabelText(/first name/i), {
      target: { value: 'J' },
    })
    fireEvent.blur(screen.getByLabelText(/first name/i))

    expect(
      await screen.findByText('First name is required')
    ).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'invalid-email' },
    })
    fireEvent.blur(screen.getByLabelText(/email/i))

    expect(await screen.findByText('Invalid email address')).toBeInTheDocument()
  })

  test('submits the form with valid data', async () => {
    const consoleSpy = jest.spyOn(console, 'log')
    renderWithProviders(<ContactForm />)

    fireEvent.change(screen.getByLabelText(/first name/i), {
      target: { value: 'John' },
    })
    fireEvent.change(screen.getByLabelText(/last name/i), {
      target: { value: 'Doe' },
    })
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'john.doe@example.com' },
    })
    fireEvent.change(screen.getByLabelText(/phone/i), {
      target: { value: '1234567890' },
    })

    const submitButton = screen.getByRole('button', { name: /submit/i })
    await waitFor(() => expect(submitButton).toBeEnabled())

    fireEvent.click(submitButton)

    await waitFor(
      () => {
        expect(consoleSpy).toHaveBeenCalledWith(
          'Submitted:',
          expect.objectContaining({
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            phone: '1234567890',
          })
        )
      },
      { timeout: 2000 }
    )

    expect(
      await screen.findByText('Form submitted successfully!')
    ).toBeInTheDocument()
    consoleSpy.mockRestore()
  })
})
