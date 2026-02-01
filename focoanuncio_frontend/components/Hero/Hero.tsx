import Link from 'next/link';
import CurrentLocation from '../current-location';
import SearchBar from '../search-bar';
import { Button } from '../ui/button';

export default function Hero() {
	return (
		<section className='min-h-[85vh] flex flex-col justify-center px-4 sm:px-6 lg:px-3 bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800'>
			<div className='flex justify-around w-full mx-auto'>
				{/* Grid de 2 columnas para desktop */}
				<div className='container flex flex-col items-center justify-center pt-10 gap-x-3 '>
					{/* Columna de texto */}
					<div className='container flex flex-col items-center gap-6 text-center max-w-3xl mb-5 py-10'>
						<h1 className='text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-zinc-900 dark:text-zinc-50'>
							Encontrá <span className='text-zinc-600 dark:text-zinc-400'>negocios o servicios locales</span> en tu zona
						</h1>
						<p className='mt-2 text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl'>
							Crea tu perfil comercial <span className='text-zinc-900 dark:text-zinc-100 font-bold'>Gratis</span> en simples pasos y
							disfruta de las herramientas para potenciar tu visibilidad.
						</p>

						<div className='container mx-auto mt-12 w-full max-w-2xl'>
							<SearchBar />
						</div>

						<div className='mt-12 flex flex-col items-center sm:flex-row gap-4 justify-center'>
							<Button size='lg' variant='default' className='w-full md:w-auto bg-zinc-900 text-white hover:bg-zinc-800'>
								<Link href='/register'>Crear cuenta gratis</Link>
							</Button>
							<Button size='lg' variant='outline' className='w-full md:w-auto border-zinc-300 text-zinc-700 hover:bg-zinc-100'>
								<Link href='/categories'>Ver Categorías</Link>
							</Button>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
