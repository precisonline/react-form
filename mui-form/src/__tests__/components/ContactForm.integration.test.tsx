import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ContactForm from '../../components/ContactForm'

// Mock the submit form API
const mockSubmitForm = jest.fn()
jest.mock('../../api/submitForm', () => ({
  submitForm: mockSubmitForm,
}))

describe('ContactForm Integration Tests', () => {
  beforeEach(() => {
    mockSubmitForm.mockClear()
  })

  describe('Form Rendering', () => {
    it('should render all form fields correctly', () => {
      render(<ContactForm />)

      // Check main form fields
      expect(screen.getByLabelText(/first name/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/last name/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/phone/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/country/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/message/i)).toBeInTheDocument()
      expect(
        screen.getByRole('checkbox', { name: /newsletter/i })
      ).toBeInTheDocument()

      // Check buttons
      expect(
        screen.getByRole('button', { name: /submit/i })
      ).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /reset/i })).toBeInTheDocument()
    })
  })

  describe('Form Validation Integration', () => {
    it('should have submit button disabled initially', () => {
      render(<ContactForm />)

      const submitButton = screen.getByRole('button', { name: /submit/i })
      expect(submitButton).toBeDisabled()
    })

    it('should validate email format and show errors', async () => {
      const user = userEvent.setup()
      render(<ContactForm />)

      const emailInput = screen.getByLabelText(/email/i)

      // Type invalid email
      await user.type(emailInput, 'invalid-email')
      await user.tab() // Trigger blur to show validation

      // Check for error message
      await waitFor(() => {
        expect(screen.getByText(/invalid email/i)).toBeInTheDocument()
      })
    })

    it('should validate UK postcode format', async () => {
      const user = userEvent.setup()
      render(<ContactForm />)

      // Select UK country (correct text is "UK", not "United Kingdom")
      const countrySelect = screen.getByLabelText(/country/i)
      await user.click(countrySelect)
      await user.click(screen.getByText('UK'))

      // UK postcode field should appear
      await waitFor(() => {
        expect(screen.getByLabelText(/postcode/i)).toBeInTheDocument()
      })

      const postcodeInput = screen.getByLabelText(/postcode/i)
      await user.type(postcodeInput, '123') // Invalid postcode
      await user.tab()

      // Check for postcode validation error
      await waitFor(() => {
        expect(screen.getByText(/invalid.*postcode/i)).toBeInTheDocument()
      })
    })

    it('should enable submit with USA when visible address fields are filled', async () => {
      const user = userEvent.setup()
      render(<ContactForm />)

      // Fill all basic required fields
      await user.type(screen.getByLabelText(/first name/i), 'John')
      await user.type(screen.getByLabelText(/last name/i), 'Doe')
      await user.type(screen.getByLabelText(/email/i), 'john.doe@example.com')
      await user.type(screen.getByLabelText(/phone/i), '1234567890')
      await user.type(screen.getByLabelText(/message/i), 'Test message')

      // Select USA country (which shows visible address fields)
      const countrySelect = screen.getByLabelText(/country/i)
      await user.click(countrySelect)
      await user.click(screen.getByText('USA'))

      // Submit should still be disabled until all USA address fields are filled
      expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled()

      // Fill USA address fields - submit only enables after ALL are filled
      await user.type(screen.getByLabelText(/street address/i), '123 Main St')
      expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled()

      await user.type(screen.getByLabelText(/city/i), 'Anytown')
      expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled()

      await user.type(screen.getByLabelText(/state/i), 'CA')
      expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled()

      await user.type(screen.getByLabelText(/zip code/i), '12345')

      // Now submit button should become enabled
      await waitFor(
        () => {
          const submitButton = screen.getByRole('button', { name: /submit/i })
          expect(submitButton).not.toBeDisabled()
        },
        { timeout: 1000 }
      )
    })

    it('should enable submit with "Other" country when general address fields are filled', async () => {
      const user = userEvent.setup()
      render(<ContactForm />)

      // Fill all basic required fields
      await user.type(screen.getByLabelText(/first name/i), 'John')
      await user.type(screen.getByLabelText(/last name/i), 'Doe')
      await user.type(screen.getByLabelText(/email/i), 'john.doe@example.com')
      await user.type(screen.getByLabelText(/phone/i), '1234567890')
      await user.type(screen.getByLabelText(/message/i), 'Test message')

      // Select "Other" country
      const countrySelect = screen.getByLabelText(/country/i)
      await user.click(countrySelect)
      await user.click(screen.getByText('Other'))

      // Submit should still be disabled
      expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled()

      // Fill the hidden general address fields that "Other" requires
      const addressLine1 = document.querySelector(
        'input[name="addressLine1"]'
      ) as HTMLInputElement
      const cityOrTown = document.querySelector(
        'input[name="cityOrTown"]'
      ) as HTMLInputElement

      // These fields exist but are hidden - fill them directly
      if (addressLine1) {
        await user.type(addressLine1, '123 Any Street')
        // Still disabled after addressLine1
        expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled()
      }

      if (cityOrTown) {
        await user.type(cityOrTown, 'Any City')
      }

      // Now submit button should become enabled
      await waitFor(
        () => {
          const submitButton = screen.getByRole('button', { name: /submit/i })
          expect(submitButton).not.toBeDisabled()
        },
        { timeout: 1000 }
      )
    })

    it('should successfully submit form with USA address', async () => {
      const user = userEvent.setup()

      // Create a spy on console.log to detect form submission
      const consoleLogSpy = jest
        .spyOn(console, 'log')
        .mockImplementation(() => {})

      render(<ContactForm />)

      // Fill all required fields including message
      await user.type(screen.getByLabelText(/first name/i), 'John')
      await user.type(screen.getByLabelText(/last name/i), 'Doe')
      await user.type(screen.getByLabelText(/email/i), 'john.doe@example.com')
      await user.type(screen.getByLabelText(/phone/i), '1234567890')
      await user.type(screen.getByLabelText(/message/i), 'Test message')

      // Select USA and fill complete address
      const countrySelect = screen.getByLabelText(/country/i)
      await user.click(countrySelect)
      await user.click(screen.getByText('USA'))

      await user.type(screen.getByLabelText(/street address/i), '123 Main St')
      await user.type(screen.getByLabelText(/city/i), 'Anytown')
      await user.type(screen.getByLabelText(/state/i), 'CA')
      await user.type(screen.getByLabelText(/zip code/i), '12345')

      // Wait for submit button to be enabled
      await waitFor(
        () => {
          const submitButton = screen.getByRole('button', { name: /submit/i })
          expect(submitButton).not.toBeDisabled()
        },
        { timeout: 1000 }
      )

      // Click submit
      const submitButton = screen.getByRole('button', { name: /submit/i })
      await user.click(submitButton)

      // Verify form submission occurred by checking console.log output
      await waitFor(() => {
        expect(consoleLogSpy).toHaveBeenCalledWith(
          'Form submitted:',
          expect.objectContaining({
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            phone: '1234567890',
            message: 'Test message',
            country: 'USA',
            usaStreetAddress: '123 Main St',
            usaCity: 'Anytown',
            usaState: 'CA',
            usaZipCode: '12345',
          })
        )
      })

      // Clean up
      consoleLogSpy.mockRestore()
    })
  })

  describe('Dynamic Field Behavior', () => {
    it('should show USA address fields when USA is selected', async () => {
      const user = userEvent.setup()
      render(<ContactForm />)

      const countrySelect = screen.getByLabelText(/country/i)
      await user.click(countrySelect)
      await user.click(screen.getByText('USA'))

      // USA-specific fields should appear
      await waitFor(() => {
        expect(screen.getByLabelText(/street address/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/city/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/state/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/zip code/i)).toBeInTheDocument()
      })
    })

    it('should show UK address fields when UK is selected', async () => {
      const user = userEvent.setup()
      render(<ContactForm />)

      const countrySelect = screen.getByLabelText(/country/i)
      await user.click(countrySelect)
      await user.click(screen.getByText('UK'))

      // UK-specific fields should appear
      await waitFor(() => {
        expect(screen.getByLabelText(/street address/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/town.*city/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/county/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/postcode/i)).toBeInTheDocument()
      })
    })

    it('should clear address fields when switching countries', async () => {
      const user = userEvent.setup()
      render(<ContactForm />)

      const countrySelect = screen.getByLabelText(/country/i)

      // First select USA and fill address
      await user.click(countrySelect)
      await user.click(screen.getByText('USA'))

      await waitFor(() => {
        expect(screen.getByLabelText(/zip code/i)).toBeInTheDocument()
      })

      const zipCodeInput = screen.getByLabelText(/zip code/i)
      await user.type(zipCodeInput, '12345')
      expect(zipCodeInput).toHaveValue('12345')

      // Switch to UK
      await user.click(countrySelect)
      await user.click(screen.getByText('UK'))

      // USA field should be gone, UK fields should appear
      expect(screen.queryByLabelText(/zip code/i)).not.toBeInTheDocument()

      await waitFor(() => {
        expect(screen.getByLabelText(/postcode/i)).toBeInTheDocument()
      })
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA labels and required field indicators', () => {
      render(<ContactForm />)

      // Note: MUI Box doesn't add role="form", so we check for the actual form element
      const formElement = document.querySelector('form')
      expect(formElement).toBeInTheDocument()

      // Check required field indicators
      const requiredFields = screen.getAllByText('*')
      expect(requiredFields.length).toBeGreaterThan(0)

      // Check that fields have proper labels
      expect(screen.getByLabelText(/first name/i)).toHaveAttribute('required')
      expect(screen.getByLabelText(/last name/i)).toHaveAttribute('required')
      expect(screen.getByLabelText(/email/i)).toHaveAttribute('required')
      expect(screen.getByLabelText(/phone/i)).toHaveAttribute('required')
    })

    it('should be keyboard navigable', async () => {
      const user = userEvent.setup()
      render(<ContactForm />)

      // Tab through form fields
      await user.tab()
      expect(screen.getByLabelText(/first name/i)).toHaveFocus()

      await user.tab()
      expect(screen.getByLabelText(/last name/i)).toHaveFocus()

      await user.tab()
      expect(screen.getByLabelText(/email/i)).toHaveFocus()
    })
  })

  describe('Form Reset', () => {
    it('should reset all form fields when reset button is clicked', async () => {
      const user = userEvent.setup()
      render(<ContactForm />)

      // Fill some fields
      const firstNameInput = screen.getByLabelText(/first name/i)
      const emailInput = screen.getByLabelText(/email/i)

      await user.type(firstNameInput, 'John')
      await user.type(emailInput, 'john@example.com')

      expect(firstNameInput).toHaveValue('John')
      expect(emailInput).toHaveValue('john@example.com')

      // Click reset button
      await user.click(screen.getByRole('button', { name: /reset/i }))

      // Fields should be cleared
      expect(firstNameInput).toHaveValue('')
      expect(emailInput).toHaveValue('')
    })
  })
})
