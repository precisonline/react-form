import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import NoteList from './NoteList'
import { ThemeProvider, createTheme } from '@mui/material/styles'

const theme = createTheme()

const mockNotes = [
  {
    id: '1',
    title: 'Test Title 1',
    content: 'Test Content 1',
    created_at: '2024-01-01',
  },
  {
    id: '2',
    title: 'Test Title 2',
    content: 'Test Content 2',
    created_at: '2024-01-02',
  },
]

describe('NoteList Component', () => {
  it('renders the list of notes', () => {
    render(
      <ThemeProvider theme={theme}>
        <NoteList notes={mockNotes} onUpdate={() => {}} onDelete={() => {}} />
      </ThemeProvider>
    )
    expect(screen.getByText('Test Title 1')).toBeInTheDocument()
    expect(screen.getByText('Test Content 1')).toBeInTheDocument()
    expect(screen.getByText('Test Title 2')).toBeInTheDocument()
    expect(screen.getByText('Test Content 2')).toBeInTheDocument()
  })

  it('calls the onUpdate function when the edit button is clicked', () => {
    const onUpdate = jest.fn()
    render(
      <ThemeProvider theme={theme}>
        <NoteList notes={mockNotes} onUpdate={onUpdate} onDelete={() => {}} />
      </ThemeProvider>
    )
    const editButtons = screen.getAllByLabelText('edit')
    expect(editButtons.length).toBeGreaterThan(0)
    fireEvent.click(editButtons[0])
    expect(onUpdate).toHaveBeenCalledTimes(1)
    expect(onUpdate).toHaveBeenCalledWith(mockNotes[0])
  })

  it('calls the onDelete function when the delete button is clicked', () => {
    const onDelete = jest.fn()
    render(
      <ThemeProvider theme={theme}>
        <NoteList notes={mockNotes} onUpdate={() => {}} onDelete={onDelete} />
      </ThemeProvider>
    )
    const deleteButtons = screen.getAllByLabelText('delete')
    expect(deleteButtons.length).toBeGreaterThan(0)
    fireEvent.click(deleteButtons[0])
    expect(onDelete).toHaveBeenCalledTimes(1)
    expect(onDelete).toHaveBeenCalledWith(mockNotes[0].id)
  })
})
