import { Lightbulb } from 'lucide-react';

export default function Logo({ className = '' }: { className?: string }) {
    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <div className='relative flex items-center justify-center p-2 rounded-xl bg-zinc-900 dark:bg-zinc-50 shadow-sm'>
                <Lightbulb className='w-6 h-6 text-zinc-50 dark:text-zinc-900' strokeWidth={2.5} />
                {/* Efecto de brillo sutil */}
                <div className='absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-pulse' />
            </div>
            <span className='text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50'>
                Foco<span className='text-zinc-500 font-normal'>Anuncio</span>
            </span>
        </div>
    );
}
