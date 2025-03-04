'use client';

import React, { useState } from 'react';
import { Control } from 'react-hook-form';
import { HTMLInputTypeAttribute } from 'react';
import {
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from '@/components/ui/select';

export type InputWithAddonProps = {
	name: string;
	label: string;
	placeholder?: string;
	type?: HTMLInputTypeAttribute;
	control: Control<any>;
	disabled?: boolean;
	addonPosition?: 'left' | 'right';
	addonClassName?: string;
	inputClassName?: string;
	currencyOptions?: string[];
};

const InputWithAddon: React.FC<InputWithAddonProps> = ({
	name,
	label,
	placeholder,
	type = 'text',
	control,
	disabled,
	addonPosition = 'left',
	addonClassName = '',
	inputClassName = '',
	currencyOptions = ['€', '$', '£'],
}) => {
	const [selectedCurrency, setSelectedCurrency] = useState(currencyOptions[0]);

	const isPurchasePrice = name === 'purchasePrice';
	const gridCols = isPurchasePrice ? 'grid-cols-12' : 'grid-cols-4';
	const selectColSpan = 'col-span-1';
	const inputColSpan = isPurchasePrice ? 'col-span-11' : 'col-span-3';

	return (
		<FormField
			control={control}
			name={name}
			rules={{
				required: `${label} is required`,
				validate: (value) =>
					value === ''
						? `${label} is required`
						: isNaN(Number(value))
							? 'Please input a number'
							: true,
			}}
			render={({ field, fieldState }) => (
				<FormItem>
					<FormLabel>{label}</FormLabel>
					<FormControl className='p-0 !mt-2'>
						<div
							className={`grid ${gridCols} items-center border rounded-md overflow-hidden bg-[#F8FAFC]`}
						>
							{addonPosition === 'left' && (
								<Select
									onValueChange={(value) => setSelectedCurrency(value)}
									value={selectedCurrency}
									disabled={disabled}
								>
									<SelectTrigger
										className={`flex items-center px-2 border-r-none rounded-r-none focus:outline-none focus:ring-0 focus:ring-transparent focus:ring-offset-0 ${addonClassName} ${selectColSpan}`}
										style={{ backgroundColor: '#F8FAFC', height: 40 }}
									>
										<SelectValue placeholder='Select currency' />
									</SelectTrigger>
									<SelectContent>
										{currencyOptions.map((currency) => (
											<SelectItem key={currency} value={currency}>
												{currency}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							)}

							<Input
								{...field}
								type={type}
								placeholder={placeholder}
								disabled={disabled}
								className={`border-l-0 rounded-l-none bg-[#F8FAFC] ${inputClassName} ${inputColSpan}`}
								onChange={(e) => {
									const value = e.target.value;
									field.onChange(value);
								}}
							/>

							{addonPosition === 'right' && (
								<Select
									onValueChange={(value) => setSelectedCurrency(value)}
									value={selectedCurrency}
									disabled={disabled}
								>
									<SelectTrigger
										className={`flex items-center px-2 border-l-2 ${addonClassName} ${selectColSpan}`}
										style={{ backgroundColor: '#F8FAFC', height: 40 }}
									>
										<SelectValue placeholder='Select currency' />
									</SelectTrigger>
									<SelectContent>
										{currencyOptions.map((currency) => (
											<SelectItem key={currency} value={currency}>
												{currency}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							)}
						</div>
					</FormControl>
					<div className='min-h-[20px] text-red-600'>
						<FormMessage>{fieldState.error?.message}</FormMessage>
					</div>
				</FormItem>
			)}
		/>
	);
};

export default InputWithAddon;
