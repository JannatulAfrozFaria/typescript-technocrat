'use client';

import { useState } from 'react';
import { Control } from 'react-hook-form';
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import supportedCountries from './supported-countries';

type CountryPickerProps = {
	control: Control<any>;
	name?: string;
	label?: string;
	placeholder?: string;
};

export const CountryPicker: React.FC<CountryPickerProps> = ({
	control,
	name = 'countryCode',
	label = 'Country',
	placeholder = 'Select Country',
}) => {
	const [search, setSearch] = useState('');
	const [open, setOpen] = useState(false);

	const filteredCountries = supportedCountries.filter((country) =>
		country.label.toLowerCase().includes(search.toLowerCase())
	);

	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem>
					<FormLabel>{label}</FormLabel>
					<FormControl>
						<Select
							open={open}
							onOpenChange={setOpen}
							onValueChange={(value) => {
								field.onChange(value);
								setOpen(false);
							}}
							value={field.value}
						>
							<SelectTrigger
								onClick={() => setOpen(!open)}
								style={{ backgroundColor: '#F8FAFC', height: 40 }}
								className={`!font-normal !text-[#64748B] ${
									field.value ? ' !text-black' : ''
								} data-[state=open]:font-semibold data-[state=open]:text-black`}
							>
								<SelectValue placeholder={placeholder} />
							</SelectTrigger>
							<SelectContent className='font-axiforma font-normal'>
								<div className='p-2 relative'>
									<Input
										type='text'
										placeholder='Search...'
										value={search}
										onClick={(e) => e.stopPropagation()}
										onKeyDown={(e) => e.stopPropagation()}
										onChange={(e) => setSearch(e.target.value)}
										className='w-full px-2 py-1 border rounded-md mb-2'
									/>
								</div>
								<div className='max-h-60 overflow-y-auto'>
									{filteredCountries.map((country) => (
										<SelectItem key={country.value} value={country.value}>
											{country.label}
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