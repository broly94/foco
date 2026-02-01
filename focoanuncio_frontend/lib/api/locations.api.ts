import api from '@/lib/axios';
import { ApiError } from '@/types/api-error';
import axios from 'axios';

export class ApiLocation {
	static async getProvinces() {
		try {
			const response = await api.get(`/locations/provinces`);
			return response.data;
		} catch (error: any) {
			const errorMessage = error.response?.data?.message.split(' :: ')[1] || 'Error al registrar';
			throw new Error(errorMessage);
		}
	}

	static async getLocalities(provinceId: string, query: string) {
		try {
			const response = await api.get(`/locations/municipalities-by-province`, {
				params: {
					provinceId,
					query,
				},
			});
			return response.data;
		} catch (error: any) {
			const errorMessage = error.response?.data?.message.split(' :: ')[1] || 'Error al registrar';
			throw new Error(errorMessage);
		}
	}

	static async getAddressGeoRefWithText(location: string) {
		try {
			return await api.get(`/google-maps/get-location-text-plain?address=${encodeURIComponent(location)}`);
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

	static async getAddressGeoRefWithCoords({ lat, lng }: { lat: number; lng: number }) {
		try {
			const response = await api.post(`/google-maps/get-location-with-coords`, { lat, lng });
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
