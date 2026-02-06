'use client';
import Link from 'next/link';
import RegisterForm from '@/app/register/components/RegisterForm';
import Logo from '@/components/Logo';
import TypewriterEffect from '@/components/TypewriterEffect';

export default function RegisterPage() {
	return (
		<main className='grid grid-cols-1 md:grid-cols-10 h-screen w-full'>
			{/* Left Side: Typewriter & Branding (60%) */}
			<section className='hidden md:flex md:col-span-6 bg-zinc-50 dark:bg-zinc-950 flex-col p-12 justify-center relative overflow-hidden'>
				<div className='relative z-10 max-w-xl mx-auto'>
					<TypewriterEffect />
					<p className='mt-8 text-zinc-400 text-lg'>
						Unite a la comunidad de negocios locales y llevalos al siguiente nivel con nuestras herramientas de marketing.
					</p>
				</div>

				{/* Decorative elements */}
				<div className='absolute bottom-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[120px] rounded-full' />
				<div className='absolute top-1/4 left-1/4 w-32 h-32 bg-emerald-500/5 blur-[80px] rounded-full' />
			</section>

			{/* Right Side: Register Form (40%) */}
			<section className='col-span-1 md:col-span-4 flex flex-col items-center justify-center p-6 sm:p-12 bg-zinc-50 dark:bg-zinc-950'>
				<div className='w-full max-w-sm'>
					<div className='md:hidden flex justify-center mb-10'>
						<Logo className='scale-110' />
					</div>

					<div className='text-center mb-10'>
						<h1 className='text-3xl font-bold text-zinc-900 dark:text-zinc-50'>Crear una cuenta</h1>
						<p className='text-zinc-600 dark:text-zinc-400 mt-2'>Regístrate para empezar a crecer hoy</p>
					</div>

					<div className='bg-white dark:bg-zinc-900 rounded-2xl shadow-xl shadow-zinc-200/50 dark:shadow-none border border-zinc-200 dark:border-zinc-800 p-8'>
						<RegisterForm />

						<div className='mt-8 text-center'>
							<p className='text-sm text-zinc-600 dark:text-zinc-400'>
								¿Ya tienes una cuenta?{' '}
								<Link href='/login' className='text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-semibold transition-colors uppercase tracking-tight'>
									Inicia Sesión
								</Link>
							</p>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}
