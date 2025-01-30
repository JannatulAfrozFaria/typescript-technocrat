'use client';
import { Sales } from '@prisma/client';
import { CellContext } from '@tanstack/react-table';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import InfoIcon from '@/components/icon-components/InfoIcon';
import RegisterPaymentModal from './RegisterPaymentModal';

export const columns: any = [
	{
		accessorKey: 'customer',
		header: 'Customer',
		cell: ({ row }: CellContext<Sales, string>) => (
			<div className='font-medium text-[#0f172a] '>
				{' '}
				{row.original.customer}{' '}
			</div>
		),
	},
	{
		accessorKey: 'invoiceNumber',
		header: 'Invoice number',
	},
	{
		accessorKey: 'date',
		header: 'Date',
		cell: ({ row }: CellContext<Sales, string>) => {
			const rawDate = row.original.date;
			const formattedDate = new Date(rawDate).toLocaleDateString('en-CA'); // 'en-CA' formats as YYYY-MM-DD
			return <span>{formattedDate}</span>;
		},
	},

	{
		accessorKey: 'status',
		header: 'Status',
		cell: ({ row }: CellContext<Sales, string>) => {
			return (
				<div>
					<span
						className={`py-1 px-3 border-2  rounded-full
							${
								row.original.status === 'Paid' &&
								'border-[#83d8a9] bg-[#edfcf2] text-[#16b364]'
							}
							${
								row.original.status === 'Overdue' &&
								'border-[#ff9d98] bg-[#fff3f2] text-[#e9362c]'
							}
							${
								row.original.status === 'Outstanding' &&
								'border-[#d9d6fe] bg-[#f4f3ff] text-[#7a5af8]'
							}
							`}
					>
						{row.original.status}
					</span>
				</div>
			);
		},
	},
	{
		accessorKey: 'totalAmount',
		header: 'Total amount',
	},

	{
		accessorKey: 'icon',
		header: () => <div></div>,
		cell: ({ row }: CellContext<Sales, string>) => {
			const [isDropdownOpen, setDropdownOpen] = useState(false);
			const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
			const [open, setOpen] = useState(false);
			const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);

			const handleDelete = () => {
				console.log('Deleted item:', row.original);
				setDeleteDialogOpen(false); // Close the dialog after deletion
			};
			const rawDate = row.original.date;
			const formattedDate = new Date(rawDate).toLocaleDateString('en-CA');
			const handleOpenModal = () => {
				setOpen(true);
			};

			const handleCloseModal = () => {
				setOpen(false);
			};
			return (
				<div className='flex gap-4 items-center justify-end pr-4'>
					{row.original.status === 'Overdue' ||
					row.original.status === 'Outstanding' ? (
						<div
							onClick={handleOpenModal}
							className='bg-[#f8fafc] text-[#0f172a] border-2 border-[#e2e8f0] rounded-md font-semibold py-2 px-4 cursor-pointer '
						>
							Register Payment
						</div>
					) : (
						// <Dialog>
						// 	<DialogTrigger>
						// 		<div className='bg-[#f8fafc] text-[#0f172a] border-2 border-[#e2e8f0] rounded-md font-semibold py-2 px-4 cursor-pointer '>
						// 			Register payment
						// 		</div>
						// 	</DialogTrigger>
						// 	<DialogContent style={{ width: '600px' }}>
						// 		<DialogHeader>
						// 			<DialogTitle>
						// 				<div className='grid grid-cols-1'>
						// 					<h1 className='font-semibold text-[28px] mb-6 '>
						// 						Register Payment
						// 					</h1>
						// 				</div>
						// 			</DialogTitle>
						// 			<DialogDescription>
						// 				<div className='flex items-start justify-between'>
						// 					<div>
						// 						<p className='text-xs text-[#334155] '>Sale amount</p>
						// 						<p className='font-semibold text-lg text-black'>
						// 							{' '}
						// 							$ {row.original.grandTotal} USD{' '}
						// 						</p>
						// 						<p className='text-xs text-[#475569]'>
						// 							{' '}
						// 							Euro € {row.original.grandTotal * 0.95947}{' '}
						// 						</p>
						// 						<p className='text-xs text-[#334155] mt-3'>
						// 							Invoice balance
						// 						</p>
						// 						<p className='font-semibold text-lg text-black'>
						// 							{' '}
						// 							$ {row.original.grandTotal} USD{' '}
						// 						</p>
						// 						<p className='text-xs text-[#475569]'>
						// 							{' '}
						// 							Euro € {row.original.grandTotal * 0.95947}{' '}
						// 						</p>
						// 					</div>
						// 					<div>
						// 						<span className='border-2 border-[#e2e8f0] rounded-xl py-2 px-4'>
						// 							{formattedDate}
						// 						</span>
						// 					</div>
						// 				</div>
						// 				<div className='my-6 flex gap-2 items-center p-2 rounded-xl bg-[#e8edfc] border-2 border-[#e2e8f0]'>
						// 					<div>
						// 						<InfoIcon />{' '}
						// 					</div>
						// 					<div>
						// 						<p className='text-sm font-semibold text-black'>
						// 							Outstanding balance
						// 						</p>
						// 						<p className='text-[#475569] text-xs'>
						// 							This is the remaining amount the customer owes: Euro
						// 							€3837.88
						// 						</p>
						// 					</div>
						// 				</div>
						// 				<div>
						// 					<RegisterPaymentForm />
						// 				</div>
						// 			</DialogDescription>
						// 		</DialogHeader>
						// 	</DialogContent>
						// </Dialog>

						''
					)}
					<div className='flex justify-end pr-4 cursor-pointer relative'>
						{/* Custom Dropdown Trigger */}
						<button className='' onClick={toggleDropdown}>
							{row.original.icon}
						</button>

						{/* Dropdown Menu */}
						{isDropdownOpen && (
							<div
								className='absolute top-full right-0 mt-1  bg-white border rounded shadow-md z-10 text-left'
								onClick={() => setDropdownOpen(false)} // Close dropdown on any click
							>
								<ul className='py-1'>
									<li
										className='px-4 py-2 hover:bg-gray-100 cursor-pointer'
										onClick={() => console.log('Edit clicked')}
									>
										Edit
									</li>
									<li
										className='px-4 py-2 hover:bg-gray-100 cursor-pointer'
										onClick={() => setDeleteDialogOpen(true)}
									>
										Delete
									</li>
									<li
										className='px-4 py-2 hover:bg-gray-100 cursor-pointer'
										onClick={() => console.log('Download clicked')}
									>
										Download
									</li>
								</ul>
							</div>
						)}

						{/* Delete Confirmation Dialog */}
						{isDeleteDialogOpen && (
							<div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
								<div className='bg-white p-6 rounded shadow-md w-96'>
									<h3 className='text-lg font-bold mb-4'>Confirm Deletion</h3>
									<p className='mb-6'>
										Are you sure you want to delete this item?
									</p>
									<div className='grid grid-cols-2 gap-2'>
										<button
											className='px-4 py-2 bg-gray-300 rounded hover:bg-gray-400'
											onClick={() => setDeleteDialogOpen(false)}
										>
											Cancel
										</button>
										<button
											className='px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600'
											onClick={handleDelete}
										>
											Delete
										</button>
									</div>
								</div>
							</div>
						)}
					</div>
					<RegisterPaymentModal
						openModal={open}
						closeModal={handleCloseModal}
					/>
					;
				</div>
			);
		},
	},
];
