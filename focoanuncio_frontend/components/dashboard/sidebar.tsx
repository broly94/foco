'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Store,
    Settings,
    Image as ImageIcon,
    MessageSquare,
    CreditCard,
    LogOut
} from 'lucide-react';

const MENU_ITEMS = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { name: 'Mi Negocio', icon: Store, href: '/dashboard/profile' },
    { name: 'Imágenes', icon: ImageIcon, href: '/dashboard/images' },
    { name: 'Mensajes', icon: MessageSquare, href: '/dashboard/messages' },
    { name: 'Suscripción', icon: CreditCard, href: '/dashboard/subscription' },
    { name: 'Ajustes', icon: Settings, href: '/dashboard/settings' },
];

export default function DashboardSidebar() {
    const pathname = usePathname();

    return (
        <div className="w-64 bg-white dark:bg-zinc-900 border-r border-zinc-100 dark:border-zinc-800 flex flex-col h-full min-h-screen">
            <div className="p-6">
                <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Panel de Control</h2>
            </div>

            <nav className="flex-1 px-4 space-y-1">
                {MENU_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive
                                    ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50'
                                    : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                                }`}
                        >
                            <Icon className={`h-5 w-5 ${isActive ? 'text-zinc-900 dark:text-zinc-50' : 'text-zinc-400'}`} />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 mt-auto border-t border-zinc-100 dark:border-zinc-800">
                <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all">
                    <LogOut className="h-5 w-5" />
                    Cerrar Sesión
                </button>
            </div>
        </div>
    );
}
