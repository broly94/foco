'use client';

import { useSearchParams } from 'next/navigation';
import SearchBar from '@/components/search-bar';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import Link from 'next/link';
import RotatingAd from '@/components/rotating-ad';
import { useSearchStrategies } from '@/hooks/use-marketing-strategy';
import { Star, MapPin, SearchCheck } from 'lucide-react';

export default function SearchPage() {
	const searchParams = useSearchParams();
	const keyword = searchParams.get('keyword') || '';
	const location = searchParams.get('location') || '';

	const { data: strategies, isLoading, error } = useSearchStrategies(keyword, location);

	return (
		<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
			<h1 className='text-3xl font-bold text-gray-900 mb-8'>Buscar estrategias de marketing</h1>

			<div className='mb-8'>
				<SearchBar />
			</div>

			<div className='flex flex-col lg:flex-row gap-8'>
				{/* Filters */}
				<div className='w-full lg:w-64 flex-shrink-0'>
					<div className='bg-white rounded-lg shadow-sm p-6 sticky top-24'>
						<h2 className='text-lg font-semibold mb-4'>Filtros</h2>

						<div className='mb-6'>
							<h3 className='text-sm font-medium mb-2'>Valoración</h3>
							<div className='space-y-2'>
								{[5, 4, 3, 2, 1].map((rating) => (
									<div key={rating} className='flex items-center'>
										<input
											type='checkbox'
											id={`rating-${rating}`}
											className='h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500'
										/>
										<label htmlFor={`rating-${rating}`} className='ml-2 text-sm text-gray-700 flex items-center'>
											{Array.from({ length: 5 }).map((_, i) => (
												<Star
													key={i}
													className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
												/>
											))}
											<span className='ml-1'>{rating}+ estrellas</span>
										</label>
									</div>
								))}
							</div>
						</div>

						<div className='mb-6'>
							<h3 className='text-sm font-medium mb-2'>Distancia</h3>
							<Slider defaultValue={[50]} max={100} step={1} className='mb-2' />
							<div className='flex justify-between text-xs text-gray-500'>
								<span>0 km</span>
								<span>50 km</span>
								<span>100 km</span>
							</div>
						</div>

						<Button className='w-full'>Aplicar filtros</Button>
					</div>
				</div>

				{/* Results */}
				<div className='flex-1'>
					<div className='bg-white rounded-lg shadow-sm p-6 mb-6'>
						<div className='flex justify-between items-center'>
							<p className='text-gray-600'>
								{isLoading
									? 'Buscando estrategias...'
									: keyword && location
										? `Mostrando resultados para: "${keyword}" en ${location}`
										: keyword
											? `Mostrando resultados para: "${keyword}"`
											: location
												? `Mostrando resultados en: ${location}`
												: 'Todas las estrategias'}
							</p>
							<div className='flex items-center'>
								<span className='text-sm text-gray-600 mr-2'>Ordenar por:</span>
								<select className='text-sm border rounded p-1 bg-white'>
									<option>Relevancia</option>
									<option>Mejor valorados</option>
									<option>Más recientes</option>
									<option>Más populares</option>
								</select>
							</div>
						</div>
					</div>

					{isLoading ? (
						<div className='space-y-6'>
							{[1, 2, 3].map((i) => (
								<div key={i} className='bg-white rounded-lg shadow-sm h-48 animate-pulse' />
							))}
						</div>
					) : error ? (
						<div className='bg-white rounded-lg shadow-sm p-12 text-center'>
							<p className='text-red-500'>Ocurrió un error al cargar las estrategias.</p>
							<Button variant='outline' className='mt-4' onClick={() => window.location.reload()}>
								Reintentar
							</Button>
						</div>
					) : strategies && strategies.length > 0 ? (
						<div className='space-y-6'>
							{strategies.map((strategy: any) => (
								<div key={strategy.id} className='bg-white rounded-lg shadow-sm overflow-hidden group border border-transparent hover:border-zinc-200 transition-all'>
									<div className='md:flex'>
										<Link href={`/strategy/${strategy.id}`} className='md:w-1/3 h-48 md:h-auto bg-gray-100 block overflow-hidden'>
											<img
												src={strategy.images_marketing?.[0]?.url || `https://placehold.co/600x400/f4f4f5/71717a?text=${encodeURIComponent(strategy.title)}`}
												alt={strategy.title}
												className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-105'
											/>
										</Link>
										<div className='p-6 md:w-2/3'>
											<div className='flex justify-between items-start'>
												<Link href={`/strategy/${strategy.id}`}>
													<h3 className='text-xl font-semibold text-gray-900 group-hover:text-zinc-900 transition-colors uppercase'>
														{strategy.title}
													</h3>
												</Link>
												<div className='flex items-center'>
													{[1, 2, 3, 4, 5].map((j) => (
														<Star
															key={j}
															className={`w-4 h-4 ${j <= (strategy.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-200'}`}
														/>
													))}
													<span className='ml-1 text-sm text-gray-600'>{(strategy.rating || 0).toFixed(1)}</span>
												</div>
											</div>
											<p className='mt-2 text-gray-600 line-clamp-2'>
												{strategy.description}
											</p>
											<div className='mt-4 flex flex-wrap gap-2'>
												<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-100 text-zinc-800'>
													{strategy.category?.name || 'Varios'}
												</span>
												{strategy.keywords?.slice(0, 3).map((keyword: string, idx: number) => (
													<span key={idx} className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600'>
														#{keyword}
													</span>
												))}
											</div>
											<div className='mt-4 flex items-center text-sm text-gray-500'>
												<MapPin className='flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400' />
												{strategy.address_marketing?.state || 'Ubicación no especificada'}, {strategy.address_marketing?.country || ''}
											</div>
											<div className='mt-6 flex items-center gap-3'>
												<Button variant='outline' size='sm' className='rounded-full' asChild>
													<Link href={`/strategy/${strategy.id}`}>Ver detalles</Link>
												</Button>
												<Button size='sm' className='rounded-full bg-zinc-900' asChild>
													<Link href={`/strategy/${strategy.id}?tab=contact`}>Contactar</Link>
												</Button>
											</div>
										</div>
									</div>
								</div>
							))}
						</div>
					) : (
						<div className='bg-white rounded-lg shadow-sm p-12 text-center'>
							<div className='h-16 w-16 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-4'>
								<SearchCheck className='h-8 w-8 text-zinc-400' />
							</div>
							<h3 className='text-lg font-medium text-gray-900'>No se encontraron resultados</h3>
							<p className='text-gray-500 mt-2'>Intenta ajustar tus filtros o buscar algo diferente.</p>
							<Button variant='link' className='mt-4' onClick={() => window.location.href = '/search'}>
								Limpiar todos los filtros
							</Button>
						</div>
					)}

					<div className='mt-8 flex justify-center'>
						<nav className='inline-flex rounded-md shadow-sm bg-white border border-zinc-200'>
							<button className='px-4 py-2 text-sm font-medium text-gray-500 hover:bg-zinc-50 border-r border-zinc-200'>
								Anterior
							</button>
							<button className='px-4 py-2 text-sm font-medium bg-zinc-900 text-white'>
								1
							</button>
							<button className='px-4 py-2 text-sm font-medium text-gray-500 hover:bg-zinc-50 border-l border-zinc-200'>
								Siguiente
							</button>
						</nav>
					</div>
				</div>

				{/* Sponsored Ad Section */}
				<div className='hidden xl:block w-64 flex-shrink-0'>
					<div className='sticky top-24'>
						<div className='bg-white rounded-lg shadow-sm overflow-hidden mb-6 border border-zinc-100'>
							<h3 className='text-sm font-medium text-gray-700 p-4 border-b'>Publicidad</h3>
							<RotatingAd />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
