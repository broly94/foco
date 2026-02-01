'use client';
import { useCurrentUser } from '@/hooks/use-auth';
import { useAuthStore } from '@/lib/store/auth-store';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function validateUserLogin() {
	const logout = useAuthStore((state) => state.logout);
	const router = useRouter();
	const [isInitialized, setIsInitialized] = useState<boolean>(false);
	const { isError } = useCurrentUser();

	useEffect(() => {
		setIsInitialized(true);
	}, []);

	useEffect(() => {
		if (isInitialized && isError) {
			console.log('Error de autenticación, cerrando sesión...');
			logout();
			router.push('/');
		}
	}, [isError, logout, router, isInitialized]);

	return null;
}
