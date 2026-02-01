'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, ShoppingBag } from 'lucide-react';

// Esquema de validación para el formulario
const checkoutSchema = z.object({
	name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
	email: z.string().email('Ingresa un email válido'),
	phone: z.string().min(6, 'Ingresa un número de teléfono válido'),
	address: z.string().min(5, 'Ingresa una dirección válida'),
	notes: z.string().optional(),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

interface CheckoutFormProps {
	onSubmit: (data: CheckoutFormValues) => void;
	onCancel: () => void;
	isSubmitting: boolean;
	currentUser: any;
	cartTotal: number;
	itemCount: number;
}

export default function CheckoutForm({ onSubmit, onCancel, isSubmitting, currentUser, cartTotal, itemCount }: CheckoutFormProps) {
	const [useUserData, setUseUserData] = useState(!!currentUser);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<CheckoutFormValues>({
		resolver: zodResolver(checkoutSchema),
		defaultValues: {
			name: currentUser?.name || '',
			email: currentUser?.email || '',
			phone: '',
			address: '',
			notes: '',
		},
	});

	return (
		<div className='space-y-6'>
			<div className='bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6'>
				<div className='flex items-center justify-between mb-2'>
					<div className='flex items-center'>
						<ShoppingBag className='h-5 w-5 text-emerald-600 mr-2' />
						<h3 className='font-medium text-emerald-800'>Resumen del Pedido</h3>
					</div>
					<span className='text-emerald-700 font-medium'>
						{itemCount} {itemCount === 1 ? 'producto' : 'productos'}
					</span>
				</div>
				<div className='flex justify-between text-emerald-800 font-bold'>
					<span>Total a pagar:</span>
					<span>${cartTotal.toFixed(2)}</span>
				</div>
			</div>

			<h3 className='text-lg font-medium'>Información de Contacto</h3>

			{currentUser && (
				<div className='flex items-center mb-4'>
					<input
						type='checkbox'
						id='use-account-data'
						className='h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 mr-2'
						checked={useUserData}
						onChange={(e) => setUseUserData(e.target.checked)}
					/>
					<Label htmlFor='use-account-data'>Usar datos de mi cuenta</Label>
				</div>
			)}

			<form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
				<div className='space-y-2'>
					<Label htmlFor='name'>Nombre completo</Label>
					<Input id='name' {...register('name')} disabled={useUserData && !!currentUser} className={errors.name ? 'border-red-500' : ''} />
					{errors.name && <p className='text-sm text-red-500'>{errors.name.message}</p>}
				</div>

				<div className='space-y-2'>
					<Label htmlFor='email'>Email</Label>
					<Input
						id='email'
						type='email'
						{...register('email')}
						disabled={useUserData && !!currentUser}
						className={errors.email ? 'border-red-500' : ''}
					/>
					{errors.email && <p className='text-sm text-red-500'>{errors.email.message}</p>}
				</div>

				<div className='space-y-2'>
					<Label htmlFor='phone'>Teléfono</Label>
					<Input id='phone' {...register('phone')} className={errors.phone ? 'border-red-500' : ''} />
					{errors.phone && <p className='text-sm text-red-500'>{errors.phone.message}</p>}
				</div>

				<div className='space-y-2'>
					<Label htmlFor='address'>Dirección de entrega</Label>
					<Input id='address' {...register('address')} className={errors.address ? 'border-red-500' : ''} />
					{errors.address && <p className='text-sm text-red-500'>{errors.address.message}</p>}
				</div>

				<div className='space-y-2'>
					<Label htmlFor='notes'>Notas adicionales (opcional)</Label>
					<Textarea id='notes' {...register('notes')} rows={3} />
				</div>

				<div className='flex justify-end space-x-2 pt-4'>
					<Button type='button' variant='outline' onClick={onCancel} disabled={isSubmitting}>
						Cancelar
					</Button>
					<Button type='submit' disabled={isSubmitting}>
						{isSubmitting ? (
							<>
								<Loader2 className='mr-2 h-4 w-4 animate-spin' />
								Procesando...
							</>
						) : (
							'Confirmar Pedido'
						)}
					</Button>
				</div>
			</form>
		</div>
	);
}
