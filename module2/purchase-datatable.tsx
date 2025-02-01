'use client';

import {
	ColumnDef,
	ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from '@tanstack/react-table';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
// import { Invoice } from '../../../../types/prisma-types';

interface Invoice {
	id: string;
	name: string;
	email: string;
	phone: string;
	entity: 'BUSINESS' | 'INDIVIDUAL';
	contactType: string;
	number?: string;
	invoiceDate?: string;
	dueDate?: string;
	reference?: string;
	ourContact?: string;
	items: {
		description: string;
		qty: number;
		price: number;
		discount: number;
		vat: number;
		total: number;
	}[];
	subTotal: number;
	grandTotal: number;
	terms?: string;
	comments?: string;
	createdAt: string;
	updatedAt: string;
}
interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
}

export function DataTable({ columns, data }: DataTableProps<Invoice, Invoice>) {
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[]
	);
	const [currentPage, setCurrentPage] = useState(1);
	const [filteredData, setFilteredData] = useState(data);

	const itemsPerPage = 5;
	const table = useReactTable({
		data: filteredData,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		state: {
			columnFilters,
			pagination: {
				pageIndex: currentPage - 1,
				pageSize: itemsPerPage,
			},
		},
	});
	const paginatedData = table.getPaginationRowModel().rows;

	return (
		<div>
			<div className=''>
				{/* Table Content */}
				<div className=' min-w-full pt-6 '>
					<table className='w-full py-6'>
						<thead className='font-bold  '>
							<tr className='border-b'>
								{columns.map((column) => (
									<th
										key={column.id}
										className=' pl-1 py-4 border-b font-medium text-center text-[12px]  text-[#475569]'
									>
										{flexRender(column.header, {})}
									</th>
								))}
							</tr>
						</thead>
						<tbody className='w-full border-b text-[12px] '>
							{paginatedData.length ? (
								paginatedData.map((row, index) => (
									<tr
										key={index}
										className={`${
											index % 2 === 0
												? 'bg-[#f8fafc] border-y-2 border-y-[#e2e8f0] hover:bg-[#F1F5F9] '
												: 'hover:bg-[#f8fafc] '
										}  text-[#334155] font-medium `}
									>
										{row.getVisibleCells().map((cell) => (
											<td key={cell.id} className='text-center py-4 border-b'>
												{flexRender(
													cell.column.columnDef.cell,
													cell.getContext()
												)}
											</td>
										))}
									</tr>
								))
							) : (
								<tr>
									<td colSpan={columns.length + 1} className='h-24 text-center'>
										No results.
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
				{/* PAGINATION----- */}
				<div className='flex items-center justify-between my-6 px-4'>
					<div>
						<Button
							disabled={currentPage === 1}
							onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
							className='bg-white font-semibold border-2 p-2 text-sm'
						>
							Previous
						</Button>{' '}
					</div>
					<div>
						<p>
							Page {currentPage} of{' '}
							{Math.ceil(filteredData.length / itemsPerPage)}
						</p>
					</div>
					<div>
						<Button
							disabled={
								currentPage >= Math.ceil(filteredData.length / itemsPerPage)
							}
							onClick={() => setCurrentPage((prev) => prev + 1)}
							className='bg-white font-semibold border-2 p-2 text-sm'
						>
							Next
						</Button>{' '}
					</div> 
				</div>
			</div>
		</div>
	);
}
