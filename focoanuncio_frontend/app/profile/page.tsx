'use client';
import Link from 'next/link';
import { memo, MouseEvent, useState } from 'react';
import ProfileForm from '@/app/profile/components/ProfileForm';
import AdressForm from '@/app/profile/components/AdressForm';
import ConfigForm from '@/app/profile/components/ConfigForm';

enum TabItems {
	PROFILE = 'Perfil',
	ADDRESS = 'Dirección',
	CONFIG = 'Configuración',
	LOGOUT = 'Cerrar Sesión',
}

const ItemsLinks = [
	{ title: TabItems.PROFILE, href: '/profile' },
	{ title: TabItems.ADDRESS, href: '/profile/address' },
	{ title: TabItems.CONFIG, href: '/profile/config' },
	{ title: TabItems.LOGOUT, href: '/logout' },
];

const Dashboard = memo(() => {
	const [activeTab, setActiveTab] = useState<string>(TabItems.PROFILE);

	const handleClick = (e: MouseEvent<HTMLAnchorElement>, title: string) => {
		e.preventDefault();
		setActiveTab(title);
	};

	return (
		<div className='min-h-screen bg-zinc-50 dark:bg-zinc-950 pt-10 pb-20'>
			<div className='container max-w-6xl mx-auto px-4'>
				<div className='flex flex-col md:flex-row gap-8'>
					{/* Sidebar */}
					<aside className='w-full md:w-64 space-y-6'>
						<div className='px-2'>
							<h2 className='text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-2'>Ajustes</h2>
							<p className='text-zinc-500 dark:text-zinc-400 text-sm'>Gestiona tu cuenta y preferencias.</p>
						</div>

						<nav className='flex flex-row md:flex-col overflow-x-auto md:overflow-visible pb-2 md:pb-0 gap-1 no-scrollbar'>
							{ItemsLinks.map((item, index) => {
								const isActive = activeTab === item.title;
								return (
									<Link
										key={index}
										href={item.href}
										onClick={(e) => handleClick(e, item.title)}
										className={`flex items-center px-4 py-3 rounded-2xl text-sm font-medium transition-all whitespace-nowrap md:whitespace-normal ${isActive
												? 'bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900 shadow-lg shadow-zinc-200 dark:shadow-none'
												: 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900/50'
											}`}
									>
										{item.title}
									</Link>
								);
							})}
						</nav>
					</aside>

					{/* Contenido principal */}
					<main className='flex-1'>
						<div className='bg-white dark:bg-zinc-900 rounded-[32px] p-8 md:p-10 shadow-xl shadow-zinc-200/50 dark:shadow-none border border-zinc-100 dark:border-zinc-800 min-h-[500px]'>
							<div className='max-w-2xl mx-auto w-full'>
								{activeTab === TabItems.PROFILE && <ProfileForm />}
								{activeTab === TabItems.ADDRESS && <AdressForm />}
								{activeTab === TabItems.CONFIG && <ConfigForm />}
								{activeTab === TabItems.LOGOUT && (
									<div className='text-center py-20'>
										<p className='text-zinc-500 mb-6'>¿Estás seguro que deseas cerrar sesión?</p>
										<Link href='/logout'>
											<button className='bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-red-200 dark:shadow-none'>
												Cerrar Sesión Definitivamente
											</button>
										</Link>
									</div>
								)}
							</div>
						</div>
					</main>
				</div>
			</div>
		</div>
	);
});

export default Dashboard;
