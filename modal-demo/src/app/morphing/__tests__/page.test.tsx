import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import CleanMorphingModal from '../page'

describe('CleanMorphingModal', () => {
  it('renders the main interface', () => {
    render(<CleanMorphingModal />)
    expect(screen.getByText('Modal')).toBeInTheDocument()
  })

  it('opens the modal when the "Launch Modal" button is clicked', () => {
    render(<CleanMorphingModal />)
    const launchButton = screen.getByText('Launch Modal')
    fireEvent.click(launchButton)
    expect(screen.getByText('Analytics Dashboard')).toBeInTheDocument()
  })

  it('closes the modal when the close button is clicked', () => {
    render(<CleanMorphingModal />)
    const launchButton = screen.getByText('Launch Modal')
    fireEvent.click(launchButton)
    expect(screen.getByText('Analytics Dashboard')).toBeInTheDocument()
    const closeButton = screen.getAllByRole('button')[1]
    fireEvent.click(closeButton)
    expect(screen.queryByText('Analytics Dashboard')).not.toBeInTheDocument()
  })
})
