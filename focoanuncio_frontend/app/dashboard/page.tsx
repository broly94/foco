'use client';

import { useMyStrategy } from '@/hooks/use-marketing-strategy';
import {
	Plus,
	Store,
	TrendingUp,
	Users,
	Star,
	ArrowUpRight,
	Settings,
	Image as ImageIcon
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
	const { data: strategy, isLoading } = useMyStrategy();

	if (isLoading) {
		return (
			<div className="space-y-8 animate-pulse">
				<div className="h-10 bg-zinc-200 dark:bg-zinc-800 w-1/4 rounded-lg"></div>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					{[1, 2, 3].map(i => <div key={i} className="h-32 bg-zinc-200 dark:bg-zinc-800 rounded-3xl"></div>)}
				</div>
			</div>
		);
	}

	if (!strategy) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
				<div className="bg-indigo-100 dark:bg-indigo-900/30 p-6 rounded-full mb-6">
					<Store className="h-12 w-12 text-indigo-600 dark:text-indigo-400" />
				</div>
				<h2 className="text-2xl font-bold mb-2">Aún no tienes un perfil comercial</h2>
				<p className="text-zinc-500 max-w-md mb-8">
					Habilita tu perfil para empezar a publicar tus servicios y llegar a miles de clientes.
				</p>
				<Button asChild size="lg" className="bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900 rounded-xl">
					<Link href="/onboarding">Comenzar Onboarding</Link>
				</Button>
			</div>
		);
	}

	return (
		<div className="space-y-8">
			{/* Welcome Header */}
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
				<div>
					<h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">¡Hola, {strategy.title}!</h1>
					<p className="text-zinc-500">Bienvenido de nuevo a tu panel de control comercial.</p>
				</div>
				<div className="flex gap-3">
					<Button variant="outline" className="rounded-xl" asChild>
						<Link href={`/strategy/${strategy.id}`} target="_blank">
							Ver perfil público <ArrowUpRight className="h-4 w-4 ml-2" />
						</Link>
					</Button>
					<Button className="bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900 rounded-xl">
						<Plus className="h-4 w-4 mr-2" /> Nueva Publicación
					</Button>
				</div>
			</div>

			{/* Stats Grid */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<StatCard
					title="Visitas totales"
					value="1,284"
					trend="+12% este mes"
					icon={Users}
					color="bg-blue-500"
				/>
				<StatCard
					title="Rating Promedio"
					value="4.8"
					trend="84 reseñas"
					icon={Star}
					color="bg-yellow-500"
				/>
				<StatCard
					title="Conversiones"
					value="45"
					trend="+5 hoy"
					icon={TrendingUp}
					color="bg-emerald-500"
				/>
			</div>

			{/* Profile Overview */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				<div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
					<div className="flex items-center justify-between mb-6">
						<h3 className="text-xl font-bold">Información del Perfil</h3>
						<Button variant="ghost" size="icon" asChild>
							<Link href="/dashboard/profile">
								<Settings className="h-5 w-5" />
							</Link>
						</Button>
					</div>
					<div className="space-y-4">
						<InfoItem label="Categoría" value={strategy.category?.name} />
						<InfoItem label="Subcategoría" value={strategy.sub_category_01?.name} />
						<InfoItem label="Teléfono comercial" value={strategy.phone || 'Usando teléfono de perfil'} />
						<InfoItem label="Website" value={strategy.website || 'No configurado'} />
					</div>
				</div>

				<div className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 p-8 rounded-3xl shadow-xl flex flex-col justify-between">
					<div>
						<h3 className="text-xl font-bold mb-2">Sube el nivel de tu perfil</h3>
						<p className="text-zinc-400 dark:text-zinc-500 text-sm mb-6">
							Los perfiles con imágenes de alta calidad reciben 4 veces más contactos.
						</p>
					</div>
					<Button className="bg-white text-zinc-900 dark:bg-zinc-900 dark:text-white rounded-xl w-fit" asChild>
						<Link href="/dashboard/images">
							<ImageIcon className="h-4 w-4 mr-2" /> Gestionar Galería
						</Link>
					</Button>
				</div>
			</div>
		</div>
	);
}

function StatCard({ title, value, trend, icon: Icon, color }: any) {
	return (
		<div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
			<div className="flex items-start justify-between">
				<div className={`p-3 rounded-2xl ${color} bg-opacity-10 dark:bg-opacity-20`}>
					<Icon className={`h-6 w-6 ${color.replace('bg-', 'text-')}`} />
				</div>
			</div>
			<div className="mt-4">
				<p className="text-zinc-500 text-sm font-medium">{title}</p>
				<h4 className="text-3xl font-bold mt-1">{value}</h4>
				<p className="text-xs text-zinc-400 mt-2">{trend}</p>
			</div>
		</div>
	);
}

function InfoItem({ label, value }: { label: string, value: string }) {
	return (
		<div className="flex justify-between items-center py-2 border-b border-zinc-50 dark:border-zinc-800 last:border-0">
			<span className="text-sm text-zinc-500 font-medium">{label}</span>
			<span className="text-sm font-semibold">{value}</span>
		</div>
	);
}
