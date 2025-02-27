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
import type { JournalEntry } from '@/types/types';
import { CustomColumnMeta } from './trial-balance-table-columns';

interface TrialBalanceDataTableProps {
	data: JournalEntry[];
	columns: ColumnDef<JournalEntry, string | number>[];
}

export default function TrialBalanceDataTable({
	data,
	columns,
}: TrialBalanceDataTableProps) {
	// Initialize table using react-table
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		meta: {},
	});

	// Calculate totals
	const totalDebit = data.reduce((sum, entry) => {
		// Assuming debit is a number. If it might be a string, convert it
		return sum + (typeof entry.debit === 'number' ? entry.debit : 0);
	}, 0);
	const totalCredit = data.reduce((sum, entry) => {
		// Assuming credit is a number. If it might be a string (or '-'), convert it appropriately
		return sum + (typeof entry.credit === 'number' ? entry.credit : 0);
	}, 0);
	function isAccessorKeyColumn<T>(
		col: ColumnDef<T, any>
	): col is ColumnDef<T, any> & { accessorKey: string } {
		return 'accessorKey' in col;
	}
	const formatIndianNumber = (amount: number): string => {
		return amount.toLocaleString('en-IN'); // Formats according to Indian system
	};
	// Render table with an extra row for totals
	return (
		<div className='min-w-full'>
			<Table className='w-full p-6'>
				<TableHeader className='font-bold'>
					{table.getHeaderGroups().map((headerGroup) => (
						<TableRow key={headerGroup.id} className='border-b'>
							{headerGroup.headers.map((header) => {
								const headerClassName =
									(
										header.column.columnDef.meta as CustomColumnMeta<
											JournalEntry,
											string | number
										>
									)?.headerClassName || '';

								return (
									<TableHead
										key={header.id}
										className={`py-4 pl-6 text-[12px] text-[#475569] font-medium ${headerClassName}`}
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
				<TableBody className='w-full border-b '>
					{table.getRowModel().rows?.length ? (
						table.getRowModel().rows.map((row, rowIndex) => (
							<TableRow
								key={row.id}
								className={`${
									rowIndex % 2 === 0
										? 'bg-[#f8fafc] border-y-2 border-y-[#e2e8f0] hover:bg-[#F1F5F9]'
										: 'hover:bg-[#f8fafc]'
								}  text-[#334155] font-medium `}
							>
								{row.getVisibleCells().map((cell) => (
									<TableCell
										key={cell.id}
										className='text-justify py-4 border-b text-[12px] pl-6 '
									>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</TableCell>
								))}
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell colSpan={columns.length} className='h-24 text-center '>
								No results, please redefine your search input
							</TableCell>
						</TableRow>
					)}

					{/* Total row */}
					<TableRow className='bg-[#e8edfc] font-semibold text-sm '>
						{columns.map((col, index) => {
							if (isAccessorKeyColumn(col)) {
								if (col.accessorKey === 'debit') {
									return (
										<TableCell
											key={index}
											className='text-right py-4 border-t text-sm pl-6 last:rounded-br-2xl'
										>
											$
											{typeof totalDebit === 'number'
												? formatIndianNumber(totalDebit)
												: totalDebit}
										</TableCell>
									);
								} else if (col.accessorKey === 'credit') {
									return (
										<TableCell
											key={index}
											className='text-right py-4 border-t text-sm pr-12 last:rounded-br-2xl'
										>
											$
											{typeof totalCredit === 'number'
												? formatIndianNumber(totalCredit)
												: totalCredit}
										</TableCell>
									);
								} else if (index === 0) {
									return (
										<TableCell
											key={index}
											className='py-4 border-t text-sm pl-6 first:rounded-bl-2xl'
										>
											Total
										</TableCell>
									);
								}
							}
							return (
								<TableCell
									key={index}
									className='py-4 border-t text-sm'
								></TableCell>
							);
						})}
					</TableRow>
				</TableBody>
			</Table>
		</div>
	);
}
