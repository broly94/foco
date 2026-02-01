import Link from 'next/link';
import { Button, type ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AnimatedButtonProps extends ButtonProps {
	href?: string;
	label: string;
	hoverLabel?: string;
	withArrow?: boolean;
	animation?: 'slideUp' | 'slideLeft';
}

export function AnimatedButton({
	href,
	label,
	hoverLabel,
	withArrow = true,
	animation = 'slideUp',
	size,
	variant,
	className,
	...props
}: AnimatedButtonProps) {
	const textAnimations = {
		slideUp: {
			normal: 'group-hover:-translate-y-16 group-hover:opacity-0',
			hover: 'translate-y-16 group-hover:translate-y-0 group-hover:opacity-100',
		},
		slideLeft: {
			normal: 'group-hover:-translate-x-16 group-hover:opacity-0',
			hover: 'translate-x-16 group-hover:translate-x-0 group-hover:opacity-100',
		},
	};

	const arrowAnimations = {
		slideUp: {
			normal: 'group-hover:-translate-x-6 group-hover:opacity-0',
			hover: 'translate-x-6 group-hover:translate-x-0 group-hover:opacity-100',
		},
		slideLeft: {
			normal: 'group-hover:-translate-x-6 group-hover:opacity-0',
			hover: 'translate-x-6 group-hover:translate-x-0 group-hover:opacity-100',
		},
	};

	const chosenText = textAnimations[animation];
	const chosenArrow = arrowAnimations[animation];

	// 🔹 Contenido animado (reutilizable tanto en button como en link)
	const Content = (
		<span className='group flex items-center justify-between gap-x-2 w-full h-full'>
			{/* Contenedor de textos */}
			<span className='relative flex items-center justify-center h-full'>
				{/* Texto normal */}
				<span className={cn('block transition-all duration-200', chosenText.normal)}>{label}</span>

				{/* Texto hover */}
				<span className={cn('absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-200', chosenText.hover)}>
					{hoverLabel ?? label}
				</span>
			</span>

			{withArrow && (
				<span className='relative w-4 h-4 overflow-hidden'>
					{/* Flecha normal */}
					<span className={cn('absolute inset-0 flex items-center justify-center transition-all duration-200', chosenArrow.normal)}>➔</span>

					{/* Flecha hover */}
					<span
						className={cn('absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-200', chosenArrow.hover)}
					>
						➔
					</span>
				</span>
			)}
		</span>
	);

	return (
		<Button
			size={size}
			variant={variant}
			asChild={!!href} // si hay href -> usa Slot (para Link)
			className={cn('relative overflow-hidden py-0', className)}
			{...props}
		>
			{href ? (
				<Link href={href} className='p-0'>
					{Content}
				</Link>
			) : (
				Content
			)}
		</Button>
	);
}
