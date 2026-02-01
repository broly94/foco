import api from '@/lib/axios';
import { ApiError } from '@/types/api-error';
import axios from 'axios';

export class ApiCategories {
	static async getCategories() {
		try {
			const response = await api.get('categories/all');
			return response.data;
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
