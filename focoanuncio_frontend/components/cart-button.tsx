'use client';

import { useState, useEffect } from 'react';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/use-cart';
import CartDrawer from '@/components/cart-drawer';

interface CartButtonProps {
	strategyId: string;
	strategyName: string;
	position?: 'top' | 'bottom';
}

export default function CartButton({ strategyId, strategyName, position = 'bottom' }: CartButtonProps) {
	const { items, isInitialized } = useCart(strategyId);
	const [isOpen, setIsOpen] = useState(false);
	const [isAnimating, setIsAnimating] = useState(false);

	// Calculate total items in cart
	const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

	// Animar el botón cuando se añaden productos
	useEffect(() => {
		if (isInitialized && totalItems > 0) {
			setIsAnimating(true);
			const timer = setTimeout(() => setIsAnimating(false), 500);
			return () => clearTimeout(timer);
		}
	}, [totalItems, isInitialized]);

	const positionClasses = position === 'top' ? 'fixed top-20 right-6 z-50' : 'fixed bottom-6 right-6 z-50';

	const handleOpenCart = () => {
		setIsOpen(true);
	};

	if (!isInitialized) return null;

	return (
		<>
			<Button
				onClick={handleOpenCart}
				className={`${positionClasses} rounded-full h-16 w-16 shadow-lg ${
					isAnimating ? 'animate-bounce' : ''
				} bg-emerald-600 hover:bg-emerald-700 transition-all duration-300 transform hover:scale-110`}
				data-cart-button='true'
				type='button'
			>
				<ShoppingCart className='h-7 w-7' />
				{totalItems > 0 && (
					<span className='absolute -top-2 -right-2 bg-red-500 text-white text-sm font-bold rounded-full h-7 w-7 flex items-center justify-center border-2 border-white'>
						{totalItems}
					</span>
				)}
			</Button>
			<CartDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} strategyId={strategyId} strategyName={strategyName} />
		</>
	);
}
