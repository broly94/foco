'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface CartItem {
	id: string;
	name: string;
	price: number;
	image: string;
	quantity: number;
}

export function useCart(strategyId: string) {
	const [items, setItems] = useState<CartItem[]>([]);
	const [isInitialized, setIsInitialized] = useState(false);
	const { toast } = useToast();
	const isUpdatingRef = useRef(false);

	// Cargar el carrito desde localStorage al iniciar
	useEffect(() => {
		const loadCart = () => {
			try {
				const savedCart = localStorage.getItem(`cart-${strategyId}`);
				if (savedCart) {
					const parsedCart = JSON.parse(savedCart);
					if (Array.isArray(parsedCart)) {
						setItems(parsedCart);
					}
				}
			} catch (error) {
				console.error('Error parsing cart from localStorage:', error);
			} finally {
				setIsInitialized(true);
			}
		};

		loadCart();
	}, [strategyId]);

	// Guardar el carrito en localStorage cuando cambia
	useEffect(() => {
		if (isInitialized && !isUpdatingRef.current) {
			localStorage.setItem(`cart-${strategyId}`, JSON.stringify(items));
		}
	}, [items, strategyId, isInitialized]);

	const addItem = useCallback(
		(item: CartItem) => {
			isUpdatingRef.current = true;
			setItems((prevItems) => {
				const existingItemIndex = prevItems.findIndex((i) => i.id === item.id);

				let newItems;
				if (existingItemIndex >= 0) {
					// Crear una copia del array para modificarlo
					const updatedItems = [...prevItems];
					// Actualizar la cantidad del item existente
					updatedItems[existingItemIndex] = {
						...updatedItems[existingItemIndex],
						quantity: updatedItems[existingItemIndex].quantity + item.quantity,
					};
					newItems = updatedItems;

					setTimeout(() => {
						toast({
							title: 'Carrito actualizado',
							description: `Se actualizó la cantidad de ${item.name} en el carrito.`,
						});
						isUpdatingRef.current = false;
					}, 0);
				} else {
					// Añadir el nuevo item
					newItems = [...prevItems, item];

					setTimeout(() => {
						toast({
							title: 'Producto añadido',
							description: `${item.name} se ha añadido al carrito.`,
						});
						isUpdatingRef.current = false;
					}, 0);
				}

				return newItems;
			});
		},
		[strategyId, toast]
	);

	const removeItem = useCallback(
		(id: string) => {
			isUpdatingRef.current = true;
			setItems((prevItems) => {
				const itemToRemove = prevItems.find((item) => item.id === id);
				const newItems = prevItems.filter((item) => item.id !== id);

				if (itemToRemove) {
					setTimeout(() => {
						toast({
							title: 'Producto eliminado',
							description: `${itemToRemove.name} se ha eliminado del carrito.`,
						});
						isUpdatingRef.current = false;
					}, 0);
				}

				return newItems;
			});
		},
		[toast]
	);

	const updateQuantity = useCallback(
		(id: string, quantity: number) => {
			isUpdatingRef.current = true;
			if (quantity <= 0) {
				removeItem(id);
			} else {
				setItems((prevItems) => {
					const newItems = prevItems.map((item) => (item.id === id ? { ...item, quantity } : item));
					setTimeout(() => {
						isUpdatingRef.current = false;
					}, 0);
					return newItems;
				});
			}
		},
		[removeItem]
	);

	const clearCart = useCallback(() => {
		isUpdatingRef.current = true;
		setItems([]);
		setTimeout(() => {
			toast({
				title: 'Carrito vacío',
				description: 'Se han eliminado todos los productos del carrito.',
			});
			isUpdatingRef.current = false;
		}, 0);
	}, [toast]);

	return {
		items,
		addItem,
		removeItem,
		updateQuantity,
		clearCart,
		isInitialized,
	};
}
