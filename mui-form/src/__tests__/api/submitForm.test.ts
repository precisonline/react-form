import {
  submitForm,
  ContactFormData,
  SubmitResponse,
} from '../../api/submitForm'

// Mock the global fetch function before all tests.
// We use jest.fn() to create a mock function that we can control.
global.fetch = jest.fn()

// Mock data to be used consistently across tests
const mockContactData: ContactFormData = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  message: 'This is a test message.',
}

describe('submitForm', () => {
  // Before each test, clear all previous mock data to ensure test isolation.
  beforeEach(() => {
    ;(fetch as jest.Mock).mockClear()
    // We also spy on console.error to ensure it's called on failure,
    // but we mock its implementation to keep the test output clean.
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  // After all tests are done, restore the original console.error implementation.
  afterAll(() => {
    ;(console.error as jest.Mock).mockRestore()
  })

  // Test case for a successful form submission (e.g., a 200 OK response)
  it('should return a success response when the fetch call is successful', async () => {
    // Arrange: Configure the mock fetch to return a successful response.
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: '12345-abc' }), // This is the mock JSON body from the server.
    })

    // Act: Call the function with our mock data.
    const result = await submitForm(mockContactData)

    // Assert: Check that everything behaved as expected.
    // 1. Ensure fetch was called with the correct URL, method, headers, and body.
    expect(fetch).toHaveBeenCalledTimes(1)
    expect(fetch).toHaveBeenCalledWith('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mockContactData),
    })

    // 2. Ensure the function returns the expected success object.
    const expectedResponse: SubmitResponse = {
      success: true,
      message: 'Form submitted successfully',
      data: { id: '12345-abc' },
    }
    expect(result).toEqual(expectedResponse)
  })

  // Test case for a server-side error (e.g., 500 Internal Server Error)
  it('should return a failure response when the server returns an error', async () => {
    // Arrange: Configure mock fetch to simulate a server error.
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: false, // The key indicator of an HTTP error
      status: 500,
    })

    // Act: Call the function.
    const result = await submitForm(mockContactData)

    // Assert: Check that the function returns the correct failure object.
    const expectedResponse: SubmitResponse = {
      success: false,
      message: 'Failed to submit form',
      errors: ['HTTP error! status: 500'],
    }
    expect(result).toEqual(expectedResponse)
    // Also ensure the error was logged to the console.
    expect(console.error).toHaveBeenCalled()
  })

  // Test case for a network failure (e.g., user is offline, DNS error).
  it('should return a failure response when the fetch call fails due to a network error', async () => {
    // Arrange: Configure mock fetch to reject the promise, simulating a network failure.
    const networkError = new Error('Network request failed')
    ;(fetch as jest.Mock).mockRejectedValueOnce(networkError)

    // Act: Call the function.
    const result = await submitForm(mockContactData)

    // Assert: Check that the function returns the correct failure object.
    const expectedResponse: SubmitResponse = {
      success: false,
      message: 'Failed to submit form',
      errors: [networkError.message],
    }
    expect(result).toEqual(expectedResponse)
    // Ensure the specific network error was logged.
    expect(console.error).toHaveBeenCalledWith(
      'Form submission error:',
      networkError
    )
  })

  // Test case for an unexpected, non-Error object being thrown.
  it('should handle non-Error exceptions gracefully', async () => {
    // Arrange: Configure mock fetch to reject with a string instead of an Error object.
    const unknownError = 'Something went very wrong'
    ;(fetch as jest.Mock).mockRejectedValueOnce(unknownError)

    // Act: Call the function.
    const result = await submitForm(mockContactData)

    // Assert: Check that the function returns a generic error message.
    const expectedResponse: SubmitResponse = {
      success: false,
      message: 'Failed to submit form',
      errors: ['Unknown error'],
    }
    expect(result).toEqual(expectedResponse)
    expect(console.error).toHaveBeenCalledWith(
      'Form submission error:',
      unknownError
    )
  })
})
