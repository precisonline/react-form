import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import NoteForm from './NoteForm'
import { ThemeProvider, createTheme } from '@mui/material/styles'

const theme = createTheme()

describe('NoteForm Component', () => {
  it('renders the form with title and content input fields', () => {
    render(
      <ThemeProvider theme={theme}>
        <NoteForm onCreate={() => {}} />
      </ThemeProvider>
    )
    expect(screen.getByRole('textbox', { name: 'Title' })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'Content' })).toBeInTheDocument()
  })

  it('updates the title and content state when input fields change', () => {
    render(
      <ThemeProvider theme={theme}>
        <NoteForm onCreate={() => {}} />
      </ThemeProvider>
    )
    const titleInput = screen.getByRole('textbox', { name: 'Title' })
    const contentInput = screen.getByRole('textbox', { name: 'Content' })

    fireEvent.change(titleInput, { target: { value: 'Test Title' } })
    fireEvent.change(contentInput, { target: { value: 'Test Content' } })

    expect((titleInput as HTMLInputElement).value).toBe('Test Title')
    expect((contentInput as HTMLInputElement).value).toBe('Test Content')
  })

  it('calls the onCreate function with the correct note data when the form is submitted', () => {
    const onCreate = jest.fn()
    render(
      <ThemeProvider theme={theme}>
        <NoteForm onCreate={onCreate} />
      </ThemeProvider>
    )
    const titleInput = screen.getByRole('textbox', { name: 'Title' })
    const contentInput = screen.getByRole('textbox', { name: 'Content' })
    const submitButton = screen.getByText('Create Note')

    fireEvent.change(titleInput, { target: { value: 'Test Title' } })
    fireEvent.change(contentInput, { target: { value: 'Test Content' } })
    fireEvent.click(submitButton)

    expect(onCreate).toHaveBeenCalledTimes(1)
    expect(onCreate).toHaveBeenCalledWith({
      title: 'Test Title',
      content: 'Test Content',
    })
  })

  it('clears the input fields after submitting the form', () => {
    const onCreate = jest.fn()
    render(
      <ThemeProvider theme={theme}>
        <NoteForm onCreate={onCreate} />
      </ThemeProvider>
    )
    const titleInput = screen.getByRole('textbox', { name: 'Title' })
    const contentInput = screen.getByRole('textbox', { name: 'Content' })
    const submitButton = screen.getByText('Create Note')

    fireEvent.change(titleInput, { target: { value: 'Test Title' } })
    fireEvent.change(contentInput, { target: { value: 'Test Content' } })
    fireEvent.click(submitButton)

    expect((titleInput as HTMLInputElement).value).toBe('')
    expect((contentInput as HTMLInputElement).value).toBe('')
  })
})
