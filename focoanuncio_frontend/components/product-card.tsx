'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/use-cart';
import { Check, ShoppingCart, Plus, Minus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface ProductCardProps {
	product: {
		id: string;
		name: string;
		price: number;
		image: string;
		description: string;
		category: string;
	};
	strategyId: string;
}

export default function ProductCard({ product, strategyId }: ProductCardProps) {
	const { addItem, items, updateQuantity } = useCart(strategyId);
	const { toast } = useToast();
	const [isAdded, setIsAdded] = useState(false);
	const [quantity, setQuantity] = useState(1);
	const [isHovered, setIsHovered] = useState(false);
	const [isInCart, setIsInCart] = useState(false);
	const [cartQuantity, setCartQuantity] = useState(1);
	const initialRenderRef = useRef(true);

	// Check if product is already in cart - do this in an effect, not during render
	useEffect(() => {
		if (items && items.length > 0) {
			const existingItem = items.find((item) => item.id === product.id);
			if (existingItem) {
				setIsInCart(true);
				setCartQuantity(existingItem.quantity);
				setQuantity(existingItem.quantity);
			} else {
				setIsInCart(false);
				setCartQuantity(1);
				// Only reset quantity to 1 on initial detection that item is not in cart
				if (initialRenderRef.current) {
					setQuantity(1);
				}
			}
		} else {
			setIsInCart(false);
			setCartQuantity(1);
			// Only reset quantity to 1 on initial detection that item is not in cart
			if (initialRenderRef.current) {
				setQuantity(1);
			}
		}
		initialRenderRef.current = false;
	}, [items, product.id]);

	const handleAddToCart = () => {
		try {
			addItem({
				id: product.id,
				name: product.name,
				price: product.price,
				image: product.image,
				quantity: quantity,
			});

			setIsAdded(true);
			setTimeout(() => setIsAdded(false), 2000);
		} catch (error) {
			console.error('Error adding to cart:', error);
			toast({
				title: 'Error',
				description: 'No se pudo añadir el producto al carrito',
				variant: 'destructive',
			});
		}
	};

	const incrementQuantity = () => {
		setQuantity((prev) => prev + 1);
	};

	const decrementQuantity = () => {
		if (quantity > 1) {
			setQuantity((prev) => prev - 1);
		}
	};

	// Only update cart when quantity changes and item is in cart
	useEffect(() => {
		// Skip the first render
		if (!initialRenderRef.current && isInCart && quantity !== cartQuantity) {
			const timeoutId = setTimeout(() => {
				updateQuantity(product.id, quantity);
			}, 500);

			return () => clearTimeout(timeoutId);
		}
	}, [quantity, isInCart, cartQuantity, product.id, updateQuantity]);

	return (
		<div
			className='bg-white rounded-lg shadow-sm overflow-hidden transform transition-all duration-300 hover:shadow-md hover:-translate-y-1'
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			<div className='relative h-48 overflow-hidden'>
				<img
					src={product.image || '/placeholder.svg'}
					alt={product.name}
					className='w-full h-full object-cover transition-transform duration-500 transform hover:scale-110'
				/>
				{product.category === 'Ofertas' && <Badge className='absolute top-2 right-2 bg-red-500 hover:bg-red-600'>Oferta</Badge>}
				{product.category === 'Nuevos' && <Badge className='absolute top-2 right-2 bg-blue-500 hover:bg-blue-600'>Nuevo</Badge>}
				{product.category === 'Destacados' && <Badge className='absolute top-2 right-2 bg-amber-500 hover:bg-amber-600'>Destacado</Badge>}
			</div>
			<div className='p-4'>
				<h3 className='font-medium text-gray-900 text-lg'>{product.name}</h3>
				<p className='text-sm text-gray-500 mt-1 line-clamp-2'>{product.description}</p>
				<div className='mt-3 flex justify-between items-center'>
					<span className='text-xl font-bold text-emerald-600'>${product.price.toFixed(2)}</span>

					<div
						className={`flex items-center gap-2 transition-opacity duration-300 ${isHovered || isInCart ? 'opacity-100' : 'opacity-100'}`}
					>
						<div className='flex items-center border rounded-md bg-gray-50'>
							<button
								className='p-1 hover:bg-gray-100 text-gray-600 hover:text-gray-800 transition-colors rounded-l-md'
								onClick={decrementQuantity}
								type='button'
							>
								<Minus className='h-4 w-4' />
							</button>
							<span className='px-3 py-1 font-medium'>{quantity}</span>
							<button
								className='p-1 hover:bg-gray-100 text-gray-600 hover:text-gray-800 transition-colors rounded-r-md'
								onClick={incrementQuantity}
								type='button'
							>
								<Plus className='h-4 w-4' />
							</button>
						</div>

						<Button
							onClick={handleAddToCart}
							variant={isAdded ? 'default' : 'default'}
							size='sm'
							className={`transition-all duration-300 ${
								isAdded ? 'bg-green-600 hover:bg-green-700' : 'bg-emerald-600 hover:bg-emerald-700'
							}`}
							type='button'
						>
							{isAdded ? (
								<>
									<Check className='h-4 w-4 mr-1' /> Añadido
								</>
							) : (
								<>
									<ShoppingCart className='h-4 w-4 mr-1' /> {isInCart ? 'Actualizar' : 'Añadir'}
								</>
							)}
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
