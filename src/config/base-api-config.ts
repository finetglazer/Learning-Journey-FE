export const baseApiConfig = (baseApiUrl?: string) => ({
    baseURL: baseApiUrl || process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080",
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        // 'X-User-Id' is handled in the interceptor now, so we don't need it here
    },
});