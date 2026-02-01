'use client';

import DashboardSidebar from '@/components/dashboard/sidebar';
import { useCurrentUser } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { data: user, isLoading } = useCurrentUser();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/login');
        }
    }, [user, isLoading, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
                <Loader2 className="h-10 w-10 animate-spin text-zinc-300" />
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950">
            <DashboardSidebar />
            <main className="flex-1 overflow-y-auto">
                <div className="p-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
