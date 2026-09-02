export const REST_URL = import.meta.env.VITE_IBEXA_REST_URL;

export const restFetch = async <T>(path: string, accept: string, init?: RequestInit): Promise<T> => {
    const headers = new Headers(init?.headers);

    headers.set('Accept', accept);

    const response = await fetch(`${REST_URL}${path}`, { ...init, headers });

    if (!response.ok) {
        throw new Error(`${path} responded with ${String(response.status)}`);
    }

    const payload: unknown = await response.json();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
    return payload as T;
};
