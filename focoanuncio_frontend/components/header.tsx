'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, User, Bell, Map, HomeIcon, SearchIcon, MessageCircle, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/lib/store/auth-store';
import { useRouter } from 'next/navigation';
import UserAvatar from '@/app/login/components/UserAvatar';
import { ThemeToggle } from './them-toggle-button';
import { AccordionItem, AccordionTrigger } from '@radix-ui/react-accordion';
import { Accordion, AccordionContent } from './ui/accordion';
import { AnimatedButton } from './ui/animated-button';
import Logo from './Logo';
import { useMyStrategy } from '@/hooks/use-marketing-strategy';
import { Store, LayoutDashboard } from 'lucide-react';

function MyProfileLink({ mobile }: { mobile?: boolean }) {
	const { data: strategy, isLoading } = useMyStrategy();

	if (isLoading) return null;

	const href = strategy ? '/dashboard' : '/onboarding';
	const text = strategy ? 'Dashboard' : 'Habilitar Perfil Comercial';
	const Icon = strategy ? LayoutDashboard : Store;

	if (mobile) {
		return (
			<Link
				href={href}
				className='block px-3 py-2 rounded-md text-base font-medium text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-900/20'
			>
				<div className='flex items-center gap-x-2'>
					<Icon className='h-5 w-5' />
					{text}
				</div>
			</Link>
		);
	}

	return (
		<Link
			href={href}
			className='flex items-center px-4 py-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors border-b border-zinc-100 dark:border-zinc-800'
		>
			<Icon className='h-4 w-4 mr-2' />
			{text}
		</Link>
	);
}

