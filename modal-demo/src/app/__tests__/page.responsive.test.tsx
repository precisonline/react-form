import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import MultiWindowInterface from '../page'

describe('MultiWindowInterface', () => {
  it('should maximize and minimize the window', () => {
    render(<MultiWindowInterface />)
    const openButtons = screen.getAllByText('Open Window')
    fireEvent.click(openButtons[0])

    const maximizeButton = screen.getByLabelText('Maximize')
    fireEvent.click(maximizeButton)
    expect(screen.getByLabelText('Minimize')).toBeInTheDocument()

    const minimizeButton = screen.getByLabelText('Minimize')
    fireEvent.click(minimizeButton)
    expect(screen.getByLabelText('Maximize')).toBeInTheDocument()
  })
})
