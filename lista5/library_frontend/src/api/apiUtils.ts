
export async function fetchGET<T>(url: string): Promise<T> {
    const response = await fetch(url)
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response.json() as Promise<T>
}

export async function fetchPOST<T>(url: string, data: any): Promise<T> {
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    })
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response.json() as Promise<T>
}

export async function fetchPUT<T>(url: string, data: any): Promise<T> {
    const response = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    })
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response.json() as Promise<T>
}

export async function fetchDELETE<T>(url: string): Promise<T> {
    const response = await fetch(url, {
        method: 'DELETE',
    })
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
    }

    if (response.status === 204) {
        return {} as Promise<T>
    }

    return response.json() as Promise<T>
}