export default function Header() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const user = useAuthStore((state) => state.user);
	const logout = useAuthStore((state) => state.logout);
	const route = useRouter();

	const handleLogout = () => {
		logout();
		setIsMenuOpen(false);
		route.push('/login');
	};

	return (
		<header className='bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50 border-b border-zinc-200 dark:border-zinc-800 transition-colors duration-300'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				<div className='flex justify-between h-16'>
					<div className='flex'>
						<div className='flex-shrink-0 flex justify-center items-center flex-row'>
							<Link href='/' className='hover:opacity-80 transition-opacity'>
								<Logo />
							</Link>
						</div>
					</div>

					{/* Desktop navigation */}
					<nav className='hidden md:ml-6 lg:flex md:space-x-8'>
						<Link
							href='/'
							className='inline-flex items-center px-1 pt-1 text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 transition-colors border-b-2 border-transparent hover:border-zinc-300 dark:hover:border-zinc-700'
						>
							<HomeIcon className='h-4 w-4 mr-1.5' />
							Inicio
						</Link>
						<Link
							href='/search'
							className='inline-flex items-center px-1 pt-1 text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 transition-colors border-b-2 border-transparent hover:border-zinc-300 dark:hover:border-zinc-700'
						>
							<SearchIcon className='h-4 w-4 mr-1.5' />
							Buscar
						</Link>
						<Link
							href='/maps'
							className='inline-flex items-center px-1 pt-1 text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 transition-colors border-b-2 border-transparent hover:border-zinc-300 dark:hover:border-zinc-700'
						>
							<Map className='h-4 w-4 mr-1.5' />
							Mapas
						</Link>
						<Link
							href='/about'
							className='inline-flex items-center px-1 pt-1 text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 transition-colors border-b-2 border-transparent hover:border-zinc-300 dark:hover:border-zinc-700'
						>
							<MessageCircle className='h-4 w-4 mr-1.5' />
							Contactanos
						</Link>
					</nav>

					<div className='hidden md:ml-6 lg:flex md:items-center space-x-4'>
						<ThemeToggle />
						{user != null ? (
							<>
								<Button variant='ghost' size='icon' className='text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800'>
									<Bell className='h-5 w-5' />
								</Button>
								<div className='relative'>
									<div className='group relative '>
										<Button
											variant='outline'
											className='flex items-center gap-2 border-zinc-200 dark:border-zinc-800 bg-transparent hover:bg-zinc-50 dark:hover:bg-zinc-900'
										>
											<UserAvatar />
											<span className='text-sm font-medium text-zinc-700 dark:text-zinc-300'>{user.name}</span>
											<ChevronDown className='h-4 w-4 text-zinc-400' />
										</Button>
										<div className='absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-zinc-100 dark:border-zinc-800 invisible group-hover:visible transition-all duration-200 opacity-0 group-hover:opacity-100 transform origin-top-right'>
											<div className='py-1'>
												{/* Dashboard Link / Onboarding */}
												<MyProfileLink />

												<Link
													href='/profile'
													className='flex items-center px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800'
												>
													<User className='h-4 w-4 mr-2' />
													Mi Perfil
												</Link>
												<Link
													href='/profile/reservations'
													className='flex items-center px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800'
												>
													<Map className='h-4 w-4 mr-2' />
													Mis Reservas
												</Link>
												<button
													onClick={handleLogout}
													className='w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20'
												>
													<X className='h-4 w-4 mr-2' />
													Cerrar Sesión
												</button>
											</div>
										</div>
									</div>
								</div>
							</>
						) : (
							<div className='flex items-center space-x-3'>
								<Link href='/login'>
									<Button variant='ghost' size='sm' className='text-zinc-600 dark:text-zinc-300'>
										Iniciar Sesión
									</Button>
								</Link>
								<Link href='/register'>
									<Button variant='default' size='sm' className='bg-zinc-900 text-white hover:bg-zinc-800 shadow-lg shadow-zinc-900/10'>
										Registrarse
									</Button>
								</Link>
							</div>
						)}
					</div>

					{/* Mobile menu button */}
					<div className='flex items-center lg:hidden gap-2'>
						<ThemeToggle />
						<button
							onClick={() => setIsMenuOpen(!isMenuOpen)}
							className='inline-flex items-center justify-center p-2 rounded-md text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800'
						>
							<span className='sr-only'>Abrir menú</span>
							{isMenuOpen ? <X className='block h-6 w-6' /> : <Menu className='block h-6 w-6' />}
						</button>
					</div>
				</div>
			</div>

			{/* Mobile menu */}
			{isMenuOpen && (
				<div className='lg:hidden bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800'>
					<div className='pt-2 pb-3 space-y-1 px-4'>
						<Link
							href='/'
							className='block px-3 py-2 rounded-md text-base font-medium text-zinc-700 hover:text-zinc-900 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-900'
							onClick={() => setIsMenuOpen(false)}
						>
							<div className='flex items-center gap-x-2'>
								<HomeIcon className='h-5 w-5' />
								Inicio
							</div>
						</Link>
						<Link
							href='/search'
							className='block px-3 py-2 rounded-md text-base font-medium text-zinc-700 hover:text-zinc-900 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-900'
							onClick={() => setIsMenuOpen(false)}
						>
							<div className='flex items-center gap-x-2'>
								<SearchIcon className='h-5 w-5' />
								Buscar
							</div>
						</Link>
						<Link
							href='/maps'
							className='block px-3 py-2 rounded-md text-base font-medium text-zinc-700 hover:text-zinc-900 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-900'
							onClick={() => setIsMenuOpen(false)}
						>
							<div className='flex items-center gap-x-2'>
								<Map className='h-5 w-5' />
								Mapas
							</div>
						</Link>
						<Link
							href='/about'
							className='block px-3 py-2 rounded-md text-base font-medium text-zinc-700 hover:text-zinc-900 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-900'
							onClick={() => setIsMenuOpen(false)}
						>
							<div className='flex items-center gap-x-2'>
								<MessageCircle className='h-5 w-5' />
								Contactanos
							</div>
						</Link>
					</div>
					<div className='pt-4 pb-4 border-t border-zinc-200 dark:border-zinc-800'>
						{user != null ? (
							<div className='px-4 space-y-3'>
								<div className='flex items-center px-3 mb-4'>
									<div className='flex-shrink-0'>
										<UserAvatar />
									</div>
									<div className='ml-3'>
										<div className='text-base font-medium text-zinc-800 dark:text-white'>{user.name}</div>
										<div className='text-sm font-medium text-zinc-500'>{user.email}</div>
									</div>
								</div>
								<div className='space-y-1'>
									<MyProfileLink mobile />
									<Link
										href='/profile'
										className='block px-3 py-2 rounded-md text-base font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-900'
										onClick={() => setIsMenuOpen(false)}
									>
										Mi Perfil
									</Link>
									<Link
										href='/profile/reservations'
										className='block px-3 py-2 rounded-md text-base font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-900'
										onClick={() => setIsMenuOpen(false)}
									>
										Mis Reservas
									</Link>
									<button
										onClick={handleLogout}
										className='block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10'
									>
										Cerrar Sesión
									</button>
								</div>
							</div>
						) : (
							<div className='flex flex-col space-y-3 px-4 pb-4'>
								<Link href='/login' onClick={() => setIsMenuOpen(false)}>
									<Button variant='outline' size='lg' className='w-full justify-center'>
										Iniciar Sesión
									</Button>
								</Link>
								<Link href='/register' onClick={() => setIsMenuOpen(false)}>
									<Button variant='default' size='lg' className='w-full justify-center bg-zinc-900 text-white'>
										Registrarse
									</Button>
								</Link>
							</div>
						)}
					</div>
				</div>
			)}
		</header>
	);
}
