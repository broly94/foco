import Link from 'next/link';
import AdvertBanner from '../advert-banner';

export default function AdvertisementBanners() {
	return (
		<section className='py-14 px-4 sm:px-6 lg:px-8 dark:bg-zinc-900'>
			<div className='max-w-7xl mx-auto'>
				<h2 className='text-3xl text-center md:text-start font-bold mb-8'>Publicidad destacada</h2>
				<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
					<AdvertBanner
						imageUrl='images/home/gratisjpg.jpg'
						title='Impulsa tu negocio'
						description='Crea tu perfil comercial Gratis'
						link='/register'
					/>
					<AdvertBanner imageUrl='images/home/publicite-aqui.jpg' title='Perfil comercial' description='Publicite aquí' link='/search' />
				</div>
				<h3 className='pt-5'>
					Observá toda nuestra publicidad destacada para potenciar tu negocio{' '}
					<Link href='#' className='text-brand-300'>
						Saber mas...
					</Link>
				</h3>
			</div>
		</section>
	);
}
