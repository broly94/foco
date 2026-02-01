import { createAddressUserSchema } from '@/app/profile/components/AdressForm';
import { ApiUser } from '@/lib/api/users.api';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

export const USER_QUERY_KEY = ['Users'];

export function useGetAdressUserById(userId: number, token: string | null) {
	return useQuery({
		queryKey: [...USER_QUERY_KEY, 'address_user'],
		queryFn: async () => {
			if (!userId || !token) throw new Error('Usuario o Token no valido');
			return await ApiUser.getAdressUserById(userId, token);
		},
		enabled: !!userId && !!token,
		retry: false,
	});
}

export function useCreateAddressUser() {
	return useMutation({
		mutationKey: ['create address user'],
		mutationFn: async ({ fullAddress, userId, token }: { fullAddress: createAddressUserSchema | null; userId: number; token: string }) => {
			return await ApiUser.createAddressUser(fullAddress, userId, token);
		},
		onError: (error: any) => {
			console.log('Error en useCreateAddressUser: ', error.message, error.status);
		},
		retry: false,
	});
}
