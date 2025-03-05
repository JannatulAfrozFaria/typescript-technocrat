'use client';
import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from '@tanstack/react-table';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import React from 'react';
import type { Asset } from '@/types/types';

interface DataTableProps {
	data: Asset[];
	columns: ColumnDef<Asset>[];
	handleAssetActions: (
		actionType: 'edit' | 'delete',
		contactId: string
	) => void;
}
export default function AllDataTable({
	columns,
	data,
	handleAssetActions,
}: DataTableProps) {
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		meta: {
			handleAssetActions,
		},
	});
	const paginatedData = table.getPaginationRowModel().rows;
	return (
		<div className='min-w-full'>
			<Table className='w-full p-6'>
				<TableHeader className='font-bold'>
					{table.getHeaderGroups().map((headerGroup) => (
						<TableRow key={headerGroup.id} className='border-b'>
							{headerGroup.headers.map((header) => (
								<TableHead
									key={header.id}
									className='py-4 text-left text-[12px] text-[#475569] font-medium'
								>
									<div className={header.index === 0 ? 'pl-2' : ''}>
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef.header,
													header.getContext()
												)}
									</div>
								</TableHead>
							))}
						</TableRow>
					))}
				</TableHeader>
				<TableBody className='w-full border-b text-[12px]'>
					{table.getRowModel().rows?.length ? (
						table.getRowModel().rows.map((row, rowIndex) => (
							<TableRow
								key={row.id}
								className={`${
									rowIndex % 2 === 0
										? 'bg-[#f8fafc] border-y-2 border-y-[#e2e8f0] hover:bg-[#F1F5F9]'
										: 'hover:bg-[#f8fafc]'
								}  text-[#334155] font-medium`}
							>
								{row.getVisibleCells().map((cell) => (
									<TableCell
										key={cell.id}
										className='text-justify py-4 border-b text-[12px]'
									>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</TableCell>
								))}
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell colSpan={columns.length} className='h-24 text-center'>
								No results, please redefine your search input
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</div>
	);
}
