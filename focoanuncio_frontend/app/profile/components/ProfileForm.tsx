'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store/auth-store';
import { Button } from '@/components/ui/button';
import { AnimatedButton } from '@/components/ui/animated-button';
import { useMyStrategy } from '@/hooks/use-marketing-strategy';
import { Store, LayoutDashboard, ArrowRight } from 'lucide-react';

export default function ProfileForm() {
	const userState = useAuthStore((state) => state.user);
	const { data: strategy } = useMyStrategy();

	return (
		<section className='space-y-8 animate-in fade-in slide-in-from-top-2 duration-500'>
			<div className='space-y-2'>
				<h2 className='text-2xl font-bold text-zinc-900 dark:text-zinc-50'>Información Personal</h2>
				<p className='text-zinc-500 dark:text-zinc-400 text-sm'>
					Actualiza tus datos básicos y foto de perfil.
				</p>
			</div>

			{/* Perfil Comercial Quick Access */}
			<div className={`p-6 rounded-[32px] border ${strategy
				? 'bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-100 dark:border-zinc-800'
				: 'bg-indigo-50/50 dark:bg-indigo-900/20 border-indigo-100 dark:border-indigo-900/30'
				} transition-all`}>
				<div className='flex items-center justify-between gap-4 flex-wrap'>
					<div className='flex items-center gap-4'>
						<div className={`p-3 rounded-2xl ${strategy ? 'bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900' : 'bg-indigo-600 text-white'}`}>
							{strategy ? <LayoutDashboard className='h-5 w-5' /> : <Store className='h-5 w-5' />}
						</div>
						<div>
							<h3 className='font-bold text-sm'>{strategy ? 'Tu negocio está activo' : 'Habilita tu Negocio'}</h3>
							<p className='text-xs text-zinc-500 dark:text-zinc-400'>
								{strategy ? strategy.title : 'Empieza a vender tus servicios hoy mismo.'}
							</p>
						</div>
					</div>
					<Button asChild variant='ghost' className='rounded-xl text-xs font-bold hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50'>
						<Link href={strategy ? '/dashboard' : '/onboarding'}>
							{strategy ? 'Ir al Dashboard' : 'Activar ahora'} <ArrowRight className='h-3 w-3 ml-2' />
						</Link>
					</Button>
				</div>
			</div>

			<div className='flex flex-col items-center p-8 bg-zinc-50 dark:bg-zinc-900/50 rounded-3xl border border-zinc-100 dark:border-zinc-800 border-dashed'>
				<div className='relative group'>
					<Image
						src={userState?.avatar || '/images/user/user_default_avatar.svg'}
						width={80}
						height={80}
						alt='Foto de perfil'
						className='w-24 h-24 rounded-full border-4 border-white dark:border-zinc-800 shadow-xl object-cover'
					/>
				</div>
				<div className='mt-4 text-center'>
					<p className='text-xl font-bold text-zinc-900 dark:text-zinc-50'>{userState?.name}</p>
					<p className='text-zinc-500 dark:text-zinc-400 text-sm'>{userState?.email}</p>
				</div>
			</div>

			<div className='pt-6 border-t border-zinc-100 dark:border-zinc-800'>
				<div className='flex flex-col items-center gap-4'>
					<p className='text-xs text-zinc-400'>¿Deseas cambiar tu contraseña?</p>
					<AnimatedButton
						href='/password-recovery'
						label='Recuperar contraseña'
						hoverLabel='Recuperar contraseña'
						withArrow
						variant='secondary'
						animation='slideLeft'
						size='default'
						className='rounded-xl'
					/>
				</div>
			</div>
		</section>
	);
}
