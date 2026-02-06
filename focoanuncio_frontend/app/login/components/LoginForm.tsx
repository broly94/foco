'use client';
import { useLogin } from '@/hooks/use-auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { showToast } from 'nextjs-toast-notify';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';
import { motion } from 'framer-motion';

// Esquema de validación con Zod
const loginSchema = z.object({
	email: z.string().email('Ingresa un email válido'),
	password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
	rememberMe: z.boolean().optional(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
	const [showPassword, setShowPassword] = useState(false);
	const login = useLogin();
	const router = useRouter();

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<LoginFormValues>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: '',
			password: '',
			rememberMe: false,
		},
	});

	const onSubmit = async (data: LoginFormValues) => {
		try {
			await login.mutateAsync({
				email: data.email,
				password: data.password,
			});

			router.push('/');
		} catch (error: any) {
			console.log('Entro al catch');
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

	const handleLoginGoogle = async () => {
		router.push(`http://localhost:3002/api/auth/google`);
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className='w-full'
		>
			<form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
				<div className='space-y-2'>
					<Label htmlFor='email' className='text-zinc-700 dark:text-zinc-300 font-medium'>
						Email
					</Label>
					<Input
						id='email'
						type='email'
						placeholder='tu@email.com'
						className='h-11 bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all'
						{...register('email')}
						aria-invalid={errors.email ? 'true' : 'false'}
					/>
					{errors.email && (
						<motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='text-xs font-medium text-red-500'>
							{errors.email.message}
						</motion.p>
					)}
				</div>

				<div className='space-y-2'>
					<div className='flex items-center justify-between'>
						<Label htmlFor='password' className='text-zinc-700 dark:text-zinc-300 font-medium'>
							Contraseña
						</Label>
						<Link href='/forgot-password' title='Recuperar contraseña' className='text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:underline'>
							¿Olvidaste tu contraseña?
						</Link>
					</div>
					<div className='relative'>
						<Input
							id='password'
							type={showPassword ? 'text' : 'password'}
							placeholder='••••••••'
							className='h-11 bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all pr-12'
							{...register('password')}
							aria-invalid={errors.password ? 'true' : 'false'}
						/>
						<button
							type='button'
							className='absolute right-0 top-0 h-full px-3 py-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors'
							onClick={() => setShowPassword(!showPassword)}
						>
							{showPassword ? <EyeOff className='h-5 w-5' /> : <Eye className='h-5 w-5' />}
						</button>
					</div>
					{errors.password && (
						<motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='text-xs font-medium text-red-500'>
							{errors.password.message}
						</motion.p>
					)}
				</div>

				<div className='flex items-center space-x-2'>
					<Checkbox id='rememberMe' className='border-zinc-300 dark:border-zinc-600 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500' {...register('rememberMe')} />
					<Label htmlFor='rememberMe' className='text-sm text-zinc-600 dark:text-zinc-400 cursor-pointer'>
						Mantener sesión iniciada
					</Label>
				</div>

				<Button
					type='submit'
					className='w-full h-11 bg-zinc-900 dark:bg-emerald-600 hover:bg-zinc-800 dark:hover:bg-emerald-700 text-white font-bold transition-all disabled:opacity-70'
					disabled={isSubmitting}
				>
					{isSubmitting ? (
						<div className='flex items-center gap-2'>
							<Loader2 className='h-4 w-4 animate-spin' />
							Iniciando sesión...
						</div>
					) : (
						'Iniciar Sesión'
					)}
				</Button>
			</form>

			<div className='relative my-8'>
				<div className='absolute inset-0 flex items-center'>
					<span className='w-full border-t border-zinc-200 dark:border-zinc-800' />
				</div>
				<div className='relative flex justify-center text-xs uppercase'>
					<span className='bg-white dark:bg-zinc-900 px-2 text-zinc-500 dark:text-zinc-400'>O continuar con</span>
				</div>
			</div>

			<div className='flex justify-center'>
				<motion.button
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					onClick={handleLoginGoogle}
					className='p-3 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-sm hover:shadow-md transition-all flex items-center justify-center'
					title='Iniciar sesión con Google'
				>
					<svg className='h-6 w-6' viewBox='0 0 24 24'>
						<path
							d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
							fill='#4285F4'
						/>
						<path
							d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
							fill='#34A853'
						/>
						<path
							d='M5.84 14.09c-.22-.67-.35-1.39-.35-2.09s.13-1.42.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z'
							fill='#FBBC05'
						/>
						<path
							d='M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
							fill='#EA4335'
						/>
						<path d='M1 1h22v22H1z' fill='none' />
					</svg>
				</motion.button>
			</div>
		</motion.div>
	);
}
