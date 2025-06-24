import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import EditNoteModal from './EditNoteModal'
import { ThemeProvider, createTheme } from '@mui/material/styles'

const theme = createTheme()

const mockNote = {
  id: '1',
  title: 'Test Title',
  content: 'Test Content',
  created_at: '2024-01-01',
}

describe('EditNoteModal Component', () => {
  it('renders the modal with title and content input fields', () => {
    render(
      <ThemeProvider theme={theme}>
        <EditNoteModal
          open={true}
          onClose={() => {}}
          note={mockNote}
          onUpdate={() => {}}
        />
      </ThemeProvider>
    )
    expect(screen.getByRole('textbox', { name: 'Title' })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'Content' })).toBeInTheDocument()
  })

  it('updates the title and content state when input fields change', () => {
    render(
      <ThemeProvider theme={theme}>
        <EditNoteModal
          open={true}
          onClose={() => {}}
          note={mockNote}
          onUpdate={() => {}}
        />
      </ThemeProvider>
    )
    const titleInput = screen.getByRole('textbox', { name: 'Title' })
    const contentInput = screen.getByRole('textbox', { name: 'Content' })

    fireEvent.change(titleInput, { target: { value: 'New Test Title' } })
    fireEvent.change(contentInput, { target: { value: 'New Test Content' } })

    expect((titleInput as HTMLInputElement).value).toBe('New Test Title')
    expect((contentInput as HTMLInputElement).value).toBe('New Test Content')
  })

  it('calls the onUpdate function with the correct note data when the form is submitted', () => {
    const onUpdate = jest.fn()
    render(
      <ThemeProvider theme={theme}>
        <EditNoteModal
          open={true}
          onClose={() => {}}
          note={mockNote}
          onUpdate={onUpdate}
        />
      </ThemeProvider>
    )
    const titleInput = screen.getByRole('textbox', { name: 'Title' })
    const contentInput = screen.getByRole('textbox', { name: 'Content' })
    const submitButton = screen.getByText('Update Note')

    fireEvent.change(titleInput, { target: { value: 'New Test Title' } })
    fireEvent.change(contentInput, { target: { value: 'New Test Content' } })
    fireEvent.click(submitButton)

    expect(onUpdate).toHaveBeenCalledTimes(1)
    expect(onUpdate).toHaveBeenCalledWith({
      ...mockNote,
      title: 'New Test Title',
      content: 'New Test Content',
    })
  })

  it('calls the onClose function when the modal is closed', () => {
    const onClose = jest.fn()
    render(
      <ThemeProvider theme={theme}>
        <EditNoteModal
          open={true}
          onClose={onClose}
          note={mockNote}
          onUpdate={() => {}}
        />
      </ThemeProvider>
    )
    const modal = screen.getByRole('presentation')
    fireEvent.keyDown(modal, { key: 'Escape', code: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
