import { render, screen, act, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import AuthPage from '@/app/auth/page'
import { SupabaseClient } from '@supabase/supabase-js'

// --- Mocks Setup ---

// 1. Mock 'next/navigation'
const mockRouterPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockRouterPush,
  }),
}))

// 2. Mock '@supabase/auth-ui-react' to avoid rendering the actual UI
jest.mock('@supabase/auth-ui-react', () => ({
  Auth: () => <div data-testid='supabase-auth-ui'></div>,
}))

// 3. Mock the Supabase client and its auth methods
const mockUnsubscribe = jest.fn()
let onAuthStateChangeCallback: (event: string, session: object | null) => void

const mockSupabaseClient = {
  auth: {
    onAuthStateChange: jest.fn((callback) => {
      // Store the callback so we can trigger it manually in our tests
      onAuthStateChangeCallback = callback
      return {
        data: { subscription: { unsubscribe: mockUnsubscribe } },
      }
    }),
  },
}

jest.mock('@/utils/supabase/client', () => ({
  createClient: () => mockSupabaseClient as unknown as SupabaseClient,
}))

// --- Test Suite ---

describe('AuthPage Component', () => {
  // Reset mocks before each test to ensure isolation
  beforeEach(() => {
    jest.clearAllMocks()
  })

  // Test 1: Initial Render (Unauthenticated State)
  it('should render the sign-in form when the user is not authenticated', () => {
    render(<AuthPage />)

    // Check for the main heading
    expect(
      screen.getByRole('heading', { name: /Sign In \/ Sign Up/i })
    ).toBeInTheDocument()

    // Check that the mocked Supabase Auth UI component is rendered
    expect(screen.getByTestId('supabase-auth-ui')).toBeInTheDocument()

    // Ensure the loading state UI is not present
    expect(
      screen.queryByRole('heading', { name: /Setting up your account.../i })
    ).not.toBeInTheDocument()
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
  })

  // Test 2: Handling the 'SIGNED_IN' Event
  it('should display the loading state and redirect upon receiving SIGNED_IN event', async () => {
    render(<AuthPage />)

    // Ensure we start in the unauthenticated state
    expect(
      screen.getByRole('heading', { name: /Sign In \/ Sign Up/i })
    ).toBeInTheDocument()

    // Simulate the 'SIGNED_IN' event from Supabase auth
    act(() => {
      onAuthStateChangeCallback('SIGNED_IN', {
        user: { id: '123' },
        access_token: 'abc',
      })
    })

    // Assert that the UI transitions to the loading state
    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: /Setting up your account.../i })
      ).toBeInTheDocument()
    })
    expect(screen.getByRole('progressbar')).toBeInTheDocument()

    // Assert that the sign-in form is no longer visible
    expect(
      screen.queryByRole('heading', { name: /Sign In \/ Sign Up/i })
    ).not.toBeInTheDocument()
    expect(screen.queryByTestId('supabase-auth-ui')).not.toBeInTheDocument()

    // Assert that the router was called to redirect the user
    await waitFor(() => {
      expect(mockRouterPush).toHaveBeenCalledWith('/')
      expect(mockRouterPush).toHaveBeenCalledTimes(1)
    })
  })

  // Test 3: Handling Other Authentication Events
  it('should not change state for auth events other than SIGNED_IN', () => {
    render(<AuthPage />)

    // Simulate a different auth event (e.g., 'SIGNED_OUT')
    act(() => {
      onAuthStateChangeCallback('SIGNED_OUT', null)
    })

    // Assert that the UI remains in the initial, unauthenticated state
    expect(
      screen.getByRole('heading', { name: /Sign In \/ Sign Up/i })
    ).toBeInTheDocument()
    expect(screen.getByTestId('supabase-auth-ui')).toBeInTheDocument()
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()

    // Assert that no redirect was triggered
    expect(mockRouterPush).not.toHaveBeenCalled()
  })

  // Test 4: Handling 'SIGNED_IN' Event without a session
  it('should not change state if SIGNED_IN event has a null session', () => {
    render(<AuthPage />)

    // Simulate a 'SIGNED_IN' event but with a null session, which shouldn't happen but is good to test
    act(() => {
      onAuthStateChangeCallback('SIGNED_IN', null)
    })

    // Assert that the UI remains in the initial state
    expect(
      screen.getByRole('heading', { name: /Sign In \/ Sign Up/i })
    ).toBeInTheDocument()
    expect(mockRouterPush).not.toHaveBeenCalled()
  })

  // Test 5: Cleanup on Unmount
  it('should call the unsubscribe function when the component unmounts', () => {
    // Render the component
    const { unmount } = render(<AuthPage />)

    // Ensure the unsubscribe function has not been called yet
    expect(mockUnsubscribe).not.toHaveBeenCalled()

    // Unmount the component, which should trigger the useEffect cleanup function
    unmount()

    // Assert that the subscription's unsubscribe method was called exactly once
    expect(mockUnsubscribe).toHaveBeenCalledTimes(1)
  })
})
