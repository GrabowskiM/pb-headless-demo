export const REST_URL = import.meta.env.VITE_IBEXA_REST_URL

export async function restFetch<T>(path: string, accept: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${REST_URL}${path}`, {
    ...init,
    headers: { Accept: accept, ...init?.headers },
  })

  if (!response.ok) {
    throw new Error(`${path} responded with ${response.status}`)
  }

  return response.json() as Promise<T>
}
