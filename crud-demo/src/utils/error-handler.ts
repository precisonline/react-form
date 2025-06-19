import { v4 as uuidv4 } from 'uuid'

type ErrorWithCode = Error & { code?: string }

export function handleActionError(error: unknown, message: string) {
  const errorId = uuidv4()
  let errorMessage = 'An unexpected error occurred.'
  let errorCode: string | undefined

  if (error instanceof Error) {
    errorMessage = error.message
    if ((error as ErrorWithCode).code) {
      errorCode = (error as ErrorWithCode).code
    }
  }

  console.error(`❌ ${message} (Error ID: ${errorId}):`, errorMessage, error)

  // Capture error with Sentry or other error tracking tool (example)
  // Sentry.captureException(error, { extra: { errorId, message } });

  return {
    success: false,
    error: `${message} (Error ID: ${errorId})`,
    errorCode,
  }
}
