import { createNote, updateNote, deleteNote } from '../actions'
import { createServerClient } from '@supabase/ssr'
import { revalidatePath } from 'next/cache'

// --- MOCK SETUP ---
// Mock the individual modules
jest.mock('@supabase/ssr', () => ({
  createServerClient: jest.fn(),
}))

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}))

jest.mock('next/headers', () => ({
  cookies: jest.fn(() => ({
    get: jest.fn(),
  })),
}))

// Each chainable function uses .mockReturnThis() to return the mock object itself,
// allowing the next function in the chain to be called.
const mockSupabase = {
  auth: {
    getUser: jest.fn(),
  },
  from: jest.fn().mockReturnThis(),
  insert: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
  delete: jest.fn().mockReturnThis(),
  match: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  // .single() is the final method that returns the promise, so it's a standard mock function.
  single: jest.fn(),
}

// Make createServerClient return our corrected mock
;(createServerClient as jest.Mock).mockReturnValue(mockSupabase)

// --- TESTS ---
describe('Server Actions', () => {
  beforeEach(() => {
    // Clear all mocks before each test to ensure a clean slate
    jest.clearAllMocks()
  })

  describe('createNote', () => {
    it('should create a note successfully', async () => {
      const formData = new FormData()
      formData.append('title', 'Test Title')
      formData.append('content', 'Test Content')

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: { id: '123' } },
      })

      // Mock the final .single() call in the chain to return the expected data
      mockSupabase.single.mockResolvedValue({
        data: { id: 1, title: 'Test Title', content: 'Test Content' },
        error: null,
      })

      const result = await createNote(formData)

      expect(mockSupabase.from).toHaveBeenCalledWith('notes')
      expect(result.success).toBe(true)
      expect(result.data).toBeDefined()
      expect(revalidatePath).toHaveBeenCalledWith('/')
    })

    it('should return an error if user is not authenticated', async () => {
      const formData = new FormData()
      formData.append('title', 'Test Title')
      formData.append('content', 'Test Content')

      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null } })

      const result = await createNote(formData)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Not authenticated')
    })
  })

  describe('updateNote', () => {
    it('should update a note successfully', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: { id: '123' } },
      })

      // Mock the final .single() call in the chain
      mockSupabase.single.mockResolvedValue({
        data: { id: 1, title: 'Updated Title', content: 'Updated Content' },
        error: null,
      })

      const result = await updateNote(1, 'Updated Title', 'Updated Content')

      expect(mockSupabase.update).toHaveBeenCalledWith({
        title: 'Updated Title',
        content: 'Updated Content',
      })
      expect(result.success).toBe(true)
      expect(result.data).toBeDefined()
      expect(revalidatePath).toHaveBeenCalledWith('/')
    })
  })

  describe('deleteNote', () => {
    it('should delete a note successfully', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: { id: '123' } },
      })

      mockSupabase.match.mockResolvedValue({ error: null })

      const result = await deleteNote(1)

      expect(mockSupabase.delete).toHaveBeenCalled()
      expect(mockSupabase.match).toHaveBeenCalledWith({ id: 1, user_id: '123' })
      expect(result.success).toBe(true)
      expect(revalidatePath).toHaveBeenCalledWith('/')
    })
  })
})
