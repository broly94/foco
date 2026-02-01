'use client';

import { useQuery, useMutation } from '@tanstack/react-query';
import { ApiLocation } from '@/lib/api/locations.api';
import axios from 'axios';

interface LocationSuggestion {
	province: string;
	locality: string;
	id: string;
}

enum Countries {
	Argentina = 'Argentina',
}

interface Provinces {
	province_id: string;
	name: string;
	country: Countries;
}

// Función para obtener sugerencias de ubicación desde GeoRef Argentina
const fetchLocationSuggestions = async (query: string): Promise<LocationSuggestion[]> => {
	if (!query || query.length < 3) return []; // GeoRef funciona mejor con mas caracteres

	try {
		// Llamamos directamente a la API de GeoRef (es pública y no requiere key)
		const response = await axios.get(`https://apis.datos.gob.ar/georef/api/localidades`, {
			params: {
				nombre: query,
				max: 10,
				orden: 'nombre'
			}
		});

		const data = response.data;

		if (!data.localidades) return [];

		return data.localidades.map((loc: any) => ({
			province: loc.provincia.nombre,
			locality: loc.nombre,
			id: loc.id,
		}));
	} catch (error) {
		console.error('Error fetching GeoRef location suggestions:', error);
		return [];
	}
};

// Hook para obtener sugerencias de ubicación
export function useLocationSuggestions(query: string) {
	return useQuery({
		queryKey: ['locationSuggestions', query],
		queryFn: () => fetchLocationSuggestions(query),
		enabled: query.length >= 2,
	});
}

export function useProvinces() {
	return useQuery({
		queryKey: ['provinces'],
		queryFn: async () => {
			const response = await ApiLocation.getProvinces();
			return response;
		},
		enabled: true,
		staleTime: 1000 * 60 * 60, // 1 hour
	});
}

export function useLocalities(provinceId: string, query: string) {
	return useQuery({
		queryKey: ['localities', provinceId, 'query', query],
		queryFn: async () => {
			const response = await ApiLocation.getLocalities(provinceId, query);
			return response;
		},
		enabled: query?.length >= 2 && !!provinceId,
		staleTime: 1000 * 60 * 60, // 1 hour
	});
}

//'https://apis.datos.gob.ar/georef/api/municipios?nombre=la%20plata&provincia=buenos%20aires&campos=id,nombre,provincia,centroide&max=1'

export function getAddressGeoRefWithText() {
	return useMutation({
		mutationKey: ['georef-with-text'],
		mutationFn: async ({ location }: { location: string }) => await ApiLocation.getAddressGeoRefWithText(location),
		onError(error: any) {
			console.log('Error en useAdressGeoRef: ', error.message, error.status);
		},
		retry: false,
	});
}

export function getAddressGeoRefWithCoords() {
	return useMutation({
		mutationKey: ['georef-with-cords'],
		mutationFn: async ({ lat, lng }: { lat: number; lng: number }) => await ApiLocation.getAddressGeoRefWithCoords({ lat, lng }),
	});
}
