import { useEffect, useState } from 'react';
import { useDebounce } from '@/lib/hooks/useDebounce'; // Assuming you have a debounce hook
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import {
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from '@/components/ui/form';
import { type Control } from 'react-hook-form';
import useCurrencies from '@/lib/hooks/useCurrencies';
import DropDownLoader from '../../drop-down-loader';

type CurrencyPickerProps = {
	control: Control<any>;
	disabled?: boolean;
	name?: string;
	selectContentClassName?: string;
};

const CurrencyPicker: React.FC<CurrencyPickerProps> = ({
	control,
	disabled,
	name = 'currencyId',
	selectContentClassName = '',
}) => {
	const { currencies, loading } = useCurrencies();
	const [open, setOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState<string>('');
	const debouncedSearchTerm = useDebounce(searchTerm, 300); // Debounce search input

	// Filter currencies based on search term
	const filteredCurrencies = currencies.filter((currency) =>
		currency.label.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
	);

	// Prioritize EUR, USD, and GBP
	const prioritizedCurrencies = filteredCurrencies.sort((a, b) => {
		const priority = ['EUR', 'USD', 'GBP'];
		const aPriority = priority.indexOf(a.label);
		const bPriority = priority.indexOf(b.label);
		return bPriority - aPriority; // Sort in descending order to bring priority currencies to the top
	});

	return (
		<FormField
			control={control}
			name={name}
			render={({ field }: { field: any }) => (
				<FormItem>
					<FormLabel className='font-axiforma'>Currency</FormLabel>
					<FormControl>
						<Select
							disabled={disabled}
							open={open}
							onOpenChange={setOpen}
							onValueChange={(value) => {
								const newValue = isNaN(Number(value)) ? value : Number(value);
								field.onChange(newValue);
								setOpen(false);
							}}
							value={field?.value?.toString() || ''}
						>
							<SelectTrigger
								onClick={() => setOpen(!open)}
								style={{ backgroundColor: '#F8FAFC', height: 40 }}
								className={`!font-normal !text-[#64748B] ${
									field.value ? ' !text-black' : ''
								} data-[state=open]:font-semibold data-[state=open]:text-black`}
							>
								<SelectValue placeholder='Select Currency' />
							</SelectTrigger>
							<SelectContent>
								<div className='p-2 relative'>
									<Input
										type='text'
										placeholder='Search currency...'
										value={searchTerm}
										onChange={(e) => {
											setSearchTerm(e.target.value);
											setTimeout(() => e.target.focus(), 0); // Keep focus on input
										}}
										className='w-full px-2 py-1 border rounded-md mb-2'
									/>
									<DropDownLoader loading={loading} />
								</div>
								<div className='!overflow-y-auto !max-h-60'>
									{/* Prioritized Currencies (EUR, USD, GBP) */}
									{prioritizedCurrencies
										.filter((currency) => ['EUR', 'USD', 'GBP'].includes(currency.label))
										.map((currency) => (
											<SelectItem
												key={currency.id}
												value={currency.id.toString()}
												className='!font-normal'
											>
												<div className='flex items-center gap-2'>
													<span className='text-[#2354E6] font-bold'>
														{currency.symbol || currency.label.charAt(0)}
													</span>
													<span>{currency.label}</span>
												</div>
											</SelectItem>
										))}

									{/* Subtle Separator */}
									<hr className='my-2 border-gray-300' />

									{/* Remaining Currencies */}
									{prioritizedCurrencies
										.filter((currency) => !['EUR', 'USD', 'GBP'].includes(currency.label))
										.map((currency) => (
											<SelectItem
												key={currency.id}
												value={currency.id.toString()}
												className='!font-normal'
											>
												<div className='flex items-center gap-2'>
													<span className='text-[#2354E6] font-bold'>
														{currency.symbol || currency.label.charAt(0)}
													</span>
													<span>{currency.label}</span>
												</div>
											</SelectItem>
										))}
								</div>
							</SelectContent>
						</Select>
					</FormControl>
					<div className='min-h-[20px] text-red-600'>
						<FormMessage />
					</div>
				</FormItem>
			)}
		/>
	);
};

export default CurrencyPicker;