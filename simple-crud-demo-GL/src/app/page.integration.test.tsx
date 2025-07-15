import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import Home from './page'
import { ThemeProvider, createTheme } from '@mui/material/styles'

// Mock the entire Supabase client module
const mockSupabase = {
  from: jest.fn(),
}

jest.mock('@supabase/auth-helpers-nextjs', () => ({
  createClientComponentClient: () => mockSupabase,
}))

const theme = createTheme()

describe('Home Page Integration Tests', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks()
  })

  it('should render the page with notes', async () => {
    // Arrange: Mock the initial data fetch
    mockSupabase.from.mockReturnValue({
      select: jest.fn().mockReturnValue({
        order: jest.fn().mockResolvedValue({
          data: [
            {
              id: '1',
              title: 'Test Note',
              content: 'This is a test note.',
              created_at: new Date().toISOString(),
            },
          ],
          error: null,
        }),
      }),
    })

    // Act
    render(
      <ThemeProvider theme={theme}>
        <Home />
      </ThemeProvider>
    )

    // Assert
    expect(await screen.findByText('Test Note')).toBeInTheDocument()
  })

  it('should create a new note and refetch the list', async () => {
    const user = userEvent.setup()
    // Arrange: Mock the initial empty list, the insert action, and the refetch
    mockSupabase.from
      .mockReturnValueOnce({
        // For initial getNotes
        select: jest.fn().mockReturnValue({
          order: jest.fn().mockResolvedValue({ data: [], error: null }),
        }),
      })
      .mockReturnValueOnce({
        // For handleCreateNote
        insert: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: { id: '2', title: 'New Note' },
              error: null,
            }),
          }),
        }),
      })
      .mockReturnValueOnce({
        // For the getNotes refetch
        select: jest.fn().mockReturnValue({
          order: jest.fn().mockResolvedValue({
            data: [
              {
                id: '2',
                title: 'New Note',
                content: 'A new note.',
                created_at: new Date().toISOString(),
              },
            ],
            error: null,
          }),
        }),
      })

    // Act
    render(
      <ThemeProvider theme={theme}>
        <Home />
      </ThemeProvider>
    )

    await user.type(screen.getByLabelText(/title/i), 'New Note')
    await user.type(screen.getByLabelText(/content/i), 'A new note.')
    await user.click(screen.getByRole('button', { name: /create note/i }))

    // Assert
    expect(await screen.findByText('New Note')).toBeInTheDocument()
  })

  it('should delete a note', async () => {
    const user = userEvent.setup()

    // Arrange: Mock initial fetch, the delete action, and the refetch
    mockSupabase.from
      .mockReturnValueOnce({
        // For initial getNotes
        select: jest.fn().mockReturnValue({
          order: jest.fn().mockResolvedValue({
            data: [
              {
                id: '1',
                title: 'Note To Delete',
                content: 'Content',
                created_at: new Date().toISOString(),
              },
            ],
            error: null,
          }),
        }),
      })
      .mockReturnValueOnce({
        // For handleDeleteNote
        delete: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({ error: null }),
        }),
      })
      .mockReturnValueOnce({
        // For getNotes refetch
        select: jest.fn().mockReturnValue({
          order: jest.fn().mockResolvedValue({ data: [], error: null }),
        }),
      })

    // Act
    render(
      <ThemeProvider theme={theme}>
        <Home />
      </ThemeProvider>
    )

    expect(await screen.findByText('Note To Delete')).toBeInTheDocument()
    await user.click(screen.getByLabelText(/delete/i))

    // Assert
    await waitFor(() => {
      expect(screen.queryByText('Note To Delete')).not.toBeInTheDocument()
    })
  })
})
