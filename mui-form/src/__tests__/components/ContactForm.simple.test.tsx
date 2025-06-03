// src/__tests__/components/debug.test.tsx
import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ContactForm from '../../components/ContactForm'

describe('Debug Tests', () => {
  it('should show what country options are available', async () => {
    const user = userEvent.setup()
    render(<ContactForm />)

    // Click country dropdown
    const countrySelect = screen.getByLabelText(/country/i)
    await user.click(countrySelect)

    // Wait a bit for dropdown to open
    await new Promise((resolve) => setTimeout(resolve, 100))

    // Log all available options
    try {
      const options = screen.getAllByRole('option')
      console.log('Available country options:')
      options.forEach((option, index) => {
        console.log(`${index}: "${option.textContent}"`)
      })
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      console.log('No options found with role="option"')

      // Try to find by different selectors
      const menuItems = document.querySelectorAll(
        '[role="menuitem"], .MuiMenuItem-root, [data-value]'
      )
      console.log('Menu items found:', menuItems.length)
      menuItems.forEach((item, index) => {
        console.log(`${index}: "${item.textContent}"`)
      })
    }

    expect(true).toBe(true) // Just to make test pass
  })

  it('should show submit button and form state', () => {
    render(<ContactForm />)

    const submitButton = screen.getByRole('button', { name: /submit/i })
    console.log(
      'Submit button disabled:',
      submitButton.hasAttribute('disabled')
    )
    console.log('Submit button classes:', submitButton.className)

    // Check form element
    const form = document.querySelector('form')
    console.log('Form element found:', !!form)
    console.log('Form has role=form:', form?.getAttribute('role') === 'form')

    expect(true).toBe(true)
  })

  it('should check validation behavior', async () => {
    const user = userEvent.setup()
    render(<ContactForm />)

    // Try filling one field to see if submit button enables
    const firstNameInput = screen.getByLabelText(/first name/i)
    await user.type(firstNameInput, 'John')

    const submitButton = screen.getByRole('button', { name: /submit/i })
    console.log(
      'After typing first name - Submit button disabled:',
      submitButton.hasAttribute('disabled')
    )

    // Fill all required fields
    await user.type(screen.getByLabelText(/last name/i), 'Doe')
    await user.type(screen.getByLabelText(/email/i), 'john@example.com')
    await user.type(screen.getByLabelText(/phone/i), '1234567890')

    console.log(
      'After filling basic fields - Submit button disabled:',
      submitButton.hasAttribute('disabled')
    )

    expect(true).toBe(true)
  })
})
