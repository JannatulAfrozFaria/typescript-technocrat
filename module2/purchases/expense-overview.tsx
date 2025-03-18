'use client';
import React, { useEffect, useState, useTransition } from 'react';
import { expenseTableColumns } from './expense-table-columns';
import HeaderWithDropDown from '@/components/header-with-dropdown';
import BreadCrumbs from '@/components/bread-crumbs';
import ExpenseDataTable from './expense-data-table';
// import type { Invoice } from '@/types/types';
import { useDebounce } from 'use-debounce';
import RegisterPaymentModal from '../../../../../components/sales-and-purchases/register-payment-modal';
import SummaryChart, {
	type ChartData,
} from '@/components/sales-and-purchases/summary-chart';
import Loader from '@/components/loader';
import { toast } from 'sonner';
import ConfirmDeleteModal from '@/components/confirm-delete-modal';
import Pagination from '@/components/pagination';
import ExpenseTopBar from './expense-top-bar';
import EmptyPage from '@/components/empty-page';
import ExpenseHomeImage from '@/components/icon-components/expense-home-image';
import type { Invoice } from '@/types/prisma-types';
//TODO: import dynamic Data for Chart
const data: Invoice[] = [
	{
		id: '1',
		customerContact: 'Acme ITD.',
		invoiceNumber: 'INV-001',
		dueDate: new Date('2025-06-01').toISOString(),
		status: 'Paid',
		totalAmount: 249,
		grandTotal: 1200,
	},
	{
		id: '2',
		customerContact: 'Gadgets 360',
		invoiceNumber: 'INV-002',
		dueDate: new Date('2025-01-11').toISOString(),
		status: 'Outstanding',
		totalAmount: 109,
		grandTotal: 4000,
	},
];
const itemsPerPage = 5;
//to view----empty---page:
// const data: [] = [];

