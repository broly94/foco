'use client';

import type React from 'react';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, SearchCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLocationSuggestions } from '@/hooks/use-location';
import CurrentLocation from './current-location';

export default function SearchBar() {
	const router = useRouter();
	const [activeTab, setActiveTab] = useState<'classic' | 'natural'>('classic');
	const [keyword, setKeyword] = useState('');
	const [location, setLocation] = useState('');
	const [naturalQuery, setNaturalQuery] = useState('');
	const [showSuggestions, setShowSuggestions] = useState(false);
	const locationInputRef = useRef<HTMLInputElement>(null);
	const suggestionsRef = useRef<HTMLDivElement>(null);
	const ubicacionContainerRef = useRef<HTMLDivElement>(null);

	// Obtener sugerencias de ubicación
	const { data: suggestions, isLoading } = useLocationSuggestions(location);

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		const params = new URLSearchParams();

		if (activeTab === 'classic') {
			if (keyword) params.append('keyword', keyword);
			if (location) params.append('location', location);
		} else {
			if (naturalQuery) params.append('q', naturalQuery);
			params.append('mode', 'natural');
		}

		router.push(`/search?${params.toString()}`);
	};

	// Cerrar las sugerencias cuando se hace clic fuera
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				suggestionsRef.current &&
				!suggestionsRef.current.contains(event.target as Node) &&
				locationInputRef.current &&
				!locationInputRef.current.contains(event.target as Node)
			) {
				setShowSuggestions(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	// Seleccionar una sugerencia
	const handleSelectSuggestion = (province: string, locality: string) => {
		setLocation(`${province}, ${locality}`);
		setShowSuggestions(false);
	};

	return (
		<div className='w-full max-w-4xl mx-auto'>
			{/* Tabs Header */}
			<div className='flex justify-center mb-4'>
				<div className='bg-zinc-100 p-1 rounded-full inline-flex dark:bg-zinc-800'>
					<button
						onClick={() => setActiveTab('classic')}
						className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${activeTab === 'classic'
							? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-950 dark:text-zinc-50'
							: 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
							}`}
					>
						Búsqueda Clásica
					</button>
					<button
						onClick={() => setActiveTab('natural')}
						className={`px-6 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'natural'
							? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-950 dark:text-zinc-50'
							: 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
							}`}
					>
						<span>Lenguaje Natural</span>
						<span className='px-1.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-bold dark:bg-indigo-900/30 dark:text-indigo-400'>BETA</span>
					</button>
				</div>
			</div>

			<form onSubmit={handleSearch} className='relative'>
				<div className='bg-white dark:bg-zinc-900 p-2 rounded-2xl shadow-xl border border-zinc-100 dark:border-zinc-800 transition-all duration-300'>
					{activeTab === 'classic' ? (
						<div className='flex flex-col md:flex-row items-center gap-2'>
							{/* Keyword Input */}
							<div className='flex-1 w-full relative flex items-center px-4'>
								<Search className='h-5 w-5 text-zinc-400 mr-3' />
								<Input
									className='border-none shadow-none focus-visible:ring-0 px-0 h-12 text-base bg-transparent'
									type='text'
									placeholder='¿Qué estás buscando? (ej. Plomero, Abogado)'
									value={keyword}
									onChange={(e) => setKeyword(e.target.value)}
								/>
								<div className='hidden md:block h-8 w-[1px] bg-zinc-200 mx-2 dark:bg-zinc-700'></div>
							</div>

							{/* Location Input */}
							<div className='flex-1 w-full relative flex items-center px-4' ref={ubicacionContainerRef}>
								<MapPin className='h-5 w-5 text-zinc-400 mr-3' />
								<div className='flex-1 relative'>
									<Input
										className='border-none shadow-none focus-visible:ring-0 px-0 h-12 text-base bg-transparent w-full'
										ref={locationInputRef}
										type='text'
										placeholder='Ubicación (Barrio, Ciudad)'
										value={location}
										onChange={(e) => {
											setLocation(e.target.value);
											setShowSuggestions(true);
										}}
										onFocus={() => setShowSuggestions(true)}
									/>
								</div>
							</div>

							{/* Search Button */}
							<Button
								type='submit'
								size='lg'
								className='w-full md:w-auto rounded-xl px-8 h-12 bg-zinc-900 text-white hover:bg-zinc-800 shadow-lg shadow-zinc-900/10'
							>
								Buscar
							</Button>
						</div>
					) : (
						<div className='flex flex-col md:flex-row items-center gap-2 p-1'>
							<div className='flex-1 w-full relative flex items-center px-4'>
								<div className='h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3'>
									<span className='text-indigo-600 text-xs font-bold'>✨</span>
								</div>
								<Input
									className='border-none shadow-none focus-visible:ring-0 px-0 h-12 text-base bg-transparent'
									type='text'
									placeholder='Ej: "Necesito un electricista urgente en Palermo para arreglar un enchufe"'
									value={naturalQuery}
									onChange={(e) => setNaturalQuery(e.target.value)}
									autoFocus
								/>
							</div>
							<Button
								type='submit'
								size='lg'
								className='w-full md:w-auto rounded-xl px-8 h-12 bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 border-none'
							>
								<span className='mr-2'>✨</span> Generar
							</Button>
						</div>
					)}
				</div>

				{/* Sugerencias desplegables */}
				{showSuggestions && activeTab === 'classic' && (
					<div
						ref={suggestionsRef}
						className='absolute z-50 left-0 right-0 top-full mt-2 bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden max-w-sm ml-auto mr-auto md:max-w-none md:ml-[50%] md:w-[40%]'
					>
						{/* Opción estratégica: Usar mi ubicación */}
						<div className='p-2 border-b border-zinc-50 dark:border-zinc-800'>
							<CurrentLocation variant='text' onLocationFound={(loc) => {
								setLocation(loc);
								setShowSuggestions(false);
							}} />
						</div>

						{isLoading ? (
							<div className='p-4 text-center text-zinc-500 text-sm'>Buscando ubicaciones...</div>
						) : suggestions && suggestions.length > 0 ? (
							<div className='max-h-60 overflow-y-auto p-1'>
								{suggestions.map((suggestion, index) => (
									<div
										key={index}
										className='flex items-center gap-3 p-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 rounded-lg cursor-pointer transition-colors'
										onClick={() => handleSelectSuggestion(suggestion.province, suggestion.locality)}
									>
										<div className='h-8 w-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center flex-shrink-0'>
											<MapPin className='h-4 w-4 text-zinc-500' />
										</div>
										<div className='flex flex-col overflow-hidden'>
											<div className='font-medium text-zinc-900 dark:text-zinc-100 text-sm truncate'>{suggestion.locality}</div>
											<div className='text-xs text-zinc-500 truncate'>{suggestion.province}</div>
										</div>
									</div>
								))}
							</div>
						) : (
							location && location.length >= 3 && (
								<div className='p-4 text-center text-zinc-500 text-sm'>
									No encontramos esa ubicación
								</div>
							)
						)}
					</div>
				)}
			</form>
		</div>
	);
}
