'use client';
import { LocateFixed, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { getAddressGeoRefWithCoords } from '@/hooks/use-location';

interface CurrentLocationProps {
	onLocationFound: (location: string) => void;
	variant?: 'icon' | 'text';
}

export default function CurrentLocation({ onLocationFound, variant = 'icon' }: CurrentLocationProps) {
	const [isLocating, setIsLocating] = useState(false);
	const { mutateAsync: getAddress } = getAddressGeoRefWithCoords();

	const handleLocation = async (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();

		if (!navigator.geolocation) {
			alert('Tu navegador no soporta geolocalización');
			return;
		}

		setIsLocating(true);

		navigator.geolocation.getCurrentPosition(
			async (pos) => {
				const { latitude, longitude } = pos.coords;
				try {
					const result = await getAddress({ lat: latitude, lng: longitude });
					if (result && result.success) {
						onLocationFound(result.fullAddress);
					}
				} catch (error) {
					console.error('Error al obtener dirección:', error);
					alert('No pudimos determinar tu dirección exacta, pero detectamos tu posición.');
				} finally {
					setIsLocating(false);
				}
			},
			(err) => {
				console.error('Error obteniendo ubicación:', err);
				setIsLocating(false);
				alert('No pudimos acceder a tu ubicación. Por favor, verifica los permisos de tu navegador.');
			},
			{
				enableHighAccuracy: true,
				timeout: 10000,
				maximumAge: 60000,
			}
		);
	};

	if (variant === 'text') {
		return (
			<button
				type='button'
				onClick={handleLocation}
				disabled={isLocating}
				className='flex items-center gap-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 text-sm transition-colors py-2 px-4 w-full text-left bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg'
			>
				{isLocating ? (
					<Loader2 className='h-4 w-4 animate-spin text-indigo-500' />
				) : (
					<LocateFixed className='h-4 w-4 text-indigo-500' />
				)}
				<span className='font-medium'>
					{isLocating ? 'Obteniendo ubicación...' : 'Usar mi ubicación actual'}
				</span>
			</button>
		);
	}

	return (
		<Button
			type='button'
			size='icon'
			variant='ghost'
			className='h-8 w-8 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-full'
			onClick={handleLocation}
			disabled={isLocating}
			title='Usar mi ubicación actual'
		>
			{isLocating ? (
				<Loader2 className='h-4 w-4 animate-spin' />
			) : (
				<LocateFixed className='h-4 w-4' />
			)}
		</Button>
	);
}
