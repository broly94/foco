import Link from 'next/link';
import { MapPin, Clock, Globe, Phone, Star, Share2, Heart, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ReservationSystem from '@/components/reservation-system';
import { Badge } from '@/components/ui/badge';

export default function StrategyPage({ params }: { params: { id: string } }) {
	// In a real app, you would fetch the strategy data based on the ID
	const strategyId = params.id;

	// En una aplicación real, usarías searchParams para determinar la pestaña activa
	const defaultTab = 'description';

	// Simulamos un nombre para la estrategia (para usar en la URL del market)
	const strategyName = `Empresa-Ejemplo-${strategyId}`;

	// Simulamos si la estrategia es premium (tiene características premium habilitadas)
	const isPremium = true;

	// Simulamos si el usuario actual es el creador de la estrategia
	// En una aplicación real, compararías el ID del usuario actual con el creador de la estrategia
	const isCreator = false;

	// Solo mostramos advertencias de premium al creador que no tiene plan premium
	const showPremiumWarning = isCreator && !isPremium;

	return (
		<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
			<div className='mb-6'>
				<Link href='/search' className='text-emerald-600 hover:text-emerald-800'>
					← Volver a resultados
				</Link>
			</div>

			{/* Banner */}
			<div className='relative h-64 md:h-80 lg:h-96 rounded-xl overflow-hidden mb-8'>
				<img src='/placeholder.svg?height=400&width=1200&text=Banner+Image' alt='Strategy banner' className='w-full h-full object-cover' />
				<div className='absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6'>
					<div className='flex items-center mb-2'>
						<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 mr-2'>
							Marketing Digital
						</span>
						<div className='flex items-center text-white'>
							<Star className='w-4 h-4 text-yellow-400 mr-1' fill='currentColor' />
							<span>4.8</span>
							<span className='mx-1'>•</span>
							<span>42 reseñas</span>
						</div>
					</div>
					<div className='flex items-center justify-between'>
						<h1 className='text-3xl font-bold text-white'>Estrategia de Marketing #{strategyId}</h1>
						{isPremium && (
							<Badge variant='secondary' className='bg-yellow-500 text-white hover:bg-yellow-600'>
								Premium
							</Badge>
						)}
					</div>
				</div>
			</div>

			<div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
				<div className='lg:col-span-2'>
					<div className='bg-white rounded-xl shadow-sm p-6 mb-8'>
						<div className='flex items-center mb-6'>
							<div className='w-16 h-16 rounded-full overflow-hidden bg-gray-200 mr-4'>
								<img src='/placeholder.svg?height=64&width=64&text=Profile' alt='Profile' className='w-full h-full object-cover' />
							</div>
							<div>
								<h2 className='text-xl font-semibold'>Empresa Ejemplo S.A.</h2>
								<p className='text-gray-600'>Miembro desde Enero 2023</p>
							</div>
						</div>

						<Tabs defaultValue={defaultTab}>
							<TabsList className='grid w-full grid-cols-4'>
								<TabsTrigger value='description'>Descripción</TabsTrigger>
								<TabsTrigger value='reservations'>Reservas</TabsTrigger>
								<TabsTrigger value='products'>Productos</TabsTrigger>
								<TabsTrigger value='contact'>Contacto</TabsTrigger>
							</TabsList>

							<TabsContent value='description' className='pt-6'>
								<h3 className='text-lg font-semibold mb-4'>Acerca de esta estrategia</h3>
								<p className='text-gray-700 mb-6'>
									Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna
									aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis
									aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
								</p>

								<div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
									<div className='border rounded-lg p-4 hover:shadow-md transition-shadow'>
										<h4 className='font-medium mb-2 flex items-center text-emerald-700'>
											<Clock className='w-5 h-5 text-emerald-500 mr-2' />
											Horario de atención
										</h4>
										<div className='flex items-center text-gray-700'>
											<Clock className='w-4 h-4 text-gray-400 mr-2' />
											<span>Lunes a Viernes: 9:00 - 18:00</span>
										</div>
										<div className='flex items-center text-gray-700 mt-1'>
											<Clock className='w-4 h-4 text-gray-400 mr-2' />
											<span>Sábados: 10:00 - 14:00</span>
										</div>
									</div>

									<div className='border rounded-lg p-4 hover:shadow-md transition-shadow'>
										<h4 className='font-medium mb-2 flex items-center text-emerald-700'>
											<MapPin className='w-5 h-5 text-emerald-500 mr-2' />
											Ubicación
										</h4>
										<div className='flex items-center text-gray-700'>
											<MapPin className='w-4 h-4 text-gray-400 mr-2' />
											<span>Av. Corrientes 1234, Buenos Aires, Argentina</span>
										</div>
										<div className='mt-2 h-32 bg-gray-200 rounded'>
											<img
												src='/placeholder.svg?height=128&width=300&text=Mapa'
												alt='Ubicación en mapa'
												className='w-full h-full object-cover rounded'
											/>
										</div>
									</div>
								</div>

								<h3 className='text-lg font-semibold mb-4 flex items-center'>
									<span className='bg-emerald-100 p-1 rounded-full mr-2'>
										<svg
											xmlns='http://www.w3.org/2000/svg'
											className='h-5 w-5 text-emerald-600'
											fill='none'
											viewBox='0 0 24 24'
											stroke='currentColor'
										>
											<path
												strokeLinecap='round'
												strokeLinejoin='round'
												strokeWidth={2}
												d='M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z'
											/>
										</svg>
									</span>
									Palabras clave
								</h3>
								<div className='flex flex-wrap gap-2 mb-6'>
									{Array.from({ length: 10 }).map((_, i) => (
										<span
											key={i}
											className='inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors cursor-pointer'
										>
											Keyword #{i + 1}
										</span>
									))}
								</div>

								<h3 className='text-lg font-semibold mb-4 flex items-center'>
									<span className='bg-emerald-100 p-1 rounded-full mr-2'>
										<svg
											xmlns='http://www.w3.org/2000/svg'
											className='h-5 w-5 text-emerald-600'
											fill='none'
											viewBox='0 0 24 24'
											stroke='currentColor'
										>
											<path
												strokeLinecap='round'
												strokeLinejoin='round'
												strokeWidth={2}
												d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
											/>
										</svg>
									</span>
									Galería
								</h3>
								<div className='grid grid-cols-2 md:grid-cols-3 gap-4 mb-6'>
									{Array.from({ length: 6 }).map((_, i) => (
										<div
											key={i}
											className='aspect-square rounded-lg overflow-hidden bg-gray-200 hover:shadow-lg transition-all duration-300 transform hover:scale-105 cursor-pointer'
										>
											<img
												src={`/placeholder.svg?height=200&width=200&text=Image+${i + 1}`}
												alt={`Gallery image ${i + 1}`}
												className='w-full h-full object-cover'
											/>
										</div>
									))}
								</div>
							</TabsContent>

							<TabsContent value='reservations' className='pt-6'>
								{isPremium ? (
									<ReservationSystem strategyId={strategyId} />
								) : (
									<div className='bg-amber-50 border border-amber-200 rounded-lg p-6 text-center'>
										<div className='w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4'>
											<span className='text-amber-600 text-2xl'>🔒</span>
										</div>
										<h3 className='text-lg font-medium text-amber-800 mb-2'>Funcionalidad no disponible</h3>
										<p className='text-amber-700 mb-4'>
											{isCreator
												? 'Para habilitar el sistema de reservas en tu estrategia, actualiza a un plan premium.'
												: 'El creador de esta estrategia no ha habilitado el sistema de reservas.'}
										</p>
										{isCreator && (
											<Button asChild>
												<Link href='/register?plan=premium'>Actualizar a Premium</Link>
											</Button>
										)}
									</div>
								)}
							</TabsContent>

							<TabsContent value='products' className='pt-6'>
								<div className='flex items-center justify-between mb-6'>
									<h3 className='text-lg font-semibold'>Productos disponibles</h3>
									<Button asChild>
										<Link href={`/strategy/${strategyId}/${strategyName}/market`}>
											<ShoppingCart className='h-4 w-4 mr-2' />
											Ver tienda completa
										</Link>
									</Button>
								</div>

								{isPremium ? (
									<>
										<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6'>
											{Array.from({ length: 3 }).map((_, i) => (
												<div key={i} className='border rounded-lg overflow-hidden hover:shadow-md transition-shadow'>
													<div className='h-40 bg-gray-200 relative'>
														<img
															src={`/placeholder.svg?height=160&width=300&text=Producto+${i + 1}`}
															alt={`Producto ${i + 1}`}
															className='w-full h-full object-cover'
														/>
														{i === 0 && <Badge className='absolute top-2 right-2 bg-red-500'>Oferta</Badge>}
													</div>
													<div className='p-4'>
														<h4 className='font-medium'>Producto #{i + 1}</h4>
														<p className='text-sm text-gray-500 mb-2'>Descripción breve del producto y sus características principales.</p>
														<div className='flex justify-between items-center'>
															<span className='font-bold text-emerald-600'>${(19.99 + i * 10).toFixed(2)}</span>
															<Button size='sm' className='bg-emerald-600 hover:bg-emerald-700'>
																<ShoppingCart className='h-3 w-3 mr-1' />
																Añadir
															</Button>
														</div>
													</div>
												</div>
											))}
										</div>

										<div className='text-center'>
											<Button variant='outline' asChild className='border-emerald-200 text-emerald-700 hover:bg-emerald-50'>
												<Link href={`/strategy/${strategyId}/${strategyName}/market`}>Ver todos los productos</Link>
											</Button>
										</div>
									</>
								) : (
									<div className='bg-amber-50 border border-amber-200 rounded-lg p-6 text-center'>
										<div className='w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4'>
											<span className='text-amber-600 text-2xl'>🔒</span>
										</div>
										<h3 className='text-lg font-medium text-amber-800 mb-2'>Funcionalidad no disponible</h3>
										<p className='text-amber-700 mb-4'>
											{isCreator
												? 'Para habilitar la tienda de productos en tu estrategia, actualiza a un plan premium.'
												: 'El creador de esta estrategia no ha habilitado la tienda de productos.'}
										</p>
										{isCreator && (
											<Button asChild>
												<Link href='/register?plan=premium'>Actualizar a Premium</Link>
											</Button>
										)}
									</div>
								)}
							</TabsContent>

							<TabsContent value='contact' className='pt-6'>
								<div className='space-y-4'>
									<div className='flex items-center'>
										<MapPin className='w-5 h-5 text-emerald-500 mr-3' />
										<span className='text-gray-700'>Av. Corrientes 1234, Buenos Aires, Argentina</span>
									</div>
									<div className='flex items-center'>
										<Phone className='w-5 h-5 text-emerald-500 mr-3' />
										<span className='text-gray-700'>+54 11 1234-5678</span>
									</div>
									<div className='flex items-center'>
										<Globe className='w-5 h-5 text-emerald-500 mr-3' />
										<a href='#' className='text-emerald-600 hover:underline'>
											www.ejemplo.com
										</a>
									</div>
									<div className='flex items-center'>
										<Clock className='w-5 h-5 text-emerald-500 mr-3' />
										<span className='text-gray-700'>Lunes a Viernes: 9:00 - 18:00</span>
									</div>
								</div>

								<div className='mt-6'>
									<h3 className='text-lg font-semibold mb-4'>Enviar mensaje</h3>
									<ContactForm strategyId={strategyId} />
								</div>
							</TabsContent>
						</Tabs>
					</div>

					{/* Reviews section moved outside tabs */}
					<div className='bg-white rounded-xl shadow-sm p-6 mb-8'>
						<div className='flex items-center justify-between mb-6'>
							<h3 className='text-lg font-semibold flex items-center'>
								<Star className='h-5 w-5 text-yellow-400 mr-2' fill='currentColor' />
								Reseñas de clientes
							</h3>
							<Button className='bg-emerald-600 hover:bg-emerald-700'>Escribir reseña</Button>
						</div>

						<div className='space-y-6'>
							{Array.from({ length: 3 }).map((_, i) => (
								<div key={i} className='border-b border-gray-200 pb-6 last:border-0 hover:bg-gray-50 p-3 rounded-lg transition-colors'>
									<div className='flex items-start'>
										<div className='w-10 h-10 rounded-full overflow-hidden bg-gray-200 mr-4'>
											<img
												src={`/placeholder.svg?height=40&width=40&text=User+${i + 1}`}
												alt={`User ${i + 1}`}
												className='w-full h-full object-cover'
											/>
										</div>
										<div className='flex-1'>
											<div className='flex justify-between items-center mb-1'>
												<h4 className='font-medium'>Usuario #{i + 1}</h4>
												<span className='text-sm text-gray-500'>
													hace {i + 1} {i === 0 ? 'día' : 'días'}
												</span>
											</div>
											<div className='flex items-center mb-2'>
												{Array.from({ length: 5 }).map((_, j) => (
													<Star
														key={j}
														className={`w-4 h-4 ${j < 5 - (i % 2) ? 'text-yellow-400' : 'text-gray-300'}`}
														fill='currentColor'
													/>
												))}
											</div>
											<p className='text-gray-700'>
												Excelente estrategia de marketing. Nos ayudó a aumentar nuestras ventas en un 30% en el primer mes. Recomendado.
											</p>
										</div>
									</div>
								</div>
							))}
						</div>

						<Button variant='outline' className='w-full mt-4 border-emerald-200 text-emerald-700 hover:bg-emerald-50'>
							Ver más reseñas
						</Button>
					</div>
				</div>

				<div className='lg:col-span-1'>
					<div className='bg-white rounded-xl shadow-sm p-6 mb-6 sticky top-24'>
						<div className='flex justify-between items-center mb-6'>
							<Button variant='outline' className='flex items-center gap-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50'>
								<Share2 className='w-4 h-4' />
								Compartir
							</Button>
							<Button variant='outline' className='flex items-center gap-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50'>
								<Heart className='w-4 h-4' />
								Guardar
							</Button>
						</div>

						<div className='border-t border-b border-gray-200 py-4 mb-6'>
							<div className='flex items-center justify-between mb-2'>
								<span className='text-gray-600'>Seguidores</span>
								<span className='font-semibold'>1,234</span>
							</div>
							<div className='flex items-center justify-between'>
								<span className='text-gray-600'>Valoración</span>
								<div className='flex items-center'>
									<div className='flex'>
										{Array.from({ length: 5 }).map((_, i) => (
											<Star key={i} className={`w-4 h-4 ${i < 4 ? 'text-yellow-400' : 'text-gray-300'}`} fill='currentColor' />
										))}
									</div>
									<span className='ml-1 text-sm text-gray-600'>4.8</span>
								</div>
							</div>
						</div>

						<Button className='w-full mb-3 bg-emerald-600 hover:bg-emerald-700'>Contactar</Button>
						<Button variant='outline' className='w-full mb-3 border-emerald-200 text-emerald-700 hover:bg-emerald-50'>
							Seguir
						</Button>
						<Button
							variant='outline'
							className='w-full flex items-center justify-center border-emerald-200 text-emerald-700 hover:bg-emerald-50'
							asChild
						>
							<Link href={`/strategy/${strategyId}/${strategyName}/market`}>
								<ShoppingCart className='h-4 w-4 mr-2' />
								Ver productos
							</Link>
						</Button>

						<div className='mt-6'>
							<h3 className='text-sm font-medium text-gray-700 mb-3'>Redes sociales</h3>
							<div className='flex space-x-3'>
								<a
									href='#'
									className='w-8 h-8 flex items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors'
								>
									<svg className='w-4 h-4' fill='currentColor' viewBox='0 0 24 24'>
										<path d='M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z' />
									</svg>
								</a>
								<a
									href='#'
									className='w-8 h-8 flex items-center justify-center rounded-full bg-pink-600 text-white hover:bg-pink-700 transition-colors'
								>
									<svg className='w-4 h-4' fill='currentColor' viewBox='0 0 24 24'>
										<path d='M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z' />
									</svg>
								</a>
								<a
									href='#'
									className='w-8 h-8 flex items-center justify-center rounded-full bg-sky-500 text-white hover:bg-sky-600 transition-colors'
								>
									<svg className='w-4 h-4' fill='currentColor' viewBox='0 0 24 24'>
										<path d='M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84' />
									</svg>
								</a>
								<a
									href='#'
									className='w-8 h-8 flex items-center justify-center rounded-full bg-blue-700 text-white hover:bg-blue-800 transition-colors'
								>
									<svg className='w-4 h-4' fill='currentColor' viewBox='0 0 24 24'>
										<path d='M19 3a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h14m-.5 15.5v-5.3a3.26 3.26 0 00-3.26-3.26c-.85 0-1.84.114-2.294.114V10h-2.628v8.5H7.204v-5.3c0-.13.016-.803.114-1.222.427-1.818 2.07-1.756 2.07-1.756 1.057 0 1.712.802 1.712 1.756V18.5h2.61z' />
									</svg>
								</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

function ContactForm({ strategyId }: { strategyId: string }) {
	return (
		<form className='space-y-4'>
			<div>
				<label htmlFor='name' className='block text-sm font-medium text-gray-700 mb-1'>
					Nombre
				</label>
				<input
					type='text'
					id='name'
					className='w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
				/>
			</div>
			<div>
				<label htmlFor='email' className='block text-sm font-medium text-gray-700 mb-1'>
					Email
				</label>
				<input
					type='email'
					id='email'
					className='w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
				/>
			</div>
			<div>
				<label htmlFor='message' className='block text-sm font-medium text-gray-700 mb-1'>
					Mensaje
				</label>
				<textarea
					id='message'
					rows={4}
					className='w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
				></textarea>
			</div>
			<Button className='w-full bg-emerald-600 hover:bg-emerald-700'>Enviar mensaje</Button>
		</form>
	);
}
