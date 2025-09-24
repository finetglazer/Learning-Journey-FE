export const baseApiConfig = (baseApiUrl?: string) => ({
    baseURL: baseApiUrl,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});