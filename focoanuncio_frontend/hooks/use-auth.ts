'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
//import { api } from '@/lib/api';
import { useAuthStore } from '@/lib/store/auth-store';
import { ApiUser } from '@/lib/api/users.api';

// Clave global para la consulta del usuario actual
export const CURRENT_USER_QUERY_KEY = ['currentUser'];

// Hook para obtener el usuario actual
export function useCurrentUser() {
	const token = useAuthStore((state) => state.token);

	return useQuery({
		queryKey: CURRENT_USER_QUERY_KEY,
		queryFn: () => ApiUser.getCurrentUser(token),
		enabled: !!token,
	});
}

// Hook para iniciar sesión
export function useLogin() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ email, password }: { email: string; password: string }) => ApiUser.login(email, password),
		onSuccess: (data: any) => {
			const user = { id: data.id, name: data.name, email: data.email };
			useAuthStore.getState().setUser(user);
			useAuthStore.getState().setToken(data.token);
			queryClient.invalidateQueries({ queryKey: CURRENT_USER_QUERY_KEY });
		},
		onError: (error: any) => {
			throw new Error(error.message);
		},
	});
}

// Hook para registrarse
export function useRegister() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			name,
			lastName,
			phone,
			email,
			password,
		}: {
			name: string;
			lastName: string;
			phone: string;
			email: string;
			password: string;
		}) => ApiUser.register(name, lastName, phone, email, password),
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: CURRENT_USER_QUERY_KEY });
		},
		onError: (error: any) => {
			throw new Error(error.message);
		},
	});
}
