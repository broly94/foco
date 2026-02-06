import Link from 'next/link';
import LoginForm from '@/app/login/components/LoginForm';
import Logo from '@/components/Logo';
import TypewriterEffect from '@/components/TypewriterEffect';

export default function LoginPage() {
	return (
		<main className='grid grid-cols-1 md:grid-cols-10 h-screen w-full'>
			{/* Left Side: Typewriter & Branding (60%) */}
			<section className='hidden md:flex md:col-span-6 bg-zinc-50 dark:bg-zinc-950 flex-col p-12 justify-center relative overflow-hidden'>
				<div className='relative z-10 max-w-xl mx-auto'>
					<TypewriterEffect />
					<p className='mt-8 text-zinc-400 text-lg'>
						Gestioná tu presencia digital y conectá con nuevos clientes en tu zona de forma inteligente.
					</p>
				</div>

				{/* Decorative elements */}
				<div className='absolute bottom-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[120px] rounded-full' />
				<div className='absolute top-1/4 left-1/4 w-32 h-32 bg-emerald-500/5 blur-[80px] rounded-full' />
			</section>

			{/* Right Side: Login Form (40%) */}
			<section className='col-span-1 md:col-span-4 flex flex-col items-center justify-center p-6 sm:p-12 bg-zinc-50 dark:bg-zinc-950'>
				<div className='w-full max-w-sm'>
					<div className='md:hidden flex justify-center mb-10'>
						<Logo className='scale-110' />
					</div>

					<div className='text-center mb-10'>
						<h1 className='text-3xl font-bold text-zinc-900 dark:text-zinc-50'>Bienvenido de nuevo</h1>
						<p className='text-zinc-600 dark:text-zinc-400 mt-2'>Accede a tu cuenta para continuar</p>
					</div>

					<div className='bg-white dark:bg-zinc-900 rounded-2xl shadow-xl shadow-zinc-200/50 dark:shadow-none border border-zinc-200 dark:border-zinc-800 p-8'>
						<LoginForm />

						<div className='mt-8 text-center'>
							<p className='text-sm text-zinc-600 dark:text-zinc-400'>
								¿No tienes una cuenta?{' '}
								<Link href='/register' className='text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-semibold transition-colors uppercase tracking-tight'>
									Regístrate ahora
								</Link>
							</p>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}
