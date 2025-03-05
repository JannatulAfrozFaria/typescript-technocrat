'use client';
import { ColumnDef } from '@tanstack/react-table';
import type { Asset } from '@/types/types';
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
export const activeTableColumns = (): ColumnDef<Asset>[] => [
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
	{ id: 'productLife', accessorKey: 'productLife', header: 'Product Life' },
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
