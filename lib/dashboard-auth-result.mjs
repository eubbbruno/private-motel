// Provider/network failures are availability errors, not invalid credentials.
export function verifiedUserResult({ data, error }) {
  if (!error) return data?.user || null;
  if (error.name === 'AuthRetryableFetchError' || !error.status || error.status === 429 || error.status >= 500) {
    throw new Error('Authentication provider unavailable');
  }
  return null;
}
