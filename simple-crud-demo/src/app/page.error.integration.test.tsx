import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider } from '@mui/material/styles'
import Home from './page'
import theme from '../../theme'

jest.mock('@supabase/auth-helpers-nextjs', () => ({
  createClientComponentClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn().mockImplementation(() => ({
        order: jest.fn().mockResolvedValue({ data: [], error: null }),
      })),

      insert: jest.fn().mockImplementation(() => ({
        select: jest.fn(() => ({
          single: jest.fn().mockResolvedValue({
            data: null,
            error: { message: 'Database error: Insert failed' },
          }),
        })),
      })),
    })),
  })),
}))

describe('Home Component Integration Tests - Error Handling', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('displays an error message when creating a note fails', async () => {
    const user = userEvent.setup()
    render(
      <ThemeProvider theme={theme}>
        <Home />
      </ThemeProvider>
    )

    await screen.findByRole('heading', { name: /notes/i })

    await user.type(
      screen.getByRole('textbox', { name: /title/i }),
      'Error Title'
    )
    await user.type(
      screen.getByRole('textbox', { name: /content/i }),
      'Error content'
    )
    await user.click(screen.getByRole('button', { name: /create note/i }))

    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent(/database error: insert failed/i)

    expect(screen.queryByText('Error Title')).not.toBeInTheDocument()
  })
})
