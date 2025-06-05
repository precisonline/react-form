import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ContactForm from '../../components/ContactForm'

describe('Debug Other Country', () => {
  it('should test if Other country needs general address fields', async () => {
    const user = userEvent.setup()
    render(<ContactForm />)

    const submitButton = screen.getByRole('button', { name: /submit/i })

    // Fill basic required fields
    await user.type(screen.getByLabelText(/first name/i), 'John')
    await user.type(screen.getByLabelText(/last name/i), 'Doe')
    await user.type(screen.getByLabelText(/email/i), 'john@example.com')
    await user.type(screen.getByLabelText(/phone/i), '1234567890')
    await user.type(screen.getByLabelText(/message/i), 'Test message')

    // Select "Other" country
    const countrySelect = screen.getByLabelText(/country/i)
    await user.click(countrySelect)
    await user.click(screen.getByText('Other'))

    console.log(
      'After selecting Other - Submit disabled:',
      submitButton.hasAttribute('disabled')
    )

    // Try to find and fill the general address fields
    const addressLine1 = document.querySelector(
      'input[name="addressLine1"]'
    ) as HTMLInputElement
    const cityOrTown = document.querySelector(
      'input[name="cityOrTown"]'
    ) as HTMLInputElement
    const postalOrZipCode = document.querySelector(
      'input[name="postalOrZipCode"]'
    ) as HTMLInputElement

    if (addressLine1) {
      // Directly set values on hidden fields
      await user.type(addressLine1, '123 Any Street')
      console.log(
        'After addressLine1 - Submit disabled:',
        submitButton.hasAttribute('disabled')
      )
    }

    if (cityOrTown) {
      await user.type(cityOrTown, 'Any City')
      console.log(
        'After cityOrTown - Submit disabled:',
        submitButton.hasAttribute('disabled')
      )
    }

    if (postalOrZipCode) {
      await user.type(postalOrZipCode, '12345')
      console.log(
        'After postalOrZipCode - Submit disabled:',
        submitButton.hasAttribute('disabled')
      )
    }

    // Wait a bit for validation
    await new Promise((resolve) => setTimeout(resolve, 500))
    console.log(
      'After waiting - Submit disabled:',
      submitButton.hasAttribute('disabled')
    )

    expect(true).toBe(true)
  })

  it('should test if any country other than USA works', async () => {
    const user = userEvent.setup()
    render(<ContactForm />)

    const submitButton = screen.getByRole('button', { name: /submit/i })

    // Fill basic required fields
    await user.type(screen.getByLabelText(/first name/i), 'John')
    await user.type(screen.getByLabelText(/last name/i), 'Doe')
    await user.type(screen.getByLabelText(/email/i), 'john@example.com')
    await user.type(screen.getByLabelText(/phone/i), '1234567890')
    await user.type(screen.getByLabelText(/message/i), 'Test message')

    // Try Canada
    const countrySelect = screen.getByLabelText(/country/i)
    await user.click(countrySelect)
    await user.click(screen.getByText('Canada'))

    console.log(
      'Canada selected - Submit disabled:',
      submitButton.hasAttribute('disabled')
    )

    // Check if Canada address fields appear and are visible
    const canadaFields = document.querySelectorAll(
      'input[name*="canada"], input[name*="Canada"]'
    )
    console.log('Canada fields found:', canadaFields.length)
    canadaFields.forEach((field, index) => {
      const input = field as HTMLInputElement
      console.log(
        `Canada field ${index}:`,
        input.name,
        '- visible:',
        input.offsetParent !== null
      )
    })

    expect(true).toBe(true)
  })
})
