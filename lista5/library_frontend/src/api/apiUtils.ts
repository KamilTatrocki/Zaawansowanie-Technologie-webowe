import router from '@/router'
import { addToast } from '@/utils/toast'

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

function statusMessage(status: number): string {
  switch (status) {
    case 400:
      return 'Bad Request (400): Invalid input data.'
    case 401:
      return 'Unauthorized (401): Authentication required.'
    case 403:
      return 'Forbidden (403): You do not have permission.'
    case 404:
      return 'Not Found (404): The requested resource does not exist.'
    case 409:
      return 'Conflict (409): The action conflicts with the current state.'
    case 422:
      return 'Unprocessable Entity (422): Validation failed.'
    case 500:
      return 'Server Error (500): An internal error occurred.'
    case 503:
      return 'Service Unavailable (503): The server is temporarily unavailable.'
    default:
      return `Request Failed (${status}).`
  }
}

async function handleResponse<T>(response: Response, successMessage?: string): Promise<T> {
  if (!response.ok) {
    let errorMessage = statusMessage(response.status)

    try {
      const errorText = await response.text()
      if (
        errorText.includes('ConstraintViolationException') ||
        errorText.includes('could not execute statement') ||
        errorText.includes('DataIntegrityViolationException')
      ) {
        errorMessage =
          'Action failed (409): Cannot delete this resource because it is referenced by other items.'
      } else if (errorText.trim().length > 0) {
        try {
          const errorJson = JSON.parse(errorText)
          const detail = errorJson.message || errorJson.error
          if (detail) errorMessage = `${statusMessage(response.status)} ${detail}`
        } catch {
          // use default status message
        }
      }
    } catch {
      // failed to read body
    }

    if (response.status === 404) {
      addToast(errorMessage, 'error')
      router.push('/')
    } else {
      addToast(errorMessage, 'error')
    }

    throw new ApiError(errorMessage, response.status)
  }

  if (successMessage) {
    addToast(successMessage, 'success')
  }

  if (response.status === 204) {
    return {} as T
  }

  const text = await response.text()
  if (!text) {
    return {} as T
  }
  return JSON.parse(text) as T
}

export async function fetchGET<T>(url: string, successMessage?: string): Promise<T> {
  try {
    const response = await fetch(url)
    return await handleResponse<T>(response, successMessage)
  } catch (e: unknown) {
    if (e instanceof ApiError) throw e
    addToast('Network error: Cannot reach the server', 'error')
    throw e
  }
}

export async function fetchPOST<T>(url: string, data: unknown, successMessage?: string): Promise<T> {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    return await handleResponse<T>(response, successMessage)
  } catch (e: unknown) {
    if (e instanceof ApiError) throw e
    addToast('Network error: Cannot reach the server', 'error')
    throw e
  }
}

export async function fetchPUT<T>(url: string, data: unknown, successMessage?: string): Promise<T> {
  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    return await handleResponse<T>(response, successMessage)
  } catch (e: unknown) {
    if (e instanceof ApiError) throw e
    addToast('Network error: Cannot reach the server', 'error')
    throw e
  }
}

export async function fetchPATCH<T>(url: string, successMessage?: string): Promise<T> {
  try {
    const response = await fetch(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
    })
    return await handleResponse<T>(response, successMessage)
  } catch (e: unknown) {
    if (e instanceof ApiError) throw e
    addToast('Network error: Cannot reach the server', 'error')
    throw e
  }
}

export async function fetchDELETE<T>(url: string, successMessage?: string): Promise<T> {
  try {
    const response = await fetch(url, {
      method: 'DELETE',
    })
    return await handleResponse<T>(response, successMessage)
  } catch (e: unknown) {
    if (e instanceof ApiError) throw e
    addToast('Network error: Cannot reach the server', 'error')
    throw e
  }
}
