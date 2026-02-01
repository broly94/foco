'use client';

import { useMyStrategy } from '@/hooks/use-marketing-strategy';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Store, LayoutDashboard, ArrowRight, ShieldCheck, Loader2 } from 'lucide-react';

export default function ConfigForm() {
	const { data: strategy, isLoading } = useMyStrategy();

	if (isLoading) {
		return (
			<div className='flex items-center justify-center p-12'>
				<Loader2 className='h-8 w-8 animate-spin text-zinc-300' />
			</div>
		);
	}

	return (
		<div className='w-full max-w-xl space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500'>
			<div className='space-y-2'>
				<h2 className='text-2xl font-bold text-zinc-900 dark:text-zinc-50'>Configuración de Cuenta</h2>
				<p className='text-zinc-500 dark:text-zinc-400 text-sm'>
					Gestiona las preferencias de tu cuenta y el estado de tu suscripción comercial.
				</p>
			</div>

			<div className='bg-zinc-50 dark:bg-zinc-900/50 rounded-3xl p-6 border border-zinc-100 dark:border-zinc-800 space-y-6'>
				<div className='flex items-start gap-4'>
					<div className={`p-3 rounded-2xl ${strategy ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-indigo-100 dark:bg-indigo-900/30'}`}>
						{strategy ? (
							<ShieldCheck className='h-6 w-6 text-emerald-600 dark:text-emerald-400' />
						) : (
							<Store className='h-6 w-6 text-indigo-600 dark:text-indigo-400' />
						)}
					</div>
					<div className='flex-1 space-y-1'>
						<h3 className='font-bold text-zinc-900 dark:text-zinc-50'>
							{strategy ? 'Perfil Comercial Activo' : 'Perfil Comercial'}
						</h3>
						<p className='text-sm text-zinc-500 dark:text-zinc-400'>
							{strategy
								? `Tu negocio "${strategy.title}" está publicado y visible para todos.`
								: 'Habilita tu tienda para empezar a vender tus servicios y productos en Foco.'}
						</p>
					</div>
				</div>

				<div className='pt-4 border-t border-zinc-100 dark:border-zinc-800'>
					{strategy ? (
						<Button asChild className='w-full bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900 rounded-2xl h-12 shadow-lg'>
							<Link href='/dashboard'>
								<LayoutDashboard className='h-4 w-4 mr-2' />
								Ir al Panel de Control
								<ArrowRight className='h-4 w-4 ml-2' />
							</Link>
						</Button>
					) : (
						<Button asChild className='w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl h-12 shadow-lg shadow-indigo-200 dark:shadow-none transition-all'>
							<Link href='/onboarding'>
								<Store className='h-4 w-4 mr-2' />
								Activa tu cuenta comercial
								<ArrowRight className='h-4 w-4 ml-2' />
							</Link>
						</Button>
					)}
				</div>
			</div>

			{/* Otras opciones de configuración pueden ir aquí */}
			<div className='p-4 bg-zinc-50 dark:bg-zinc-900/30 rounded-2xl border border-zinc-100 dark:border-zinc-800 border-dashed'>
				<p className='text-xs text-center text-zinc-400'>
					Más opciones de seguridad y privacidad próximamente.
				</p>
			</div>
		</div>
	);
}
