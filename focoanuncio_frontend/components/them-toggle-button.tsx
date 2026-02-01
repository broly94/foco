'use client';

import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
	const { setTheme, theme } = useTheme();
	const [mounted, setMounted] = useState(false);

	// Evitar hidratación incorrecta
	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return (
			<Button variant='ghost' size='icon' disabled>
				<Sun className='h-7 w-7' />
			</Button>
		);
	}

	return (
		<Button
			variant='ghost'
			size='icon'
			onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
			className='rounded-full bg-brand-600 hover:bg-brand-600 p-0'
		>
			{theme === 'light' ? <Moon className='h-7 w-7 text-yellow-500' /> : <Sun className='h-7 w-7 text-yellow-500' />}
			<span className='sr-only'>Cambiar tema</span>
		</Button>
	);
}
