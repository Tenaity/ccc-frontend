/**
 * Centralized API fetch utility with automatic API key injection
 */

const API_KEY = "123456";

/**
 * Wrapper around fetch that automatically adds x-api-key header
 * @param url - API endpoint URL
 * @param options - Standard fetch options
 * @returns Promise<Response>
 */
export function apiFetch(url: string, options?: RequestInit): Promise<Response> {
  const headers = new Headers(options?.headers);

  if (!headers.has("x-api-key")) {
    headers.set("x-api-key", API_KEY);
  }

  return fetch(url, { ...options, headers });
}

/**
 * Helper to parse JSON response safely
 * @param res - Response object
 * @returns Parsed JSON data
 * @throws Error with message from response body
 */
export async function safeJSON<T>(res: Response): Promise<T> {
  const text = await res.text();

  try {
    const json = text ? JSON.parse(text) : {};

    if (!res.ok) {
      throw new Error(json?.error || res.statusText || "Request failed");
    }

    return json as T;
  } catch (e) {
    if (!res.ok) {
      throw new Error(text.slice(0, 200) || res.statusText);
    }
    throw e;
  }
}
