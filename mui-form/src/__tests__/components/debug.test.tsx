import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ContactForm from '../../components/ContactForm'

describe('Debug Tests', () => {
  it('should test Other country validation', async () => {
    const user = userEvent.setup()
    render(<ContactForm />)

    const submitButton = screen.getByRole('button', { name: /submit/i })
    console.log(
      '1. Initial state - Submit disabled:',
      submitButton.hasAttribute('disabled')
    )

    // Fill basic required fields
    await user.type(screen.getByLabelText(/first name/i), 'John')
    await user.type(screen.getByLabelText(/last name/i), 'Doe')
    await user.type(screen.getByLabelText(/email/i), 'john@example.com')
    await user.type(screen.getByLabelText(/phone/i), '1234567890')

    console.log(
      '2. After basic fields - Submit disabled:',
      submitButton.hasAttribute('disabled')
    )

    // Add message
    await user.type(screen.getByLabelText(/message/i), 'Test message')
    console.log(
      '3. After message - Submit disabled:',
      submitButton.hasAttribute('disabled')
    )

    // Select "Other" country
    const countrySelect = screen.getByLabelText(/country/i)
    await user.click(countrySelect)
    await user.click(screen.getByText('Other'))

    console.log(
      '4. After selecting Other country - Submit disabled:',
      submitButton.hasAttribute('disabled')
    )

    // Check if there are any address fields that appear for "Other"
    const addressFields = document.querySelectorAll(
      'input[name*="address"], input[name*="Address"], input[name*="city"], input[name*="City"], input[name*="postal"], input[name*="zip"]'
    )
    console.log('Address fields found for Other:', addressFields.length)
    addressFields.forEach((field, index) => {
      console.log(
        `Field ${index}:`,
        field.getAttribute('name'),
        '- visible:',
        (field as HTMLElement).offsetParent !== null
      )
    })

    expect(true).toBe(true)
  })

  it('should find what makes submit button enabled', async () => {
    const user = userEvent.setup()
    render(<ContactForm />)

    const submitButton = screen.getByRole('button', { name: /submit/i })
    console.log(
      '1. Initial state - Submit disabled:',
      submitButton.hasAttribute('disabled')
    )

    // Fill basic required fields
    await user.type(screen.getByLabelText(/first name/i), 'John')
    await user.type(screen.getByLabelText(/last name/i), 'Doe')
    await user.type(screen.getByLabelText(/email/i), 'john@example.com')
    await user.type(screen.getByLabelText(/phone/i), '1234567890')

    console.log(
      '2. After basic fields - Submit disabled:',
      submitButton.hasAttribute('disabled')
    )

    // Add message
    await user.type(screen.getByLabelText(/message/i), 'Test message')
    console.log(
      '3. After message - Submit disabled:',
      submitButton.hasAttribute('disabled')
    )

    // Select country
    const countrySelect = screen.getByLabelText(/country/i)
    await user.click(countrySelect)
    await user.click(screen.getByText('Other'))

    console.log(
      '4. After selecting Other country - Submit disabled:',
      submitButton.hasAttribute('disabled')
    )

    // Try with USA to see if address fields are required
    await user.click(countrySelect)
    await user.click(screen.getByText('USA'))

    console.log(
      '5. After selecting USA - Submit disabled:',
      submitButton.hasAttribute('disabled')
    )

    // Fill USA address fields one by one and check each time
    const streetInput = screen.getByLabelText(/street address/i)
    await user.type(streetInput, '123 Main St')
    console.log(
      '6. After street address - Submit disabled:',
      submitButton.hasAttribute('disabled')
    )

    const cityInput = screen.getByLabelText(/city/i)
    await user.type(cityInput, 'Anytown')
    console.log(
      '7. After city - Submit disabled:',
      submitButton.hasAttribute('disabled')
    )

    const stateInput = screen.getByLabelText(/state/i)
    await user.type(stateInput, 'CA')
    console.log(
      '8. After state - Submit disabled:',
      submitButton.hasAttribute('disabled')
    )

    const zipInput = screen.getByLabelText(/zip code/i)
    await user.type(zipInput, '12345')
    console.log(
      '9. After zip code - Submit disabled:',
      submitButton.hasAttribute('disabled')
    )

    // Wait a bit for any async validation
    await new Promise((resolve) => setTimeout(resolve, 500))
    console.log(
      '10. After waiting 500ms - Submit disabled:',
      submitButton.hasAttribute('disabled')
    )

    // Check if newsletter affects it
    const newsletterCheckbox = screen.getByRole('checkbox', {
      name: /newsletter/i,
    })
    await user.click(newsletterCheckbox)
    console.log(
      '11. After checking newsletter - Submit disabled:',
      submitButton.hasAttribute('disabled')
    )

    expect(true).toBe(true)
  })

  it('should check form validation state', async () => {
    const user = userEvent.setup()
    render(<ContactForm />)

    // Fill everything and see current validation errors
    await user.type(screen.getByLabelText(/first name/i), 'John')
    await user.type(screen.getByLabelText(/last name/i), 'Doe')
    await user.type(screen.getByLabelText(/email/i), 'john@example.com')
    await user.type(screen.getByLabelText(/phone/i), '1234567890')
    await user.type(screen.getByLabelText(/message/i), 'Test message')

    const countrySelect = screen.getByLabelText(/country/i)
    await user.click(countrySelect)
    await user.click(screen.getByText('USA'))

    await user.type(screen.getByLabelText(/street address/i), '123 Main St')
    await user.type(screen.getByLabelText(/city/i), 'Anytown')
    await user.type(screen.getByLabelText(/state/i), 'CA')
    await user.type(screen.getByLabelText(/zip code/i), '12345')

    // Look for any validation error messages
    const errors = document.querySelectorAll(
      '.Mui-error, [role="alert"], .MuiFormHelperText-root'
    )
    console.log('Found error elements:', errors.length)
    errors.forEach((error, index) => {
      console.log(`Error ${index}:`, error.textContent)
    })

    expect(true).toBe(true)
  })
})
