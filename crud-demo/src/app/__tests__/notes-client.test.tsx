import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import NotesClient from '../notes-client'
import * as actions from '../actions'
import { User } from '@supabase/auth-helpers-nextjs'

jest.mock('../actions', () => ({
  createNote: jest.fn(),
  deleteNote: jest.fn(),
  updateNote: jest.fn(),
}))

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
  }),
}))

const mockUser: User = {
  id: '123',
  app_metadata: {},
  user_metadata: {},
  aud: 'authenticated',
  created_at: new Date().toISOString(),
}

const mockNotes = [
  { id: 1, title: 'Note 1', content: 'Content 1', user_id: '123' },
  { id: 2, title: 'Note 2', content: 'Content 2', user_id: '123' },
]

describe('NotesClient', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders initial notes', () => {
    render(<NotesClient initialNotes={mockNotes} user={mockUser} />)
    expect(screen.getByText('Note 1')).toBeInTheDocument()
    expect(screen.getByText('Note 2')).toBeInTheDocument()
  })

  it('creates a new note', async () => {
    ;(actions.createNote as jest.Mock).mockResolvedValue({
      success: true,
      data: { id: 3, title: 'New Note', content: 'New Content' },
    })

    render(<NotesClient initialNotes={[]} user={mockUser} />)

    fireEvent.change(screen.getByLabelText('Title'), {
      target: { value: 'New Note' },
    })
    fireEvent.change(screen.getByLabelText('Content'), {
      target: { value: 'New Content' },
    })
    fireEvent.click(screen.getByText('Add Note'))

    await waitFor(() => {
      expect(actions.createNote).toHaveBeenCalled()
      expect(screen.getByText('New Note')).toBeInTheDocument()
    })
  })

  it('deletes a note', async () => {
    ;(actions.deleteNote as jest.Mock).mockResolvedValue({ success: true })

    render(<NotesClient initialNotes={mockNotes} user={mockUser} />)

    fireEvent.click(screen.getAllByText('Delete')[0])

    await waitFor(() => {
      expect(actions.deleteNote).toHaveBeenCalledWith(1)
      expect(screen.queryByText('Note 1')).not.toBeInTheDocument()
    })
  })

  it('updates a note', async () => {
    ;(actions.updateNote as jest.Mock).mockResolvedValue({
      success: true,
      data: { id: 1, title: 'Updated Note', content: 'Updated Content' },
    })

    render(<NotesClient initialNotes={mockNotes} user={mockUser} />)

    // Use the data-testid to find the correct edit button
    fireEvent.click(screen.getByTestId('edit-button-1'))

    // Wait for the modal to appear
    await waitFor(() => {
      expect(screen.getByText('Edit Note')).toBeInTheDocument()
    })

    // Now that the modal is open, find the input fields and the save button
    fireEvent.change(screen.getByDisplayValue('Note 1'), {
      target: { value: 'Updated Note' },
    })
    fireEvent.change(screen.getByDisplayValue('Content 1'), {
      target: { value: 'Updated Content' },
    })
    fireEvent.click(screen.getByText('Save Changes'))

    await waitFor(() => {
      expect(actions.updateNote).toHaveBeenCalledWith(
        1,
        'Updated Note',
        'Updated Content'
      )
      expect(screen.getByText('Updated Note')).toBeInTheDocument()
    })
  })
})
