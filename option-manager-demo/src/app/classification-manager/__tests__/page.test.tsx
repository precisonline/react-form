import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import ClassificationManagerPage from '../page'

describe('ClassificationManagerPage', () => {
  it('renders the page with the correct title', () => {
    render(<ClassificationManagerPage />)
    expect(screen.getByText('Classification Manager')).toBeInTheDocument()
  })
})
