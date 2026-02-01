import Link from 'next/link';
import CategoryCard from '@/components/home-categories/CategoryCard';
import SearchBar from '@/components/search-bar';
import AdvertBanner from '@/components/advert-banner';
import { Button } from '@/components/ui/button';
import { CheckCircle2, LocateFixed } from 'lucide-react';
import AuthHandlerGoogleRedirect from '@/app/login/components/auth-handler-google-redirect';
import CurrentLocation from '@/components/current-location';
import AdvertisementBanners from '@/components/advertisement-banners/AdvertisementBanners';
import Benefits from '@/components/benefits/Benefits';
import Hero from '@/components/Hero/Hero';
import PrecingPlans from '@/components/precing-plans/PrecingPlans';

export default function Home() {
	return (
		<>
			{/* Verifica en el home page si la url contiene parametros de logueo con google o no */}
			{/* Esto se hace para verificar que si esta logueado con google para poder guardar los datos en local, asi tambien como el token de inicio de sesión */}
			<AuthHandlerGoogleRedirect />
			<main className='w-full'>
				{/* Hero Section with Search - Full Screen Height */}
				<Hero />
				{/* Advertisement Banners */}
				<AdvertisementBanners />
				{/* Benefits Section */}
				<Benefits />
				{/* Pricing Plans */}
				<PrecingPlans />
				{/* Call to Action */}
				<section className='py-12 bg-emerald-600 px-4 sm:px-6 lg:px-8'>
					<div className='max-w-4xl mx-auto text-center'>
						<h2 className='text-3xl font-bold text-white mb-4'>¿Listo para impulsar tu negocio?</h2>
						<p className='text-xl text-white/90 mb-8'>
							Únete a miles de empresas que ya están aprovechando FocoAnuncio para aumentar su visibilidad y conseguir más clientes.
						</p>
						<div className='flex flex-col sm:flex-row gap-4 justify-center'>
							<Button size='lg' variant='default' className='bg-white text-emerald-600 hover:bg-gray-100' asChild>
								<Link href='/register'>Crear cuenta gratis</Link>
							</Button>
							<Button size='lg' variant='secondary' className='border-white text-white hover:bg-emerald-700' asChild>
								<Link href='/search'>Explorar estrategias</Link>
							</Button>
						</div>
					</div>
				</section>
			</main>
		</>
	);
}
