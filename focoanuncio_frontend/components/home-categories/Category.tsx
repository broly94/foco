'use client';
import CategoryCard from '@/components/home-categories/CategoryCard';

export default function Category() {
	return (
		<section className='flex flex-col items-center py-12 bg-zinc-50 dark:bg-zinc-900 px-2'>
			<h2 className='text-3xl text-center font-bold uppercase mb-8'>Algunas categorías disponibles</h2>
			<div className='flex flex-row flex-wrap justify-center gap-3'>
				<CategoryCard />
			</div>
		</section>
	);
}
