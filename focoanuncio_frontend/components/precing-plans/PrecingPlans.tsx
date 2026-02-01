import { CheckCircle2, X } from 'lucide-react';
import { Button } from '../ui/button';
import Link from 'next/link';
import { AnimatedButton } from '../ui/animated-button';

export default function PrecingPlans() {
	return (
		<section className='py-14 dark:bg-zinc-900 px-4 sm:px-6 lg:px-8'>
			<div className='max-w-7xl mx-auto'>
				<div className='text-center mb-12'>
					<h2 className='text-3xl font-bold uppercase'>Nuestros planes</h2>
					<p className='mt-4 text-xl text-zinc-600 dark:text-zinc-300 max-w-3xl mx-auto'>
						Elige el plan que mejor se adapte a tus necesidades y obtené beneficiós exclusivos
					</p>
				</div>

				<div className='grid md:grid-cols-2 gap-8 max-w-4xl mx-auto'>
					{/* Plan Gratuito */}
					<div className='rounded-xl shadow-sm overflow-hidden bg-zinc-100 dark:bg-zinc-800 border border-zinc-600'>
						<div className='p-8'>
							<h3 className='text-2xl font-bold mb-4'>Plan Gratuito</h3>
							<div className='mb-4'>
								<span className='text-5xl font-bold'>ARS$0</span>
								<span className='text-gray-600'>/mes</span>
							</div>
							<p className='text-gray-600 mb-6'>Perfecto para comenzar a promocionar tu negocio</p>

							<ul className='space-y-3 mb-8'>
								<li className='flex items-start'>
									<CheckCircle2 className='h-5 w-5 text-growth-500 mr-2 flex-shrink-0 mt-0.5' />
									<span>Catálogo de productos (15 max)</span>
								</li>
								<li className='flex items-start'>
									<CheckCircle2 className='h-5 w-5 text-growth-500 mr-2 flex-shrink-0 mt-0.5' />
									<span>Sistema de reserva (20 por mes)</span>
								</li>
								<li className='flex items-start'>
									<CheckCircle2 className='h-5 w-5 text-growth-500 mr-2 flex-shrink-0 mt-0.5' />
									<span>Foto de perfil y banner básicos</span>
								</li>
								<li className='flex items-start'>
									<CheckCircle2 className='h-5 w-5 text-emerald-500 mr-2 flex-shrink-0 mt-0.5' />
									<span>Imagenes en galería (5 max)</span>
								</li>
								<li className='flex items-start'>
									<CheckCircle2 className='h-5 w-5 text-emerald-500 mr-2 flex-shrink-0 mt-0.5' />
									<span>Mapa interactivo</span>
								</li>
								<li className='flex items-start'>
									<CheckCircle2 className='h-5 w-5 text-emerald-500 mr-2 flex-shrink-0 mt-0.5' />
									<span>Soporte (Email)</span>
								</li>
								<li className='flex items-start'>
									<CheckCircle2 className='h-5 w-5 text-emerald-500 mr-2 flex-shrink-0 mt-0.5' />
									<span>Horarios de atención</span>
								</li>
								<li className='flex items-start'>
									<CheckCircle2 className='h-5 w-5 text-emerald-500 mr-2 flex-shrink-0 mt-0.5' />
									<span>Recepción de reseñas y calificaciones</span>
								</li>
								<li className='flex items-start'>
									<CheckCircle2 className='h-5 w-5 text-emerald-500 mr-2 flex-shrink-0 mt-0.5' />
									<span>Alertas de nuevas reseñas</span>
								</li>
								<li className='flex items-start'>
									<CheckCircle2 className='h-5 w-5 text-emerald-500 mr-2 flex-shrink-0 mt-0.5' />
									<span>Publicación de promociones en tu muro (1 por semana)</span>
								</li>
								<li className='flex items-start'>
									<CheckCircle2 className='h-5 w-5 text-emerald-500 mr-2 flex-shrink-0 mt-0.5' />
									<span>Estadisticas de tu perfil (15 días)</span>
								</li>
								<li className='flex items-start'>
									<X className='h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5' />
									<span>Recordatorio a clientes por Whatapps (En sistema de reservas)</span>
								</li>
								<li className='flex items-start'>
									<X className='h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5' />
									<span>Aparecer en los primeros puestos en las busquedas</span>
								</li>
								<li className='flex items-start'>
									<X className='h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5' />
									<span>Estadísticas avanzadas</span>
								</li>
							</ul>

							<Button variant='default' className='w-full' asChild>
								<Link href='/register?plan=free'>Comenzar ahora</Link>
							</Button>
						</div>
					</div>

					{/* Plan Premium */}
					<div className='rounded-xl shadow-sm overflow-hidden  bg-zinc-100 dark:bg-zinc-800 border border-zinc-600 relative'>
						<div className='absolute top-0 right-0 bg-emerald-500 text-white px-4 py-1 rounded-bl-lg font-medium text-sm'>Recomendado</div>
						<div className='p-8'>
							<h3 className='text-2xl font-bold mb-4'>Plan Premium</h3>
							<div className='mb-4'>
								<span className='text-5xl font-bold'>ARS$36.000</span>
								<span className='text-gray-600'>/mes</span>
							</div>
							<p className='text-gray-600 mb-6'>Todo lo que necesitas para maximizar tu visibilidad</p>

							<ul className='space-y-3 mb-8'>
								<li className='flex items-start'>
									<CheckCircle2 className='h-5 w-5 text-emerald-500 mr-2 flex-shrink-0 mt-0.5' />
									<span>Todo lo incluido en el plan gratuito</span>
								</li>
								<li className='flex items-start'>
									<CheckCircle2 className='h-5 w-5 text-emerald-500 mr-2 flex-shrink-0 mt-0.5' />
									<span>Aparecer en los primeros puestos en las busquedas</span>
								</li>
								<li className='flex items-start'>
									<CheckCircle2 className='h-5 w-5 text-emerald-500 mr-2 flex-shrink-0 mt-0.5' />
									<span>Sistema de reserva (ilimitado)</span>
								</li>
								<li className='flex items-start'>
									<CheckCircle2 className='h-5 w-5 text-emerald-500 mr-2 flex-shrink-0 mt-0.5' />
									<span>Slider de imagenes en el banner</span>
								</li>
								<li className='flex items-start'>
									<CheckCircle2 className='h-5 w-5 text-emerald-500 mr-2 flex-shrink-0 mt-0.5' />
									<span>Recordatorio a clientes por Whatapps (En sistema de reservas)</span>
								</li>
								<li className='flex items-start'>
									<CheckCircle2 className='h-5 w-5 text-emerald-500 mr-2 flex-shrink-0 mt-0.5' />
									<span>Estadisticas avanzadas</span>
								</li>
								<li className='flex items-start'>
									<CheckCircle2 className='h-5 w-5 text-emerald-500 mr-2 flex-shrink-0 mt-0.5' />
									<span>Imagenes ilimitadas en la galería</span>
								</li>
								<li className='flex items-start'>
									<CheckCircle2 className='h-5 w-5 text-emerald-500 mr-2 flex-shrink-0 mt-0.5' />
									<span>Soporte prioritario (Whatapp)</span>
								</li>
								<li className='flex items-start'>
									<CheckCircle2 className='h-5 w-5 text-emerald-500 mr-2 flex-shrink-0 mt-0.5' />
									<span>Publicación de promociones en tu muro (ilimitado)</span>
								</li>
							</ul>

							<div className='w-full flex justify-center'>
								<Button className='bg-growth-600 w-full' variant='success'>
									<Link href='/register?plan=premium'>Comenzar ahora</Link>
								</Button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
