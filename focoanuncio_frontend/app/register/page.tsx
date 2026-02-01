'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Split } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRegister } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { showToast } from 'nextjs-toast-notify';

// Esquema de validación con Zod
const registerSchema = z
	.object({
		name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
		lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
		phone: z
			.string()
			.min(9, 'El número de celular debe tener al menos 9 caracteres')
			.max(15, 'El número de celular no puede tener más de 15 caracteres'),
		email: z.string().email('Ingresa un email válido'),
		password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
		confirmPassword: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
		agreeTerms: z.boolean().refine((val) => val == true, { message: 'Debes aceptar los términos y condiciones' }),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Las contraseñas no coinciden',
		path: ['confirmPassword'],
	});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [showPassword, setShowPassword] = useState(false);
	const register = useRegister();

	const plan = searchParams.get('plan') || 'free';

	const {
		register: registerField,
		handleSubmit,
		control,
		formState: { errors, isSubmitting },
	} = useForm<RegisterFormValues>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			name: '',
			lastName: '',
			phone: '',
			email: '',
			password: '',
			confirmPassword: '',
			agreeTerms: false,
		},
	});

	const onSubmit = async (data: RegisterFormValues) => {
		try {
			await register.mutateAsync({
				name: data.name,
				lastName: data.lastName,
				phone: data.phone,
				email: data.email,
				password: data.password,
			});

			router.push('/login?registered=true&activationrequired=true');
		} catch (error: any) {
			showToast.error(`${error.message}`, {
				duration: 4000,
				progress: false,
				position: 'top-center',
				transition: 'bounceIn',
				icon: '',
				sound: true,
			});
		}
	};

	return (
		<div className='max-w-md mx-auto px-4 py-12'>
			<div className='text-center mb-8'>
				<h1 className='text-3xl font-bold'>Crear una cuenta</h1>
				<p className='text-gray-600 mt-2'>
					Regístrate para crear y gestionar tus estrategias de marketing
					{plan === 'premium' && ' con el plan Premium'}
				</p>
			</div>

			<div className='bg-white rounded-xl shadow-sm p-6'>
				<form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
					<div className='space-y-2'>
						<Label htmlFor='name'>Nombre completo</Label>
						<Input id='name' type='text' placeholder='Tu nombre' {...registerField('name')} aria-invalid={errors.name ? 'true' : 'false'} />
						{errors.name && <p className='text-sm text-red-500'>{errors.name.message}</p>}
					</div>

					<div className='space-y-2'>
						<Label htmlFor='lastName'>Apellido</Label>
						<Input
							id='lastName'
							type='text'
							placeholder='Tu apellido'
							{...registerField('lastName')}
							aria-invalid={errors.lastName ? 'true' : 'false'}
						/>
						{errors.lastName && <p className='text-sm text-red-500'>{errors.lastName.message}</p>}
					</div>

					<div className='space-y-2'>
						<Label htmlFor='phone'>Celular</Label>
						<Input
							id='phone'
							type='text'
							placeholder='Tu numero de celular'
							{...registerField('phone')}
							aria-invalid={errors.phone ? 'true' : 'false'}
						/>
						{errors.phone && <p className='text-sm text-red-500'>{errors.phone.message}</p>}
					</div>

					<div className='space-y-2'>
						<Label htmlFor='email'>Email</Label>
						<Input
							id='email'
							type='email'
							placeholder='tu@email.com'
							{...registerField('email')}
							aria-invalid={errors.email ? 'true' : 'false'}
						/>
						{errors.email && <p className='text-sm text-red-500'>{errors.email.message}</p>}
					</div>

					<div className='space-y-2'>
						<Label htmlFor='password'>Contraseña</Label>
						<div className='relative'>
							<Input
								id='password'
								type={showPassword ? 'text' : 'password'}
								placeholder='••••••••'
								{...registerField('password')}
								aria-invalid={errors.password ? 'true' : 'false'}
							/>
							<button
								type='button'
								className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700'
								onClick={() => setShowPassword(!showPassword)}
							>
								{showPassword ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
							</button>
						</div>
						{errors.password && <p className='text-sm text-red-500'>{errors.password.message}</p>}
					</div>

					<div className='space-y-2'>
						<Label htmlFor='confirmPassword'>Confirmar contraseña</Label>
						<Input
							id='confirmPassword'
							type={showPassword ? 'text' : 'password'}
							placeholder='••••••••'
							{...registerField('confirmPassword')}
							aria-invalid={errors.confirmPassword ? 'true' : 'false'}
						/>
						{errors.confirmPassword && <p className='text-sm text-red-500'>{errors.confirmPassword.message}</p>}
					</div>

					<div className='flex items-start space-x-2'>
						<Controller
							name='agreeTerms'
							control={control}
							defaultValue={false}
							rules={{ required: 'Debes aceptar los términos y condiciones' }}
							render={({ field }) => (
								<div className='flex items-center space-x-2'>
									<Checkbox checked={field.value} onCheckedChange={field.onChange} id='agreeTerms' />
									<Label htmlFor='agreeTerms'>Acepto los términos y condiciones</Label>
								</div>
							)}
						/>
					</div>
					{errors.agreeTerms && <p className='text-sm text-red-500'>{errors.agreeTerms.message}</p>}

					<Button type='submit' className='w-full mt-4' disabled={isSubmitting}>
						{isSubmitting ? 'Registrando...' : 'Registrarse'}
					</Button>
				</form>

				<div className='mt-6 text-center'>
					<p className='text-sm text-gray-600'>
						¿Ya tienes una cuenta?{' '}
						<Link href='/login' className='text-emerald-600 hover:text-emerald-800 font-medium'>
							Iniciar Sesión
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
