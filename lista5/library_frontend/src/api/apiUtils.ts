import router from '@/router'
import { addToast } from '@/utils/toast'

class ApiError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ApiError';
    }
}

async function handleResponse<T>(response: Response, successMessage?: string): Promise<T> {
    if (!response.ok) {
        let errorMessage = `Action Failed. Status: ${response.status}`;
        try {
            const errorText = await response.text();
            
            // Check for known SQL constraints that typically occur during deletions (DataIntegrityViolationException)
            if (errorText.includes("ConstraintViolationException") || 
                errorText.includes("could not execute statement") || 
                errorText.includes("DataIntegrityViolationException")) {
                errorMessage = "Action failed: Cannot delete this resource because it is referenced by other items.";
            } 
            // If the message contains standard "Nie znaleziono", cleanly pass it along
            else if (errorText.trim().length > 0) {
                // Sometimes spring boot wraps things in JSON arbitrarily. Attempt to parse out 'message' if possible, otherwise use raw text.
                try {
                    const errorJson = JSON.parse(errorText);
                    errorMessage = errorJson.message || errorJson.error || errorText;
                } catch {
                    errorMessage = errorText; // Use the raw plain text from the backend
                }
            }
        } catch (e) {
            // failed to read text body
        }

        // If it's a 404 and it explicitly mentions an entity was not found in polish, do the redirect trap.
        if (response.status === 404 && errorMessage.includes('Nie znaleziono')) {
            addToast(errorMessage, 'error')
            router.push('/')
        } else {
            addToast(errorMessage, 'error')
        }
        
        throw new ApiError(errorMessage);
    }
    
    if (successMessage) {
        addToast(successMessage, 'success')
    }
    
    if (response.status === 204) {
        return {} as Promise<T>
    }
    
    // In some cases response might be empty entirely, but standard operations expect JSON.
    const text = await response.text();
    if (!text) {
        return {} as Promise<T>;
    }
    return JSON.parse(text) as Promise<T>;
}

export async function fetchGET<T>(url: string, successMessage?: string): Promise<T> {
    try {
        const response = await fetch(url)
        return await handleResponse<T>(response, successMessage)
    } catch (e: any) {
        if (e.name !== 'ApiError') {
            addToast('Network error: Cannot reach the server', 'error')
        }
        throw e;
    }
}

export async function fetchPOST<T>(url: string, data: any, successMessage?: string): Promise<T> {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        })
        return await handleResponse<T>(response, successMessage)
    } catch (e: any) {
        if (e.name !== 'ApiError') {
            addToast('Network error: Cannot reach the server', 'error')
        }
        throw e;
    }
}

export async function fetchPUT<T>(url: string, data: any, successMessage?: string): Promise<T> {
    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        })
        return await handleResponse<T>(response, successMessage)
    } catch (e: any) {
        if (e.name !== 'ApiError') {
             addToast('Network error: Cannot reach the server', 'error')
        }
        throw e;
    }
}

export async function fetchDELETE<T>(url: string, successMessage?: string): Promise<T> {
    try {
        const response = await fetch(url, {
            method: 'DELETE',
        })
        return await handleResponse<T>(response, successMessage)
    } catch (e: any) {
        if (e.name !== 'ApiError') {
            addToast('Network error: Cannot reach the server', 'error')
        }
        throw e;
    }
}