const expenseGraphData: ChartData[] = [
	{
		id: 1,
		type: 'total',
		title: 'Total Expenses',
		amount: '0.00',
		subtitle: 18,
		subTitleText: 'Invoices',
	},
	{
		id: 2,
		type: 'overdue',
		title: 'Overdue Expenses',
		amount: '0.00',
		subtitle: 7,
		subTitleText: 'Overdue',
	},
	{
		id: 3,
		type: 'outstanding',
		title: 'Outstanding Expenses',
		amount: '0.00',
		subtitle: 21,
		subTitleText: 'Outstanding',
	},
];
export default function ExpenseOverview() {
	//--------------------------------------------
	const [isPending, startTransition] = useTransition();
	const [loadingStatus, setLoadingStatus] = useState<{
		isLoading: boolean;
		message?: string;
	}>({
		isLoading: true,
		message: 'Fetching your expenses...',
	});
	//--------------------------------------------
	const [searchTerm, setSearchTerm] = useState('');
	const [debouncedSearch] = useDebounce(searchTerm, 300);
	const [filteredData, setFilteredData] = useState<Invoice[]>(data);
	const [currentPageNumber, setCurrentPageNumber] = useState(0);

	// Simulated loading effect
	useEffect(() => {
		const timer = setTimeout(() => {
			setLoadingStatus({
				isLoading: false,
				message: '',
			});
		}, 2000); // Show loader for 2 seconds
		return () => clearTimeout(timer);
	}, []);

	useEffect(() => {
		if (debouncedSearch) {
			const lowercasedSearch = debouncedSearch.toLowerCase();
			const filtered = data.filter(
				(item) =>
					item.customerContact?.toLowerCase().includes(lowercasedSearch) ||
					item.status?.toLowerCase().includes(lowercasedSearch)
			);
			setFilteredData(filtered);
		} else {
			setFilteredData(data);
		}
		// setCurrentPageNumber(1);
		setCurrentPageNumber(0);
	}, [debouncedSearch, data]);

	const totalPages = Math.ceil(filteredData.length / itemsPerPage);
	const paginatedData = filteredData.slice(
		currentPageNumber * itemsPerPage,
		(currentPageNumber + 1) * itemsPerPage
	);

	//-------------------------------------------------------------
	const canGoToPreviousPage = () => currentPageNumber > 0;
	const canGoToNextPage = () => currentPageNumber < totalPages - 1;
	const handlePageChange = (direction: 'next' | 'previous') => {
		startTransition(() => {
			if (direction === 'next' && canGoToNextPage()) {
				setCurrentPageNumber((prev) => prev + 1);
			} else if (direction === 'previous' && canGoToPreviousPage()) {
				setCurrentPageNumber((prev) => prev - 1);
			}
		});
	};
	//-------------------------------------------------------------

	//FOR---HANDLING----REGISTER-----MODAL
	const [isRegisterPaymentModalOpen, setIsRegisterPaymentModalOpen] =
		useState(false);
	const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

	const handleRegisterPayment = (invoice: Invoice) => {
		setSelectedInvoice(invoice);
		setIsRegisterPaymentModalOpen(true);
	};

	const closeRegisterPaymentModal = () => {
		setIsRegisterPaymentModalOpen(false);
		setSelectedInvoice(null);
	};

	//DROPDOWN----&----DELETE-----HANDLER----
	const [openDeleteDialogId, setOpenDeleteDialogId] = useState<string | null>(
		null
	);
	const [showInvoiceDeleteConfirmDialog, setShowInvoiceDeleteConfirmDialog] =
		useState(false);
	const handleSelectExpense = (invoiceId: String) => {
		const foundExpense = paginatedData?.find(({ id }) => id === invoiceId);

		if (foundExpense) setSelectedInvoice(foundExpense);
		return foundExpense;
	};
	const handleExpenseActions = (
		actionType: 'edit' | 'delete' | 'download',
		invoiceId: String
	) => {
		handleSelectExpense(invoiceId);
		switch (actionType) {
			case 'edit':
				// setShowContactFormModal(true);
				alert('Edit Modal UI should be created');
				break;
			case 'delete':
				setShowInvoiceDeleteConfirmDialog(true);
				break;
		}
	};

	const handleDeleteExpense = () => {
		try {
			toast.success('Expense deleted successfully');
			setOpenDeleteDialogId(null);
		} catch (error) {
			toast.error('Failed to delete expense');
			console.error('Error deleting expense:', error);
		}
	};

	if (loadingStatus.isLoading || isPending) {
		return <Loader message={loadingStatus.message} />;
	}

	return (
		<div className='min-h-screen  bg-[#f8fafc]'>
			{data?.length > 0 ? (
				<div className='flex flex-col  w-full  mx-auto p-8'>

					<div>
						
					</div>
					<div className='rounded-3xl border-2 border-[#e2e8f0]  bg-white my-6'>
						{/*TOP---BAR*/}
						
						
						{/* modal */}
						{selectedInvoice && (
							<RegisterPaymentModal
								isOpen={isRegisterPaymentModalOpen}
								onClose={closeRegisterPaymentModal}
								invoice={selectedInvoice}
							/>
						)}
						

						{/* PAGINATION------ */}
						<div className='px-4'>
							<Pagination
								handlePageChange={handlePageChange}
								isPending={isPending}
								canGoToPreviousPage={canGoToPreviousPage}
								canGoToNextPage={canGoToNextPage}
								currentPageNumber={currentPageNumber}
								totalPages={totalPages}
							/>
						</div>
					</div>
				</div>
			) : (
				<EmptyPage
					heading='No purchases yet!'
					subtitle='Start driving growth by creating your first sale and tracking
								your progress with ease.'
					buttonText=' + New purchase'
					buttonLink='/en/purchases/new-purchase'
					SvgComponent={ExpenseHomeImage}
				/>
			)}
		</div>
	);
}
