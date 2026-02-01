'use client';

import { useState, useEffect } from 'react';
import { X, Trash2, ShoppingCart, Plus, Minus, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/use-cart';
import { useCurrentUser } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import CheckoutForm from './checkout-form';
import { Badge } from '@/components/ui/badge';

interface CartDrawerProps {
	isOpen: boolean;
	onClose: () => void;
	strategyId: string;
	strategyName: string;
}

export default function CartDrawer({ isOpen, onClose, strategyId, strategyName }: CartDrawerProps) {
	const { items, removeItem, clearCart, updateQuantity, isInitialized } = useCart(strategyId);
	const { data: currentUser } = useCurrentUser();
	const { toast } = useToast();
	const [isCheckingOut, setIsCheckingOut] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Calculate subtotal, tax and total
	const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
	const tax = subtotal * 0.21;
	const total = subtotal + tax;

	// Calculate total items in cart
	const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

	// Close checkout when cart is empty
	useEffect(() => {
		if (isInitialized && items.length === 0 && isCheckingOut) {
			setIsCheckingOut(false);
		}
	}, [items.length, isCheckingOut, isInitialized]);

	const handleCheckout = async (customerData?: any) => {
		setIsSubmitting(true);

		try {
			// Simulamos una llamada a la API
			await new Promise((resolve) => setTimeout(resolve, 1500));

			toast({
				title: '¡Pedido realizado con éxito!',
				description: `Tu ticket ha sido generado y enviado. ${strategyName} se pondrá en contacto contigo pronto.`,
			});

			clearCart();
			setIsCheckingOut(false);
			onClose();
		} catch (error) {
			toast({
				title: 'Error al procesar el pedido',
				description: 'Ha ocurrido un error al generar el ticket. Por favor, inténtalo de nuevo.',
				variant: 'destructive',
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	// Si el drawer no está abierto o no está inicializado, no renderizamos nada
	if (!isOpen || !isInitialized) return null;

	return (
		<div className='fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-end'>
			<div className='bg-white w-full max-w-md h-full flex flex-col animate-slide-in-right'>
				<div className='flex justify-between items-center p-4 border-b bg-emerald-50'>
					<h2 className='text-lg font-semibold flex items-center text-emerald-800'>
						<ShoppingCart className='h-5 w-5 mr-2 text-emerald-600' />
						Carrito de Compras
						{totalItems > 0 && (
							<Badge variant='secondary' className='ml-2 bg-emerald-600 text-white'>
								{totalItems} {totalItems === 1 ? 'item' : 'items'}
							</Badge>
						)}
					</h2>
					<Button
						variant='ghost'
						size='icon'
						onClick={onClose}
						className='text-emerald-600 hover:text-emerald-800 hover:bg-emerald-100'
						type='button'
					>
						<X className='h-5 w-5' />
					</Button>
				</div>

				<div className='flex-1 overflow-y-auto p-4'>
					{isCheckingOut ? (
						<CheckoutForm
							onSubmit={handleCheckout}
							onCancel={() => setIsCheckingOut(false)}
							isSubmitting={isSubmitting}
							currentUser={currentUser}
							cartTotal={total}
							itemCount={totalItems}
						/>
					) : items.length > 0 ? (
						<>
							<div className='space-y-4 mb-6'>
								{items.map((item) => (
									<div key={item.id} className='flex items-center border-b pb-4 hover:bg-gray-50 rounded-lg p-2 transition-colors'>
										<div className='h-20 w-20 bg-gray-100 rounded-md overflow-hidden mr-3 flex-shrink-0 border'>
											<img src={item.image || '/placeholder.svg'} alt={item.name} className='w-full h-full object-cover' />
										</div>
										<div className='flex-1'>
											<h3 className='font-medium text-gray-900'>{item.name}</h3>
											<p className='text-sm text-emerald-600 font-semibold'>${item.price.toFixed(2)}</p>
											<div className='flex items-center mt-2'>
												<button
													className='w-7 h-7 rounded-full border flex items-center justify-center hover:bg-gray-100 transition-colors'
													onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
													type='button'
												>
													<Minus className='h-3 w-3' />
												</button>
												<span className='mx-3 font-medium'>{item.quantity}</span>
												<button
													className='w-7 h-7 rounded-full border flex items-center justify-center hover:bg-gray-100 transition-colors'
													onClick={() => updateQuantity(item.id, item.quantity + 1)}
													type='button'
												>
													<Plus className='h-3 w-3' />
												</button>
											</div>
										</div>
										<div className='text-right'>
											<p className='font-medium text-gray-900'>${(item.price * item.quantity).toFixed(2)}</p>
											<Button
												variant='ghost'
												size='sm'
												className='text-red-500 hover:text-red-700 hover:bg-red-50 p-1 h-auto mt-2 rounded-full'
												onClick={() => removeItem(item.id)}
												type='button'
											>
												<Trash2 className='h-4 w-4' />
											</Button>
										</div>
									</div>
								))}
							</div>

							<div className='border-t pt-4 bg-gray-50 p-4 rounded-lg'>
								<div className='flex justify-between mb-2'>
									<span className='text-gray-600'>Subtotal</span>
									<span className='font-medium'>${subtotal.toFixed(2)}</span>
								</div>
								<div className='flex justify-between mb-4'>
									<span className='text-gray-600'>IVA (21%)</span>
									<span className='font-medium'>${tax.toFixed(2)}</span>
								</div>
								<div className='flex justify-between text-lg font-bold text-emerald-800 border-t pt-2'>
									<span>Total</span>
									<span>${total.toFixed(2)}</span>
								</div>
							</div>
						</>
					) : (
						<div className='flex flex-col items-center justify-center h-full text-center'>
							<div className='bg-gray-100 p-6 rounded-full mb-4'>
								<ShoppingCart className='h-16 w-16 text-gray-400' />
							</div>
							<h3 className='text-xl font-medium text-gray-900 mb-2'>Tu carrito está vacío</h3>
							<p className='text-gray-500 mb-6 max-w-xs'>Añade algunos productos para continuar con tu compra</p>
							<Button onClick={onClose} className='bg-emerald-600 hover:bg-emerald-700' type='button'>
								Explorar productos
							</Button>
						</div>
					)}
				</div>

				{items.length > 0 && !isCheckingOut && (
					<div className='p-4 border-t bg-gray-50'>
						<Button
							className='w-full bg-emerald-600 hover:bg-emerald-700 mb-3 flex items-center justify-center'
							onClick={() => setIsCheckingOut(true)}
							type='button'
						>
							<ShoppingBag className='mr-2 h-5 w-5' />
							Generar Ticket
						</Button>
						<Button variant='outline' className='w-full border-red-300 text-red-600 hover:bg-red-50' onClick={clearCart} type='button'>
							Vaciar Carrito
						</Button>
					</div>
				)}
			</div>
		</div>
	);
}
