'use client';

import type React from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';
import { ThemeProvider } from '@/components/theme-provider';

export function Providers({ children }: { children: React.ReactNode }) {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						staleTime: 0, //60 * 1000, // 1 minuto
						networkMode: 'always',
						refetchOnWindowFocus: true,
					},
				},
			})
	);

	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider attribute='class' defaultTheme='light' enableSystem>
				{children}
			</ThemeProvider>
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	);
}
