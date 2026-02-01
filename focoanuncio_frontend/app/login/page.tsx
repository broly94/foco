import Link from 'next/link';
import LoginForm from '@/app/login/components/LoginForm';

export default function LoginPage() {
	return (
		<div className='max-w-md mx-auto px-4 py-12'>
			<div className='text-center mb-8'>
				<h1 className='text-3xl font-bold'>Iniciar Sesión</h1>
				<p className='text-gray-600 mt-2'>Accede a tu cuenta para gestionar tus estrategias</p>
			</div>

			<div className='bg-white rounded-xl shadow-sm p-6'>
				<LoginForm />
				<div className='mt-6 text-center'>
					<p className='text-sm text-gray-600'>
						¿No tienes una cuenta?{' '}
						<Link href='/register' className='text-emerald-600 hover:text-emerald-800 font-medium'>
							Regístrate
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
