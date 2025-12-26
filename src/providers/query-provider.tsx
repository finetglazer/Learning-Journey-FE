"use client";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ReactNode, useState } from 'react';

export function QueryProvider({ children }: { children: ReactNode }) {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                // Data is fresh for 5 minutes
                staleTime: 5 * 60 * 1000,
                // Keep unused data in cache for 10 minutes
                gcTime: 10 * 60 * 1000,
                // Refetch when window regains focus
                refetchOnWindowFocus: true,
                // Retry failed requests 3 times
                retry: 3,
                // Don't refetch on mount if data is still fresh
                refetchOnMount: false,
            },
            mutations: {
                // Retry mutations once on failure
                retry: 1,
            },
        },
    }));

    return (
        <QueryClientProvider client={queryClient}>
            {children}
            {/* DevTools - only shows in development */}
            {process.env.NODE_ENV === 'development' && (
                <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-right" />
            )}
        </QueryClientProvider>
    );
}
