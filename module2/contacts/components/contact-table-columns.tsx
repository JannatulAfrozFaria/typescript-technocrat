'use client';

import type { Contact } from '@/types/prisma-types';
import type { ColumnDef } from '@tanstack/react-table';
import { useState } from 'react';
import ThreeDotIcon from '@/components/icon-components/three-dot-icon';

import { capitalizeFirstLetter } from '@/lib/utils';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { toast } from 'sonner';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const contactTableColumns: ColumnDef<Contact>[] = [
	{
		id: 'name',
		accessorKey: 'name',
		header: 'Name',
		cell: ({ row, table }) => {
			const meta = table.options.meta as {
				handleContactActions?: (
					actionType: 'view-details' | 'edit' | 'delete',
					contactId: String
				) => void;
			};

			return (
				<TooltipProvider delayDuration={200}>
					<Tooltip>
						<TooltipTrigger asChild>
							<button
								onClick={() => {
									meta.handleContactActions?.('view-details', row.original.id);
								}}
								className='text-[#323949] hover:text-blue-600 hover:underline'
							>
								{row.original.name}
							</button>
						</TooltipTrigger>
						<TooltipContent>
							<p>Click to view details</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			);
		},
	},
	{
		id: 'type',
		accessorKey: 'type',
		header: 'Contact Type',
		cell: ({ row }) => capitalizeFirstLetter(row.original.type),
	},
	{
		id: 'entity',
		accessorKey: 'entity',
		header: 'Entity Type',
		cell: ({ row }) => capitalizeFirstLetter(row.original.entity),
	},
	{
		// this cell holds both email and phone number but we are identifying them both by the term "email"
		id: 'email',
		accessorKey: 'email',
		header: 'Contact Information',
		cell: ({ row }) => (
			<div>
				<TooltipProvider delayDuration={200}>
					<Tooltip>
						<TooltipTrigger asChild className='mb-2'>
							<p
								className='cursor-pointer'
								onClick={() => {
									navigator.clipboard.writeText(row.original.email || '');
									toast.success('Email Address Copied to Clipboard');
								}}
							>
								{row.original.email}
							</p>
						</TooltipTrigger>
						<TooltipContent>
							<p>Copy to clipboard</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
				{row.original.phoneNumber && (
					<TooltipProvider delayDuration={200}>
						<Tooltip>
							<TooltipTrigger asChild>
								<p
									className='cursor-pointer'
									onClick={() => {
										navigator.clipboard.writeText(
											row.original.phoneNumber || ''
										);
										toast.success('Phone Number Copied to Clipboard');
									}}
								>
									{row.original.phoneNumber}
								</p>
							</TooltipTrigger>
							<TooltipContent>
								<p>Copy to clipboard</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				)}
			</div>
		),
	},
	{
		id: 'actions',
		cell: ({ row, table }) => {
			// have to maintain the state separately here for some reason, maybe because it's a table row
			const [showDropDown, setShowDropdown] = useState(false);

			const meta = table.options.meta as {
				handleContactActions?: (
					actionType: 'view-details' | 'edit' | 'delete',
					contactId: String
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
								meta.handleContactActions?.('view-details', row.original.id);
							}}
						>
							View Details
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => {
								setShowDropdown(false);
								meta.handleContactActions?.('edit', row.original.id);
							}}
						>
							Edit
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => {
								setShowDropdown(false);
								meta.handleContactActions?.('delete', row.original.id);
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
