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

export const journalEntriesTableColumns: ColumnDef<JournalEntry>[] = [
	{
		id: 'date',
		accessorKey: 'date',
		header: 'Date',
		cell: ({ row }) => (
			<span>{new Date(row.original.date).toLocaleDateString('en-CA')}</span>
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
	},
	{
		id: 'debit',
		accessorKey: 'debit',
		header: 'Debit',
	},
	{
		id: 'credit',
		accessorKey: 'credit',
		header: 'Credit',
	},
	{
		id: 'amount',
		accessorKey: 'amount',
		header: 'Amount',
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
			);
		},
	},
];
