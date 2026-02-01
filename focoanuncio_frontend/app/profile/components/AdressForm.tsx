'use client';

import { memo, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { useProvinces, useLocalities, getAddressGeoRefWithText } from '@/hooks/use-location';
import useDebounced from '@/hooks/use-debounced';
import SearchState from '@/app/profile/components/SearchState';
import { useAuthStore } from '@/lib/store/auth-store';
import { useCreateAddressUser } from '@/hooks/use-user';

import { OrbitProgress } from 'react-loading-indicators';
import Loading from '@/app/profile/components/Loading';
import { showToast } from 'nextjs-toast-notify';
import { AnimatedButton } from '@/components/ui/animated-button';

// -------------------
// Schema con Zod
// -------------------
const adressSchema = z.object({
	province: z.string().min(1, 'Selecciona una provincia'),
	state: z.string().min(1, 'La ciudad es requerida'),
	address: z.string().min(1, 'La calle es requerida'),
	postalCode: z.string().min(4, 'Código postal inválido'),
	country: z.string().transform(() => 'Argentina'),
});

export interface createAddressUserSchema {
	province: string;
	state: string;
	address: string;
	postCode: string;
	lat: number;
	lon: number;
	user: number | undefined;
}

type AdressFormData = z.infer<typeof adressSchema>;

const AdressForm = memo(() => {
	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors },
	} = useForm<AdressFormData>({
		resolver: zodResolver(adressSchema),
		defaultValues: {
			country: 'Argentina',
			state: '',
			province: '',
		},
	});

	const [provinceSelected, setProvinceSelected] = useState<string>('');

	const { data: provinces, isLoading } = useProvinces();

	const { token, user } = useAuthStore((state) => state);

	// municipio escrito (con debounce) -> se usa para pedir al backend
	const debouncedState = useDebounced(watch('state') ?? '', 500);

	// cargar localidades desde backend en base a provincia + city (ya tenés datos en tiempo real acá)
	const { data } = useLocalities(provinceSelected, debouncedState);
	const states = Array.isArray(data) ? data : [];

	// provincia seleccionada
	const handleProvinceChange = (value: string) => {
		setValue('province', value, { shouldDirty: true });
		// Setea la provincia seleccionada en el store
		setProvinceSelected(value);
		// limpiar ciudad y calle cuando se cambia la provincia
		setValue('state', '', { shouldDirty: true, shouldValidate: false });
	};

	const addressGeoref = getAddressGeoRefWithText();

	const createUser = useCreateAddressUser();

	// Creamos un objeto con todos los datos para enviar al backend
	// Si no hay resultados, devolvemos null
	const createFullAddress = (
		province: string,
		state: string,
		address: string,
		postCode: string,
		result: any[] = []
	): createAddressUserSchema | null => {
		if (result.length > 0) {
			const { lat, lng } = result[0].geometry.location;
			return {
				province,
				state,
				address,
				postCode,
				lat,
				lon: lng,
				user: user?.id,
			};
		}
		return null;
	};

	const onSubmit = async (data: AdressFormData) => {
		const location = `${data.province}, ${data.state}, ${data.address}`;
		// Primero obtenemos lat y lon desde georef

		try {
			// Obtenemos coordenadas
			const georefRes = await addressGeoref.mutateAsync({ location });

			const fullAddress = createFullAddress(data.province, data.state, data.address, data.postalCode, georefRes?.data.results);

			if (user?.id && token) {
				await createUser.mutateAsync({ fullAddress, userId: user.id, token });
				alert('✅ Dirección creada correctamente');
			}
		} catch (error: any) {
			const message = error?.message || 'Ocurrió un error inesperado';
			const status = error?.status;

			if (status === 409) {
				showToast.warning('Ya tenes una dirección registrada', {
					duration: 3000,
					progress: true,
					position: 'bottom-right',
					transition: 'swingInverted',
					icon: '',
					sound: true,
				});
			} else if (status === 400) {
				showToast.error('Datos inválidos', {
					duration: 3000,
					progress: true,
					position: 'bottom-right',
					transition: 'swingInverted',
					icon: '',
					sound: true,
				});
			} else {
				showToast.error(`Error inesperado: ${message}`, {
					duration: 3000,
					progress: true,
					position: 'bottom-right',
					transition: 'swingInverted',
					icon: '',
					sound: true,
				});
			}
		}
	};

	// ... (imports remain same as before)
	return (
		<section className='space-y-8 animate-in fade-in slide-in-from-top-2 duration-500'>
			<div className='space-y-2'>
				<h2 className='text-2xl font-bold text-zinc-900 dark:text-zinc-50'>Dirección Primaria</h2>
				<p className='text-zinc-500 dark:text-zinc-400 text-sm'>
					Define tu ubicación principal para mejorar la precisión de las búsquedas.
				</p>
			</div>

			<form onSubmit={handleSubmit(onSubmit)} className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
				{/* Provincia */}
				<div className='space-y-2'>
					<label className='text-sm font-semibold text-zinc-700 dark:text-zinc-300 ml-1'>Provincia</label>
					<Select onValueChange={handleProvinceChange}>
						<SelectTrigger className='rounded-xl border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 h-12'>
							<SelectValue placeholder='Selecciona una provincia' />
						</SelectTrigger>
						<SelectContent className='rounded-xl border-zinc-200 dark:border-zinc-800 shadow-xl'>
							{isLoading && <p className='p-2 text-sm text-zinc-500'>Cargando...</p>}
							{provinces?.map((prov: any) => (
								<SelectItem key={prov.province_id} value={String(prov.province_id)} className='rounded-lg'>
									{prov.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					{errors.province && <p className='text-xs text-red-500 ml-1'>{errors.province.message}</p>}
				</div>

				{/* Ciudad con autocomplete */}
				<div className='space-y-2'>
					<label className='text-sm font-semibold text-zinc-700 dark:text-zinc-300 ml-1'>Ciudad / Municipio</label>
					<SearchState
						states={states}
						value={watch('state') || ''}
						onChange={(val) => setValue('state', val)}
						disabled={!watch('province')}
					/>
					{errors.state && <p className='text-xs text-red-500 ml-1'>{errors.state.message}</p>}
				</div>

				{/* Calle */}
				<div className='space-y-2'>
					<label className='text-sm font-semibold text-zinc-700 dark:text-zinc-300 ml-1'>Calle y altura</label>
					<Input
						placeholder='Ej: Av. San Martín 1234'
						disabled={!watch('state')}
						{...register('address')}
						className='rounded-xl border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 h-12'
					/>
					{errors.address && <p className='text-xs text-red-500 ml-1'>{errors.address.message}</p>}
				</div>

				{/* Código Postal */}
				<div className='space-y-2'>
					<label className='text-sm font-semibold text-zinc-700 dark:text-zinc-300 ml-1'>Código Postal</label>
					<Input
						placeholder='1884'
						{...register('postalCode')}
						disabled={!watch('state')}
						className='rounded-xl border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 h-12'
					/>
					{errors.postalCode && <p className='text-xs text-red-500 ml-1'>{errors.postalCode.message}</p>}
				</div>

				{/* País */}
				<div className='space-y-2'>
					<label className='text-sm font-semibold text-zinc-700 dark:text-zinc-300 ml-1'>País</label>
					<Input
						disabled
						{...register('country')}
						className='rounded-xl border-zinc-100 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800/50 text-zinc-500 h-12'
					/>
				</div>

				<div className='sm:col-span-2 pt-6 border-t border-zinc-100 dark:border-zinc-800 flex justify-center'>
					{addressGeoref.isPending || createUser.isPending ? (
						<div className='flex items-center gap-3 text-zinc-400'>
							<Loader2 className='h-5 w-5 animate-spin' />
							<span className='text-sm'>Guardando cambios...</span>
						</div>
					) : (
						<Button
							type='submit'
							disabled={addressGeoref.isPending || createUser.isPending}
							className='bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 rounded-xl px-12 h-12 font-bold shadow-lg transition-all'
						>
							Guardar Cambios
						</Button>
					)}
				</div>
			</form>
		</section>
	);
});
export default AdressForm;
