import Link from 'next/link';

interface AdvertBannerProps {
	imageUrl: string;
	title: string;
	description: string;
	link: string;
}

export default function AdvertBanner({ imageUrl, title, description, link }: AdvertBannerProps) {
	return (
		<Link href={link} className='block'>
			<div className='relative overflow-hidden rounded-lg hover:shadow-zinc-600 dark:hover:shadow-zinc-800 transition-all shadow-lg group'>
				<img
					src={imageUrl || '/placeholder.svg'}
					alt={title}
					className='w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105'
				/>
				<div className='absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6'>
					<h3 className='text-xl font-bold text-white'>{title}</h3>
					<p className='text-white/80 mb-4'>{description}</p>
					<span className='inline-block bg-zinc-500 text-zinc-50 hover:text-zinc-800 px-4 py-2 rounded-md font-medium text-sm hover:bg-gray-100 transition-colors'>
						Más información
					</span>
				</div>
			</div>
		</Link>
	);
}
