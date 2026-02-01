import type React from 'react';
import { Suspense } from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import '@radix-ui/themes/styles.css';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Providers } from '@/components/providers';
import ValidateUserLogin from '@/components/validate-user-login';
import { Theme } from '@radix-ui/themes';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Estrategias de Marketing',
	description: 'Plataforma para encontrar y crear estrategias de marketing para tu negocio',
	generator: 'v0.dev',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang='es' suppressHydrationWarning>
			<body className={inter.className} suppressHydrationWarning>
				{/* Revisar el validate */}
				<Providers>
					<Suspense fallback={<div>Cargando...</div>}>
						<ValidateUserLogin />
						<Theme scaling='110%'>
							<div className='flex flex-col min-h-screen'>
								<Header />
								<div className='flex min-h-full w-full justify-center'>{children}</div>
								<Footer />
							</div>
						</Theme>
					</Suspense>
				</Providers>
			</body>
		</html>
	);
}
