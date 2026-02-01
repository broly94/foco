export default function Benefits() {
	return (
		<section className='py-16 dark:bg-zinc-900 px-4 sm:px-6 lg:px-8'>
			<div className='max-w-7xl mx-auto '>
				<div className='text-center mb-12'>
					<h2 className='text-3xl font-bold uppercase'>
						¿Por qué elegir <span className='text-brand-400'>foco</span>?
					</h2>
					<p className='mt-4 text-xl max-w-3xl mx-auto text-zinc-600 dark:text-zinc-400 '>
						Plataforma con herramientas gratuitas para gestionar tu negocio
					</p>
				</div>

				<div className='grid md:grid-cols-3 gap-8 text-zinc-600 dark:text-zinc-400'>
					{/* Beneficio 1 */}
					<div className='rounded-xl p-6 text-center shadow-md shadow-zinc-500 dark:shadow-zinc-800 transition-shadow border border-zinc-600'>
						<div className='w-16 h-16 bg-growth-100 rounded-full flex items-center justify-center mx-auto mb-4'>
							<svg className='w-8 h-8 text-growth-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9'
								/>
							</svg>
						</div>
						<h3 className='text-xl font-bold mb-2 dark:text-zinc-50 text-zinc-900'>Alcance local</h3>
						<p>Llega a clientes en tu área inmediata con nuestra tecnología de geolocalización precisa.</p>
					</div>

					{/* Beneficio 2 */}
					<div className='rounded-xl p-6 text-center shadow-md shadow-zinc-500 dark:shadow-zinc-800 transition-shadow border border-zinc-600'>
						<div className='w-16 h-16 bg-growth-100 rounded-full flex items-center justify-center mx-auto mb-4'>
							<svg className='w-8 h-8 text-zinc-950' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'
								/>
							</svg>
						</div>
						<h3 className='text-xl font-bold mb-2 dark:text-zinc-50 text-zinc-900'>Gestión autónoma</h3>
						<p>Controla tu perfil sensillo y rapido, actualiza información y gestiona tu presencia en línea sin intermediarios.</p>
					</div>

					{/* Beneficio 3 */}
					<div className='rounded-xl p-6 text-center shadow-md shadow-zinc-500 dark:shadow-zinc-800 transition-shadow border border-zinc-600'>
						<div className='w-16 h-16 bg-growth-100 rounded-full flex items-center justify-center mx-auto mb-4'>
							<svg className='w-8 h-8 text-growth-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
								<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' />
							</svg>
						</div>
						<h3 className='text-xl font-bold mb-2 dark:text-zinc-50 text-zinc-900'>Herramientas integradas</h3>
						<p>Catálogo digital, reserva de turnos y análisis de desempeño todo en un solo lugar.</p>
					</div>
				</div>
			</div>
		</section>
	);
}
