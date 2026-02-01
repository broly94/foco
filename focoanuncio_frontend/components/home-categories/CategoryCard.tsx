import Link from 'next/link';
import type { Category } from '@/lib/types';
import { useCategories } from '@/hooks/use-category';

interface CategoryCardProps {
	category: Category;
}

export default function CategoryCard() {
	const { data: categories, isError, isLoading } = useCategories();
	return (
		<>
			{isLoading && <p>Cargando categorías...</p>}
			{isError && <p>Error al cargar las categorías.</p>}

			{categories &&
				categories.map((category: any) => (
					<div className='flex flex-col mt-4 border border-slate-600 rounded-sm px-5 mx-2 w-full sm:w-60' key={category.id}>
						<h3 className='font-bold'>
							<h3 className='text-center pt-5'>{category.name.toUpperCase()}</h3>
						</h3>
						<ul className='flex flex-col items-center text-center sm:items-start sm:text-start sm:pl-3 gap-2 my-5'>
							{category.subcategories.map((subcategory1: any) => (
								<li key={subcategory1.id}>
									<b className='text-brand-400 text-center w-full'>{subcategory1.name}</b>
									<ul className='flex flex-col gap-2 sm:ml-2 my-2'>
										{subcategory1.subcategories.map((subcategory2: any) => (
											<li key={subcategory2.id} className='text-sm sm:list-disc'>
												{subcategory2.name}
											</li>
										))}
									</ul>
								</li>
							))}
						</ul>
					</div>
				))}
		</>
	);
}
