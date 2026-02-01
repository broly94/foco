'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, ArrowLeft, ChevronLeft, ChevronRight, Lock, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import ProductCard from '@/components/product-card';
import CartButton from '@/components/cart-button';
import { useCurrentUser } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/hooks/use-cart';
import CartDrawer from '@/components/cart-drawer'; // Declare the CartDrawer variable

// Datos de ejemplo para los productos
const generateProducts = (strategyId: string) => {
	const categories = ['Todos', 'Destacados', 'Ofertas', 'Nuevos'];
	const productTypes = [
		'Camiseta',
		'Pantalón',
		'Zapatos',
		'Gorra',
		'Reloj',
		'Bolso',
		'Chaqueta',
		'Bufanda',
		'Gafas',
		'Calcetines',
		'Pulsera',
		'Anillo',
		'Collar',
		'Pendientes',
		'Cinturón',
		'Cartera',
		'Mochila',
		'Camisa',
		'Jersey',
		'Abrigo',
		'Vestido',
		'Falda',
		'Shorts',
		'Sandalias',
		'Botas',
		'Zapatillas',
		'Sombrero',
		'Guantes',
	];

	return Array.from({ length: 28 }).map((_, i) => ({
		id: `product-${strategyId}-${i}`,
		name: `${productTypes[i % productTypes.length]} ${i + 1}`,
		price: Math.floor(Math.random() * 100) + 10,
		image: `/placeholder.svg?height=200&width=200&text=Producto+${i + 1}`,
		description: `Descripción del producto ${i + 1}. Este es un producto de alta calidad para satisfacer tus necesidades.`,
		category: categories[Math.floor(Math.random() * (categories.length - 1)) + 1],
	}));
};

