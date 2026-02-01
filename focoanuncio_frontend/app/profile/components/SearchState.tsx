import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Command, CommandInput, CommandGroup, CommandItem, CommandEmpty } from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export default function SearchState({
	states,
	value,
	onChange,
	disabled,
}: {
	states: any[];
	value: string;
	onChange: (val: string) => void;
	disabled?: boolean;
}) {
	const [open, setOpen] = useState(false);

	const getName = (m: any) => m.name ?? m.full_name ?? m.nombre ?? '';
	const getId = (m: any) => m.id ?? m.municipality_id ?? m.muni_id ?? m.code ?? getName(m);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant='outline'
					role='combobox'
					disabled={disabled}
					className='w-full justify-between text-zinc-900 dark:text-zinc-50 border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 rounded-xl h-12 px-4 font-normal'
				>
					{value || 'Escribe una ciudad'}
					<ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
				</Button>
			</PopoverTrigger>

			<PopoverContent className='p-0 rounded-2xl border-zinc-200 dark:border-zinc-800 shadow-2xl w-[var(--radix-popover-trigger-width)]'>
				<Command className='bg-white dark:bg-zinc-900'>
					<CommandInput
						placeholder='Buscar ciudad...'
						value={value}
						onValueChange={onChange}
						className='border-none focus:ring-0'
					/>
					<CommandEmpty className='py-4 text-sm text-center text-zinc-500'>No se encontraron resultados.</CommandEmpty>
					<CommandGroup className='max-h-[250px] overflow-y-auto no-scrollbar'>
						{states.map((m) => {
							const name = getName(m);
							const id = getId(m);
							return (
								<CommandItem
									key={id}
									value={name}
									onSelect={(val) => {
										onChange(val);
										setOpen(false);
									}}
									className='flex items-center gap-2 px-4 py-3 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-lg mx-1'
								>
									<Check className={cn('h-4 w-4 text-zinc-900 dark:text-zinc-50', value === name ? 'opacity-100' : 'opacity-0')} />
									<span className='text-sm'>{name}</span>
								</CommandItem>
							);
						})}
					</CommandGroup>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
