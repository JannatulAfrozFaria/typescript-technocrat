'use client';

import React, { useState } from 'react';
import { Control } from 'react-hook-form';
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

export type ProductLifeInputProps = {
	name: string;
	placeholder?: string;
	control: Control<any>;
	disabled?: boolean;
	inputClassName?: string;
	addonClassName?: string;
};

const ProductLifeInput: React.FC<ProductLifeInputProps> = ({
	name,
	placeholder,
	control,
	disabled,
	inputClassName = '',
	addonClassName = '',
}) => {
	const [unit, setUnit] = useState<string>('Year');

	return (
		<FormField
			control={control}
			name={name}
			rules={{
				required: 'Product Life is required',
				validate: (value) =>
					value === ''
						? 'Product Life is required'
						: isNaN(Number(value))
							? 'Please input a number'
							: true,
			}}
			render={({ field, fieldState }) => (
				<FormItem>
					<FormControl>
						<div className='grid grid-cols-12 items-center border rounded-md overflow-hidden bg-[#F8FAFC]'>
							<Input
								{...field}
								placeholder={placeholder || 'Enter value'}
								disabled={disabled}
								className={`col-span-10 py-2 px-3 ${inputClassName}`}
								onChange={(e) => {
									const value = e.target.value;
									field.onChange(value);
								}}
							/>

							<Select
								onValueChange={(value) => {
									setUnit(value);
								}}
								value={unit}
								disabled={disabled}
							>
								<SelectTrigger
									className={`!w-[110px] flex items-center px-2 border-y-none border-r-none  rounded-l-none focus:outline-none focus:ring-0 focus:ring-transparent focus:ring-offset-0 ${addonClassName}`}
									style={{ backgroundColor: '#F8FAFC', height: 40 }}
								>
									<SelectValue placeholder='Select time' />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='Year'>Year</SelectItem>
									<SelectItem value='Month'>Month</SelectItem>
									<SelectItem value='Week'>Week</SelectItem>
									<SelectItem value='Days'>Days</SelectItem>
								</SelectContent>
							</Select>
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

export default ProductLifeInput;
