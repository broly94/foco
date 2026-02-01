import { toast } from '@/hooks/use-toast';
import type { MarketingStrategy, Review, Reservation } from './types';
import axios, { Axios, AxiosPromise } from 'axios';
import { showToast } from 'nextjs-toast-notify';
import { Split } from 'lucide-react';

// This is a mock API client that would be replaced with actual API calls in a real app
export const api: any = {
	// Strategies
	getStrategies: async (params?: Record<string, string>) => {
		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 500));

		// Return mock data
		return {
			data: Array.from({ length: 10 }).map((_, i) => ({
				id: i + 1,
				title: `Estrategia de Marketing #${i + 1}`,
				description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
				businessHours: {
					open: '09:00',
					close: '18:00',
				},
				location: {
					address: 'Av. Corrientes 1234, Buenos Aires, Argentina',
					coordinates: {
						lat: -34.6037 + (Math.random() - 0.5) * 0.1,
						lon: -58.3816 + (Math.random() - 0.5) * 0.1,
					},
				},
				profileImage: `/placeholder.svg?height=64&width=64&text=Profile+${i + 1}`,
				bannerImage: `/placeholder.svg?height=200&width=400&text=Banner+${i + 1}`,
				socialMedia: {
					facebook: 'https://facebook.com',
					instagram: 'https://instagram.com',
					twitter: 'https://twitter.com',
					linkedin: 'https://linkedin.com',
				},
				phone: '+54 11 1234-5678',
				keywords: Array.from({ length: 5 }).map((_, j) => `Keyword ${i}-${j}`),
				website: 'https://ejemplo.com',
				address: 'Av. Corrientes 1234, Buenos Aires, Argentina',
				rating: 4 + Math.random(),
				reviews: [],
				followers: Math.floor(Math.random() * 1000),
				category: `Categoría ${(i % 5) + 1}`,
			})),
			total: 100,
			page: 1,
			limit: 10,
		};
	},

	getStrategyById: async (id: string) => {
		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 500));

		// Return mock data
		return {
			id: Number.parseInt(id),
			title: `Estrategia de Marketing #${id}`,
			description:
				'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
			businessHours: {
				open: '09:00',
				close: '18:00',
			},
			location: {
				address: 'Av. Corrientes 1234, Buenos Aires, Argentina',
				coordinates: {
					lat: -34.6037,
					lon: -58.3816,
				},
			},
			profileImage: `/placeholder.svg?height=64&width=64&text=Profile+${id}`,
			bannerImage: `/placeholder.svg?height=400&width=1200&text=Banner+${id}`,
			socialMedia: {
				facebook: 'https://facebook.com',
				instagram: 'https://instagram.com',
				twitter: 'https://twitter.com',
				linkedin: 'https://linkedin.com',
			},
			phone: '+54 11 1234-5678',
			keywords: Array.from({ length: 10 }).map((_, i) => `Keyword ${i + 1}`),
			website: 'https://ejemplo.com',
			address: 'Av. Corrientes 1234, Buenos Aires, Argentina',
			rating: 4.8,
			reviews: Array.from({ length: 5 }).map((_, i) => ({
				id: i + 1,
				userId: i + 100,
				userName: `Usuario #${i + 1}`,
				rating: 5 - (i % 2),
				comment: 'Excelente estrategia de marketing. Nos ayudó a aumentar nuestras ventas en un 30% en el primer mes. Recomendado.',
				date: new Date(Date.now() - i * 86400000).toISOString(),
			})),
			followers: 1234,
			category: 'Marketing Digital',
		};
	},

	createStrategy: async (data: Partial<MarketingStrategy>) => {
		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 1000));

		return {
			id: Math.floor(Math.random() * 1000),
			...data,
		};
	},

	updateStrategy: async (id: number, data: Partial<MarketingStrategy>) => {
		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 1000));

		return {
			id,
			...data,
		};
	},

	deleteStrategy: async (id: number) => {
		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 1000));

		return { success: true };
	},

	// Reviews
	createReview: async (strategyId: number, data: Partial<Review>) => {
		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 1000));

		return {
			id: Math.floor(Math.random() * 1000),
			strategyId,
			...data,
			date: new Date().toISOString(),
		};
	},

	// Reservations
	getReservations: async (strategyId: string, filters?: Record<string, string>) => {
		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 800));

		// Generate random reservations
		return Array.from({ length: 5 }).map((_, i) => ({
			id: `res-${strategyId}-${i}`,
			strategyId,
			userId: `user-${100 + i}`,
			date: filters?.startDate
				? new Date(new Date(filters.startDate).getTime() + i * 86400000).toISOString().split('T')[0]
				: new Date().toISOString().split('T')[0],
			time: ['09:00', '10:00', '11:00', '15:00', '16:00'][i],
			name: `Usuario Reserva #${i + 1}`,
			email: `usuario${i + 1}@ejemplo.com`,
			phone: `+54 11 ${1234 + i}-${5678 + i}`,
			status: 'confirmed',
			createdAt: new Date(Date.now() - i * 3600000).toISOString(),
		}));
	},

	getReservationById: async (reservationId: string) => {
		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 500));

		const [_, strategyId, index] = reservationId.split('-');

		return {
			id: reservationId,
			strategyId,
			userId: `user-${100 + Number(index)}`,
			date: new Date().toISOString().split('T')[0],
			time: ['09:00', '10:00', '11:00', '15:00', '16:00'][Number(index)],
			name: `Usuario Reserva #${Number(index) + 1}`,
			email: `usuario${Number(index) + 1}@ejemplo.com`,
			phone: `+54 11 ${1234 + Number(index)}-${5678 + Number(index)}`,
			status: 'confirmed',
			createdAt: new Date(Date.now() - Number(index) * 3600000).toISOString(),
		};
	},

	createReservation: async (data: Partial<Reservation>) => {
		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 1200));

		return {
			id: `res-${data.strategyId}-${Math.floor(Math.random() * 1000)}`,
			...data,
			status: 'confirmed',
			createdAt: new Date().toISOString(),
		};
	},

	cancelReservation: async (reservationId: string) => {
		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 800));

		const [_, strategyId, index] = reservationId.split('-');

		return {
			id: reservationId,
			strategyId,
			status: 'cancelled',
		};
	},

	getUserReservations: async () => {
		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 800));

		// Generate random user reservations
		return Array.from({ length: 3 }).map((_, i) => ({
			id: `res-${i + 1}-${i}`,
			strategyId: `${i + 1}`,
			userId: 'current-user',
			date: new Date(Date.now() + i * 86400000 * 2).toISOString().split('T')[0],
			time: ['09:00', '11:00', '15:00'][i],
			name: 'Usuario Actual',
			email: 'usuario@ejemplo.com',
			phone: '+54 11 1234-5678',
			status: 'confirmed',
			createdAt: new Date(Date.now() - i * 86400000).toISOString(),
			strategy: {
				id: i + 1,
				title: `Estrategia de Marketing #${i + 1}`,
				profileImage: `/placeholder.svg?height=64&width=64&text=Profile+${i + 1}`,
			},
		}));
	},
};
