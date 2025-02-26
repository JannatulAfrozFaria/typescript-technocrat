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

interface ContactDataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	handleContactActions: (
		actionType: 'view-details' | 'edit' | 'delete',
		contactId: string
	) => void;
}

export default function ContactDataTable<TData, TValue>({
	columns,
	data,
	handleContactActions,
}: ContactDataTableProps<TData, TValue>) {
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		meta: {
			handleContactActions,
		},
	});

	return (
		<div className='min-w-full'>
			<Table className='w-full p-6'>
				<TableHeader className='font-bold'>
					{table.getHeaderGroups().map((headerGroup) => (
						<TableRow key={headerGroup.id} className='border-b'>
							{headerGroup.headers.map((header) => {
								return (
									<TableHead
										key={header.id}
										className='py-4 text-justify text-[12px] text-[#475569] font-medium'
									>
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef.header,
													header.getContext()
												)}
									</TableHead>
								);
							})}
						</TableRow>
					))}
				</TableHeader>
				<TableBody className='w-full border-b text-[10px] xl:text-[16px]'>
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
										className='text-justify py-4 border-b text-sm'
									>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</TableCell>
								))}
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell colSpan={columns?.length} className='h-24 text-center'>
								No results, please redefine your search input
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</div>
	);
}
