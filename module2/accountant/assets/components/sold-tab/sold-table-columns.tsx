'use client';
import { ColumnDef } from '@tanstack/react-table';
import type { Asset } from '@/types/types';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import ThreeDotIcon from '@/components/icon-components/three-dot-icon';
import { useState } from 'react';
// Function to format numbers in Indian numbering system
const formatIndianNumber = (amount: number): string => {
	return amount.toLocaleString('en-IN'); // Formats according to Indian system
};
export const soldTableColumns = (): ColumnDef<Asset>[] => [
	{
		id: 'name',
		accessorKey: 'name',
		header: 'Name',
		cell: ({ row }) => (
			<div className='font-medium text-[#0f172a] text-sm pl-2'>
				{' '}
				{row.original.name}{' '}
			</div>
		),
	},
	{
		id: 'category',
		accessorKey: 'category',
		header: 'Category',
	},
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
		id: 'sellingDate',
		accessorKey: 'sellingDate',
		header: 'Selling Date',
		cell: ({ row }) => {
			const rawDate = row.original.date;
			const formattedDate = new Date(rawDate).toLocaleDateString('en-CA');
			return <span>{formattedDate}</span>;
		},
	},

	{
		id: 'price',
		accessorKey: 'price',
		header: 'Price',
		cell: ({ row }) => (
			<span>
				{' '}
				$
				{typeof row.original.price === 'number'
					? formatIndianNumber(row.original.price)
					: row.original.price}
			</span>
		),
	},
	{
		id: 'profitOrLoss',
		accessorKey: 'profitOrLoss',
		header: 'Profit/Loss',
	},
	{ id: 'status', accessorKey: 'status', header: 'Status' },
	{
		id: 'actions',
		cell: ({ row, table }) => {
			// have to maintain the state separately here for some reason, maybe because it's a table row
			const [showDropDown, setShowDropdown] = useState(false);

			const meta = table.options.meta as {
				handleAssetActions?: (
					actionType: 'edit' | 'delete',
					contactId: String
				) => void;
			};

			return (
				<div className='flex justify-end pr-2'>
					<DropdownMenu open={showDropDown} onOpenChange={setShowDropdown}>
						<DropdownMenuTrigger>
							<ThreeDotIcon />
						</DropdownMenuTrigger>
						<DropdownMenuContent className='px-4 py-2'>
							<DropdownMenuItem
								onClick={() => {
									setShowDropdown(false);
									meta.handleAssetActions?.('edit', row.original.id);
								}}
							>
								Edit
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => {
									setShowDropdown(false);
									meta.handleAssetActions?.('delete', row.original.id);
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
