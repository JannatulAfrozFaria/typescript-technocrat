'use client';
import { ColumnDef } from '@tanstack/react-table';
import type { JournalEntry } from '@/types/types';
import { useState } from 'react';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import ThreeDotIcon from '@/components/icon-components/three-dot-icon';

// Function to format numbers in Indian numbering system
const formatIndianNumber = (amount: number): string => {
	return amount.toLocaleString('en-IN'); // Formats according to Indian system
};

export const journalEntriesTableColumns: ColumnDef<JournalEntry>[] = [
	// {
	// 	id: 'date',
	// 	accessorKey: 'date',
	// 	header: 'Date',
	// 	cell: ({ row }) => (
	// 		<span>{new Date(row.original.date).toLocaleDateString('en-CA')}</span>
	// 	),
	// },
	{
		id: 'date',
		accessorKey: 'date',
		header: 'Date',
		cell: ({ row }) => (
			<span>
				{new Date(row.original.date).toLocaleDateString('en-GB', {
					day: 'numeric',
					month: 'long',
					year: 'numeric',
				})}
			</span>
		),
	},
	{
		id: 'description',
		accessorKey: 'description',
		header: 'Description',
	},
	{
		id: 'account',
		accessorKey: 'account',
		header: 'Account',
		cell: ({ row }) => (
			<span className='text-[#0F172A] text-sm'>{row.original.account} </span>
		),
	},
	
	{
		id: 'credit',
		accessorKey: 'credit',
		header: 'Credit',
		cell: ({ row }) => (
			<span>
				{typeof row.original.credit === 'number'
					? formatIndianNumber(row.original.credit)
					: row.original.credit}
			</span>
		),
	},
	{
		id: 'amount',
		accessorKey: 'amount',
		header: 'Amount',
		cell: ({ row }) => (
			<span>
				{typeof row.original.amount === 'number'
					? formatIndianNumber(row.original.amount)
					: row.original.amount}
			</span>
		),
	},
	{
		id: 'actions',
		cell: ({ row, table }) => {
			const [showDropDown, setShowDropdown] = useState(false);

			const meta = table.options.meta as {
				handleJournalEntryActions?: (
					actionType: 'edit' | 'delete',
					productId: string
				) => void;
			};

			return (
				<div className='flex justify-end'>
					<DropdownMenu open={showDropDown} onOpenChange={setShowDropdown}>
						<DropdownMenuTrigger>
							<ThreeDotIcon />
						</DropdownMenuTrigger>
						<DropdownMenuContent className='px-4 py-2'>
							<DropdownMenuItem
								onClick={() => {
									setShowDropdown(false);
									meta.handleJournalEntryActions?.('edit', row.original.id);
								}}
							>
								Edit
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => {
									setShowDropdown(false);
									meta.handleJournalEntryActions?.('delete', row.original.id);
								}}
								className='text-red-500'
							>
								Delete
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			);
		},
	},
];
