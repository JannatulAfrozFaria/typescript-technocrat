'use client';
import { ColumnDef } from '@tanstack/react-table';
import type { JournalEntry } from '@/types/types';
import type { ColumnMeta } from '@tanstack/react-table';

export interface CustomColumnMeta<TData, TValue>
	extends ColumnMeta<TData, TValue> {
	headerClassName?: string;
}

// Function to format numbers in Indian numbering system
const formatIndianNumber = (amount: number): string => {
	return amount.toLocaleString('en-IN'); // Formats according to Indian system
};

export const trialBalanceTableColumns: ColumnDef<
	JournalEntry,
	string | number
>[] = [
	{
		id: 'account',
		accessorKey: 'account',
		header: 'Account',
		meta: {
			headerClassName: 'text-justify',
		} as CustomColumnMeta<JournalEntry, string>,
		cell: ({ row }) => (
			<span className='text-[14px] text-[#0F172A] font-medium'>
				{row.original.account}
			</span>
		),
	},

	{
		id: 'debit',
		accessorKey: 'debit',
		header: 'Debit amount',
		meta: {
			headerClassName: 'text-right',
		} as CustomColumnMeta<JournalEntry, number>,
		cell: ({ row }) => (
			<span className='flex justify-end'>
				{typeof row.original.debit === 'number' && row.original.debit > 0 && (
					<span>$</span> // Currency symbol
				)}
				{typeof row.original.debit === 'number'
					? formatIndianNumber(row.original.debit)
					: row.original.debit}
			</span>
		),
	},
	{
		id: 'credit',
		accessorKey: 'credit',
		header: 'Credit amount',
		meta: {
			headerClassName: 'text-right pr-8',
		} as CustomColumnMeta<JournalEntry, number>,
		cell: ({ row }) => (
			<span className='flex justify-end pr-8'>
				{typeof row.original.credit === 'number' && row.original.credit > 0 && (
					<span>₹</span>
				)}
				{typeof row.original.credit === 'number'
					? formatIndianNumber(row.original.credit)
					: row.original.credit}
			</span>
		),
	},
];
