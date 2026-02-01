import api from '@/lib/axios';
import { ApiError } from '@/types/api-error';
import axios, { AxiosResponse } from 'axios';

export class ApiUser {
	static async login(email: string, password: string) {
		try {
			const resposne = await api.post('/auth/login', { email, password });
			return resposne.data;
		} catch (error: any) {
			console.log(error);
			const errorMessage = error.response?.data?.message.split(' :: ')[1] || 'Error al iniciar sesión';
			throw new Error(errorMessage);
		}
	}

	static async register(name: string, lastName: string, phone: string, email: string, password: string) {
		try {
			const response = await api.post('/auth/register', { name, lastName, phone, email, password });
			return response.data;
		} catch (error: any) {
			const errorMessage = error.response?.data?.message.split(' :: ')[1] || 'Error al registrar';
			throw new Error(errorMessage);
		}
	}

	static async getCurrentUser(token: string | null) {
		if (!token) {
			throw new Error('Token no proporcionado');
		}

		try {
			const response = await api.get('/auth/me', { headers: { Authorization: `Bearer ${token}` } });
			return response.data;
		} catch (error: any) {
			const errorMessage = error.response?.data?.message.split(' :: ')[1] || 'Error al obtener el usuario actual';
			throw new Error(errorMessage);
		}
	}

	//Terminar
	static async getAdressUserById(userId: number, token: string | null) {
		try {
			const response = await api.post(
				'/address-users',
				{ userId },
				{ headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } }
			);
			return response.data;
		} catch (error: any) {
			console.log(error);
			throw Error(error);
		}
	}

	static async createAddressUser(fullAddress: any, userId: number, token: string) {
		try {
			return await api.post(
				'address-users/create',
				{
					province: fullAddress?.province,
					state: fullAddress?.state,
					adress: fullAddress?.address,
					post_code: fullAddress?.postCode,
					lat: fullAddress?.lat,
					lon: fullAddress?.lon,
					user: userId,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
		} catch (error: any) {
			if (axios.isAxiosError(error)) {
				const apiError: ApiError = {
					message: error.response?.data?.message || 'Error en la solicitud',
					status: error.response?.status || 500,
					raw: error.response?.data,
				};
				throw apiError;
			}

			throw { message: error.message || 'Error desconocido', status: 500 } as ApiError;
		}
	}
}