export default function MarketPage() {
	const params = useParams();
	const strategyId = params.id as string;
	const strategyName = (params.name as string).replace(/-/g, ' ');
	const { data: currentUser, isLoading: isLoadingUser } = useCurrentUser();
	const { toast } = useToast();
	const [searchTerm, setSearchTerm] = useState('');
	const [activeCategory, setActiveCategory] = useState('Todos');
	const [products, setProducts] = useState<any[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isCartOpen, setIsCartOpen] = useState(false); // Corrected initialization
	const { items, isInitialized } = useCart(strategyId); // Removed redundant hook calls

	// Simulamos si la estrategia es premium (tiene características premium habilitadas)
	const isPremium = true;

	// Simulamos si el usuario actual es el creador de la estrategia
	// En una aplicación real, compararías el ID del usuario actual con el creador de la estrategia
	const isCreator = false;

	// Solo mostramos advertencias de premium al creador que no tiene plan premium
	const showPremiumWarning = isCreator && !isPremium;

	// Calculate total items in cart
	const totalItems = isInitialized && items ? items.reduce((sum, item) => sum + item.quantity, 0) : 0;

	// Pagination
	const [currentPage, setCurrentPage] = useState(1);
	const productsPerPage = 12;

	useEffect(() => {
		// Simulamos la carga de datos
		const loadData = async () => {
			setIsLoading(true);
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// Siempre cargamos productos para cualquier visitante
			setProducts(generateProducts(strategyId));
			setIsLoading(false);
		};

		loadData();
	}, [strategyId]);

	// Filter products by search term and category
	const filteredProducts = products.filter(
		(product) =>
			(activeCategory === 'Todos' || product.category === activeCategory) && product.name.toLowerCase().includes(searchTerm.toLowerCase())
	);

	// Calculate pagination
	const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
	const indexOfLastProduct = currentPage * productsPerPage;
	const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
	const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

	// Reset to first page when filters change
	useEffect(() => {
		setCurrentPage(1);
	}, [searchTerm, activeCategory]);

	const handleOpenCart = () => {
		setIsCartOpen(true);
	};

	if (isLoading || isLoadingUser) {
		return (
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
				<div className='flex justify-center items-center h-64'>
					<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500'></div>
				</div>
			</div>
		);
	}

	// Si el usuario es el creador y no tiene plan premium, mostramos un mensaje
	if (showPremiumWarning) {
		return (
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
				<div className='mb-6'>
					<Link href={`/strategy/${strategyId}`} className='text-emerald-600 hover:text-emerald-800 flex items-center'>
						<ArrowLeft className='h-4 w-4 mr-1' />
						Volver a la estrategia
					</Link>
				</div>

				<div className='bg-white rounded-lg shadow-sm p-8 text-center'>
					<div className='w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4'>
						<Lock className='h-8 w-8 text-amber-600' />
					</div>
					<h2 className='text-2xl font-bold text-gray-900 mb-2'>Funcionalidad Premium</h2>
					<p className='text-gray-600 mb-6'>
						Para añadir productos a tu estrategia y habilitar la tienda online, necesitas actualizar a un plan premium.
					</p>
					<div className='flex flex-col sm:flex-row gap-4 justify-center'>
						<Button asChild className='bg-emerald-600 hover:bg-emerald-700'>
							<Link href='/register?plan=premium'>Actualizar a Premium</Link>
						</Button>
						<Button variant='outline' asChild className='border-emerald-200 text-emerald-700 hover:bg-emerald-50'>
							<Link href={`/strategy/${strategyId}`}>
								<ArrowLeft className='h-4 w-4 mr-2' />
								Volver a la estrategia
							</Link>
						</Button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
			{/* Encabezado */}
			<div className='mb-6 flex justify-between items-center'>
				<Link href={`/strategy/${strategyId}`} className='text-emerald-600 hover:text-emerald-800 flex items-center'>
					<ArrowLeft className='h-4 w-4 mr-1' />
					Volver a la estrategia
				</Link>

				{/* Cart summary at the top */}
				<div className='flex items-center'>
					<div className='relative'>
						<Button
							onClick={handleOpenCart}
							variant='outline'
							className='flex items-center gap-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50'
							type='button'
						>
							<ShoppingCart className='h-5 w-5' />
							<span>Ver carrito</span>
							{totalItems > 0 && (
								<span className='absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center'>
									{totalItems}
								</span>
							)}
						</Button>
					</div>
				</div>
			</div>

			<div className='bg-white rounded-lg shadow-sm p-6 mb-8'>
				<div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4'>
					<div>
						<h1 className='text-2xl font-bold text-gray-900'>Tienda de {strategyName}</h1>
						<p className='text-gray-600'>Explora los productos disponibles</p>
					</div>
					<div className='w-full md:w-auto'>
						<div className='relative'>
							<Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
							<Input
								type='text'
								placeholder='Buscar productos...'
								className='pl-10 w-full md:w-64'
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
							/>
						</div>
					</div>
				</div>

				{/* Filtros */}
				<div className='mb-8'>
					<Tabs defaultValue='Todos' onValueChange={setActiveCategory}>
						<TabsList className='w-full md:w-auto'>
							<TabsTrigger value='Todos'>Todos</TabsTrigger>
							<TabsTrigger value='Destacados'>Destacados</TabsTrigger>
							<TabsTrigger value='Ofertas'>Ofertas</TabsTrigger>
							<TabsTrigger value='Nuevos'>Nuevos</TabsTrigger>
						</TabsList>
					</Tabs>
				</div>

				{/* Productos */}
				{currentProducts.length > 0 ? (
					<>
						<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
							{currentProducts.map((product) => (
								<ProductCard key={product.id} product={product} strategyId={strategyId} />
							))}
						</div>

						{/* Pagination */}
						{totalPages > 1 && (
							<div className='flex justify-center mt-8'>
								<div className='flex items-center space-x-2'>
									<Button
										variant='outline'
										size='sm'
										onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
										disabled={currentPage === 1}
										type='button'
									>
										<ChevronLeft className='h-4 w-4' />
									</Button>

									<div className='flex items-center space-x-1'>
										{Array.from({ length: totalPages }).map((_, i) => (
											<Button
												key={i}
												variant={currentPage === i + 1 ? 'default' : 'outline'}
												size='sm'
												onClick={() => setCurrentPage(i + 1)}
												className='w-8 h-8 p-0'
												type='button'
											>
												{i + 1}
											</Button>
										))}
									</div>

									<Button
										variant='outline'
										size='sm'
										onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
										disabled={currentPage === totalPages}
										type='button'
									>
										<ChevronRight className='h-4 w-4' />
									</Button>
								</div>
							</div>
						)}
					</>
				) : (
					<div className='text-center py-12'>
						<div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
							<Search className='h-6 w-6 text-gray-400' />
						</div>
						<h3 className='text-lg font-medium text-gray-900 mb-1'>No se encontraron productos</h3>
						<p className='text-gray-500'>Intenta con otra búsqueda o categoría</p>
					</div>
				)}
			</div>

			{/* Botón del carrito flotante */}
			<CartButton strategyId={strategyId} strategyName={strategyName} position='bottom' />

			{/* Drawer del carrito */}
			{isCartOpen && (
				<CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} strategyId={strategyId} strategyName={strategyName} />
			)}
		</div>
	);
}
