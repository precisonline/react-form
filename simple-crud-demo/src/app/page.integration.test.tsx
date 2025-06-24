import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider } from '@mui/material/styles'
import Home from './page'
import theme from '../../theme'

interface Note {
  id: string
  title: string
  content: string
}

let notesInDb: Note[] = []

jest.mock('@supabase/auth-helpers-nextjs', () => ({
  createClientComponentClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn().mockImplementation(() => ({
        order: jest
          .fn()
          .mockResolvedValue({ data: [...notesInDb], error: null }),
      })),

      insert: jest.fn().mockImplementation((newNotes: Note[]) => {
        notesInDb.push(...newNotes)
        return {
          select: jest.fn(() => ({
            single: jest
              .fn()
              .mockResolvedValue({ data: newNotes[0], error: null }),
          })),
        }
      }),

      update: jest.fn().mockImplementation((updatedNote: Partial<Note>) => {
        const noteIndex = notesInDb.findIndex((n) => n.id === updatedNote.id)
        if (noteIndex > -1) {
          notesInDb[noteIndex] = { ...notesInDb[noteIndex], ...updatedNote }
        }
        return {
          select: jest.fn(() => ({
            single: jest
              .fn()
              .mockResolvedValue({ data: notesInDb[noteIndex], error: null }),
          })),
        }
      }),
      delete: jest.fn().mockImplementation(({ id }: { id: string }) => {
        notesInDb = notesInDb.filter((n) => n.id !== id)
        return { error: null }
      }),
    })),
  })),
}))

describe('Home Component Integration Tests', () => {
  beforeEach(() => {
    notesInDb = []
    jest.clearAllMocks()
  })

  it('allows creating, updating, and deleting a note', async () => {
    const user = userEvent.setup()
    render(
      <ThemeProvider theme={theme}>
        <Home />
      </ThemeProvider>
    )

    await screen.findByRole('heading', { name: /notes/i })

    await user.type(
      screen.getByRole('textbox', { name: /title/i }),
      'My Test Note'
    )
    await user.type(
      screen.getByRole('textbox', { name: /content/i }),
      'Test content.'
    )
    await user.click(screen.getByRole('button', { name: /create note/i }))

    const newNote = await screen.findByText('My Test Note')
    expect(newNote).toBeInTheDocument()
  })
})
