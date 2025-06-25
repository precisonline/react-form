import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import MultiWindowInterface from '../page'

describe('MultiWindowInterface', () => {
  it('renders the main interface', () => {
    render(<MultiWindowInterface />)
    expect(screen.getByText('Multi-Window Interface')).toBeInTheDocument()
  })

  it('opens a window when an "Open Window" button is clicked', () => {
    render(<MultiWindowInterface />)
    const openButtons = screen.getAllByText('Open Window')
    fireEvent.click(openButtons[0])
    // The dashboard title is in a heading, and also in the window itself
    expect(screen.getAllByText('Analytics Dashboard').length).toBe(2)
  })

  it('closes a window when the close button is clicked', () => {
    render(<MultiWindowInterface />)
    const openButtons = screen.getAllByText('Open Window')
    fireEvent.click(openButtons[0])
    expect(screen.getAllByText('Analytics Dashboard').length).toBe(2)
    const closeButtons = screen.getAllByRole('button')
    // The close button is the last button on the page
    fireEvent.click(closeButtons[closeButtons.length - 1])
    expect(screen.getAllByText('Analytics Dashboard').length).toBe(1)
  })
})
