'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
	DatePicker,
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
interface JournalEntryFormProps {
	onOpenChange: Dispatch<SetStateAction<boolean>>;
}
const journalEntrySchema = z.object({
	description: z.string().min(1, 'Description is required'),
	date: z.string().min(1, 'Date is required'),
	entries: z
		.array(
			z.object({
				account: z.string().min(1, 'Account is required'),
				// accountDescription: z.string().optional(),
				accountDescription: z.string().min(1, 'Description is required'),
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
	// const form = useForm();
	// const { control } = form;
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

	// State to manage multiple entry sheets
	const [entries, setEntries] = useState([
		{
			id: Date.now(),
			account: '',
			accountDescription: '',
			debit: '',
			credit: '',
		},
	]);

	// Function to add a new entry sheet
	const addEntry = () => {
		setEntries([
			...entries,
			{
				id: Date.now(),
				account: '',
				accountDescription: '',
				debit: '',
				credit: '',
			},
		]);
	};

	// Function to remove an entry sheet by id
	const removeEntry = (id: number) => {
		setEntries(entries.filter((entry) => entry.id !== id));
	};
	const onSubmit = () => {
		// if (onClose) onClose();
		onOpenChange(false);
	};
	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				{/* GENERAL---INFORMATION----- */}
				<FormSectionTitle text='General Information' />
				<div className='grid grid-cols-4 gap-4 '>
					<div className='col-span-2'>
						<TextField
							name='description'
							label='Description'
							placeholder='0'
							control={form.control}
						/>
					</div>
					<div className='col-span-2'>
						<FormInputLabel text='Date' />
						<DatePicker name='date' label='' control={form.control} />
					</div>
				</div>

				{/* ENTRY SHEETS */}
				<FormSectionTitle text='Entry Sheet' />
				{entries.map((entry, index) => (
					<div key={entry.id} className='grid grid-cols-4 gap-4'>
						<div className='col-span-1'>
							<TextField
								name={`entries[${index}].account`}
								label='Account'
								placeholder='0'
								control={form.control}
							/>
						</div>
						<div className='col-span-1'>
							<TextArea
								name={`entries[${index}].accountDescription`}
								label='Description'
								placeholder='0'
								control={form.control}
							/>
						</div>
						<div className='col-span-1'>
							<TextFieldNumberType
								name={`entries[${index}].debit`}
								label='Debit'
								placeholder='0'
								control={form.control}
							/>
						</div>
						<div className='col-span-1'>
							<TextFieldNumberType
								name={`entries[${index}].credit`}
								label='Credit'
								placeholder='0'
								control={form.control}
							/>
						</div>
						<div
							className='col-span-4 flex gap-2 justify-end w-full text-[#ff3b30] text-sm font-medium cursor-pointer'
							onClick={() => removeEntry(entry.id)}
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
							<p className='font-semibold'>$0.00</p>
						</div>
						<div className='flex gap-12 items-center'>
							<p className='text-[#334155] font-medium'>Total credit</p>
							<p className='font-semibold'>$0.00</p>
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
