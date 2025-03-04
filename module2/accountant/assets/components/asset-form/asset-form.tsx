'use client';

import { useForm, useWatch } from 'react-hook-form';
import {
	DatePicker,
	DropDown,
	TextArea,
	TextField,
	TextFieldNumberType,
} from '@/components/form-elements';
import { Form } from '@/components/ui/form';
import FormInputLabel from '@/components/form-input-label';
import { type Dispatch, type SetStateAction } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { SelectItem } from '@/components/ui/select';
import InputWithAddon from '@/components/input-with-addon';
import ProductLifeInput from './product-life-Input';

interface AssetFormProps {
	onOpenChange: Dispatch<SetStateAction<boolean>>;
}

const assetSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	date: z.string().min(1, 'Date is required'),
	serialNumber: z.union([
		z.number().min(1, 'Serial number is required'),
		z
			.string()
			.min(1, 'Serial number is required')
			.refine((val) => !isNaN(Number(val)), {
				message: 'Please input a number',
			}),
	]),
	purchasePrice: z.union([
		z.number().min(1, 'Purchase price is required'),
		z
			.string()
			.min(1, 'Purchase price is required')
			.refine((val) => !isNaN(Number(val)), {
				message: 'Please input a number',
			}),
	]),
	productLife: z.union([
		z.number().min(1, 'Product life is required'),
		z
			.string()
			.min(1, 'Product life is required')
			.refine((val) => !isNaN(Number(val)), {
				message: 'Please input a number',
			}),
	]),
	sellingPrice: z.union([
		z.number().min(0, 'Selling price must be a positive number').optional(),
		z
			.string()
			.refine((val) => !isNaN(Number(val)), {
				message: 'Please input a number',
			})
			.optional(),
	]),
	status: z.string().min(1, 'Status is required'),
	reasonForLoss: z.string().optional(),
	buyerName: z.string().optional(),
	account: z.string().min(1, 'Account is required'),
});

export default function AssetForm({ onOpenChange }: AssetFormProps) {
	const form = useForm({
		resolver: zodResolver(assetSchema),
		defaultValues: {
			name: '',
			date: '',
			purchasePrice: 0,
			serialNumber: 0,
			productLife: 0,
			status: '',
			reasonForLoss: '',
			sellingPrice: 0,
			buyerName: '',
			account: '',
		},
		mode: 'onChange',
	});

	const { control, handleSubmit } = form;
	const status = useWatch({ control, name: 'status' });

	// Determining grid columns based on status:
	const gridClasses =
		status === 'Lost'
			? 'grid-cols-2'
			: status === 'Sold'
				? 'grid-cols-3'
				: 'grid-cols-1';

	const onSubmit = (data: any) => {
		console.log('Submitted data: ', data);
		onOpenChange(false);
	};

	return (
		<Form {...form}>
			<form onSubmit={handleSubmit(onSubmit)}>
				{/* Name */}
				<FormInputLabel text='Name' requiredSign='*' />
				<TextField name='name' placeholder='Name' control={control} />

				{/* Purchase Date */}
				<FormInputLabel text='Purchase date' />
				<DatePicker name='date' label='' control={control} />

				{/* Purchase Price */}
				<InputWithAddon
					name='purchasePrice'
					label='Purchase price'
					placeholder='0'
					control={control}
					addonPosition='left'
					addonClassName='text-[#0F172A]'
					inputClassName='border-none'
					currencyOptions={['€', '$', '£']}
				/>

				{/* Serial Number */}
				<TextFieldNumberType
					name='serialNumber'
					label='Serial number'
					placeholder='0'
					control={control}
				/>

				{/* Product Life */}
				<FormInputLabel text='Product Life' />
				<ProductLifeInput
					name='productLife'
					placeholder='0'
					control={control}
					inputClassName='custom-input-class'
					addonClassName='custom-addon-class'
				/>

				{/* Dynamic Grid Section */}
				<div className={`grid gap-4 ${gridClasses} w-full`}>
					{/* Asset Status Dropdown */}
					<DropDown name='status' label='Assets Status' control={control}>
						<SelectItem value='Active'>Active</SelectItem>
						<SelectItem value='Lost'>Lost</SelectItem>
						<SelectItem value='Sold'>Sold</SelectItem>
					</DropDown>

					{/* For Lost status, show Reason for Loss */}
					{status === 'Lost' && (
						<DropDown
							name='reasonForLoss'
							label='Reason for loss'
							control={control}
						>
							<SelectItem value='Theft'>Theft</SelectItem>
							<SelectItem value='Expired'>Expired</SelectItem>
							<SelectItem value='Damaged'>Damaged</SelectItem>
							<SelectItem value='Fire'>Fire</SelectItem>
							<SelectItem value='Other'>Other</SelectItem>
						</DropDown>
					)}

					{/* For Sold status, show Selling Price and Buyer Name */}
					{status === 'Sold' && (
						<>
							<InputWithAddon
								name='sellingPrice'
								label='Selling price'
								placeholder='0'
								control={control}
								addonPosition='left'
								addonClassName='text-[#0F172A]'
								inputClassName='border-none'
								currencyOptions={['€', '$', '£']}
							/>
							<TextField
								name='buyerName'
								label='Buyer Name'
								placeholder='Enter Buyer Name'
								control={control}
							/>
						</>
					)}
				</div>

				{/* Bank Account Dropdown */}
				<FormInputLabel text='Bank account' requiredSign='*' />
				<DropDown name='account' control={control}>
					<SelectItem className='font-normal' value='Account1'>
						Account 1
					</SelectItem>
					<SelectItem className='font-normal' value='Account2'>
						Account 2
					</SelectItem>
					<SelectItem className='font-normal' value='Account3'>
						Account 3
					</SelectItem>
				</DropDown>

				{/* Form Action Buttons */}
				<div className='text-left mr-1 mt-5 flex gap-4 justify-end items-end'>
					<button
						className='w-[108px] h-[44px] border border-[#d6dbe3] text-[#5e6b7c] py-2 rounded-md'
						onClick={() => onOpenChange(false)}
					>
						Cancel
					</button>
					<button
						type='submit'
						className='w-[198px] h-[44px] bg-[#2354E6] border border-[#2354E6] text-white py-2 rounded-md'
					>
						Create new asset
					</button>
				</div>
			</form>
		</Form>
	);
}
