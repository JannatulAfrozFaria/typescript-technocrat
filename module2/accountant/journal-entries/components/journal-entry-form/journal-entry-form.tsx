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
import FormSectionTitle from '@/components/form-section-title';
import BinIcon from '@/components/icon-components/bin-icon';
import { type Dispatch, type SetStateAction } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { SelectItem } from '@/components/ui/select';
import DatePickerInput from '@/components/date-picker-input';

interface JournalEntryFormProps {
	onOpenChange: Dispatch<SetStateAction<boolean>>;
}

const journalEntrySchema = z.object({
	description: z.string().optional(),
	date: z.string().min(1, 'Date is required'),
	entries: z
		.array(
			z.object({
				account: z.string().min(1, 'Account is required'),
				accountDescription: z.string().optional(),
				debit: z
					.string()
					.optional()
					.superRefine((val, ctx) => {
						if (val && isNaN(Number(val))) {
							ctx.addIssue({
								code: z.ZodIssueCode.custom,
								message: 'Debit must be a number',
							});
						}
					}),
				credit: z
					.string()
					.optional()
					.superRefine((val, ctx) => {
						if (val && isNaN(Number(val))) {
							ctx.addIssue({
								code: z.ZodIssueCode.custom,
								message: 'Credit must be a number',
							});
						}
					}),
			})
		)
		.min(1, 'At least one entry is required'),
});

export default function JournalEntryForm({
	onOpenChange,
}: JournalEntryFormProps) {
	const form = useForm({
		resolver: zodResolver(journalEntrySchema),
		defaultValues: {
			description: '',
			date: '',
			entries: [
				{
					account: '',
					accountDescription: '',
					debit: '',
					credit: '',
				},
			],
		},
		mode: 'onChange',
	});

	const { control, handleSubmit, setValue } = form;

	// Subscribe to changes in the entries field using useWatch
	const entries =
		useWatch({
			control,
			name: 'entries',
		}) || [];

	// Calculate totals for debit and credit
	const totalDebit = entries.reduce(
		(sum, entry) => sum + (parseFloat(entry.debit) || 0),
		0
	);
	const totalCredit = entries.reduce(
		(sum, entry) => sum + (parseFloat(entry.credit) || 0),
		0
	);

	// Function to add a new entry
	const addEntry = () => {
		setValue('entries', [
			...entries,
			{
				account: '',
				accountDescription: '',
				debit: '',
				credit: '',
			},
		]);
	};

	// Function to remove an entry by index
	const removeEntry = (index: number) => {
		const updatedEntries = [...entries];
		updatedEntries.splice(index, 1);
		setValue('entries', updatedEntries);
	};

	const onSubmit = (data: any) => {
		console.log('Submitted data: ', data);
		onOpenChange(false);
	};

	return (
		<Form {...form}>
			<form onSubmit={handleSubmit(onSubmit)}>
				{/* GENERAL INFORMATION */}
				<FormSectionTitle text='General Information' />
				<div className='grid grid-cols-4 gap-4'>
					<div className='col-span-2'>
						<TextField
							name='description'
							label='Description'
							placeholder='Description'
							control={control}
						/>
					</div>
					<div className='col-span-2'>
						<FormInputLabel text='Date' />
						<DatePicker name='date' label='' control={control} />
						{/* <DatePickerInput name='date' label='' control={control} /> */}
					</div>
				</div>

				{/* ENTRY SHEETS */}
				<FormSectionTitle text='Entry Sheet' />
				{entries.map((entry, index) => (
					<div key={index} className='grid grid-cols-4 gap-4'>
						<div className='col-span-1'>
							<DropDown
								name={`entries.${index}.account`}
								label='Account'
								placeholder='Select account'
								control={control}
							>
								<SelectItem value='account1'>Account 1</SelectItem>
								<SelectItem value='account2'>Account 2</SelectItem>
							</DropDown>
						</div>
						<div className='col-span-1'>
							<TextArea
								name={`entries.${index}.accountDescription`}
								label='Description'
								placeholder='Description'
								control={control}
							/>
						</div>
						<div className='col-span-1'>
							<TextFieldNumberType
								name={`entries.${index}.debit`}
								label='Debit'
								placeholder='0'
								control={control}
							/>
						</div>
						<div className='col-span-1'>
							<TextFieldNumberType
								name={`entries.${index}.credit`}
								label='Credit'
								placeholder='0'
								control={control}
							/>
						</div>
						<div
							className='col-span-4 flex gap-2 justify-end w-full text-[#ff3b30] text-sm font-medium cursor-pointer'
							onClick={() => removeEntry(index)}
						>
							<BinIcon />
							<span>Remove</span>
						</div>
						<hr className='col-span-4 border border-[#d6dbe3] mb-4' />
					</div>
				))}

				{/* ADD NEW ENTRY BUTTON */}
				<div className='flex justify-between'>
					<button
						type='button'
						className='text-[#2354E6] text-sm font-medium'
						onClick={addEntry}
					>
						+ Add Entry Sheet Line
					</button>
					<div className='flex gap-8 items-center text-sm'>
						<div className='flex gap-12 items-center'>
							<p className='text-[#334155] font-medium'>Total debit</p>
							<p className='font-semibold'>${totalDebit.toFixed(2)}</p>
						</div>
						<div className='flex gap-12 items-center'>
							<p className='text-[#334155] font-medium'>Total credit</p>
							<p className='font-semibold'>${totalCredit.toFixed(2)}</p>
						</div>
					</div>
				</div>

				{/* FORM ACTION BUTTONS */}
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
						Add new Entry
					</button>
				</div>
			</form>
		</Form>
	);
}
