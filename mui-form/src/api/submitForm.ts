// src/api/submitForm.ts
import { ContactFormData } from '../schemas/contactSchema'

export interface SubmitResponse {
  success: boolean
  message?: string
  data?: { id: string }
  errors?: string[]
}

export async function submitForm(
  data: ContactFormData
): Promise<SubmitResponse> {
  try {
    // Replace this with your actual API endpoint
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    return {
      success: true,
      message: 'Form submitted successfully',
      data: result,
    }
  } catch (error) {
    console.error('Form submission error:', error)
    return {
      success: false,
      message: 'Failed to submit form',
      errors: [error instanceof Error ? error.message : 'Unknown error'],
    }
  }
}

// export async function submitFormMock(
//   _data: ContactFormData
// ): Promise<SubmitResponse> {
//   // Simulate API delay
//   await new Promise((resolve) => setTimeout(resolve, 1000))

//   // Simulate random success/failure for testing
//   const success = Math.random() > 0.1 // 90% success rate

//   if (success) {
//     return {
//       success: true,
//       message: 'Form submitted successfully',
//       data: { id: Math.random().toString(36).substr(2, 9) },
//     }
//   } else {
//     return {
//       success: false,
//       message: 'Server error occurred',
//       errors: ['Please try again later'],
//     }
//   }
// }
