'use client';
import React, { useEffect, useState, useTransition } from 'react';
import { journalEntriesTableColumns } from './journal-entries-table-columns';
import BreadCrumbs from '@/components/bread-crumbs';
import type { JournalEntry } from '@/types/types';
import { useDebounce } from 'use-debounce';
import Loader from '@/components/loader';
import { toast } from 'sonner';
import ConfirmDeleteModal from '@/components/confirm-delete-modal';
import Pagination from '@/components/pagination';
import JournalEntriesDataTable from './journal-entries-data-table';
import HeaderWithButtons from '@/components/header-with-buttons';
import JournalEntriesTopBar from './journal-entries-top-bar';
import EmptyPage from '@/components/empty-page';
import SalesHomeImage from '@/components/icon-components/sales-home-image';
import JournalEntryModal from './journal-entry-form/journal-entry-modal';

//TODO: import dynamic Data for Chart
const data: JournalEntry[] = [
	{
		id: '1',
		date: new Date('03.02.2025'),
		description: 'Invoice payment from client Nicolas',
		account: 'cash',
		debit: 1200,
		credit: '-',
		amount: 1200,
		type: 'Assets',
	},
	{
		id: '2',
		date: new Date('03.02.2025'),
		description: 'Invoice payment from client Omar',
		account: 'Accounts receivable',
		debit: '-',
		credit: 300,
		amount: 300,
		type: 'Assets',
	},
	{
		id: '3',
		date: new Date('03.02.2025'),
		description: 'Office rent payment',
		account: 'Rent expense',
		debit: 800,
		credit: '-',
		amount: 800,
		type: 'Expenses',
	},
	{
		id: '4',
		date: new Date('03.02.2025'),
		description: 'Purchased Wireless Mouse',
		account: 'cash',
		debit: '-',
		credit: 500,
		amount: 500,
		type: 'Assets',
	},
	{
		id: '5',
		date: new Date('03.02.2025'),
		description: 'Equipment purchase',
		account: 'Machinery & equipment',
		debit: 320,
		credit: '-',
		amount: 320,
		type: 'Assets',
	},
	{
		id: '6',
		date: new Date('03.02.2025'),
		description: 'Purchased Scientific Calculator',
		account: 'Accounts payable',
		debit: '-',
		credit: 700,
		amount: 700,
		type: 'Liabilities',
	},
	{
		id: '7',
		date: new Date('03.02.2025'),
		description: 'Loan repayment',
		account: 'Loan payable',
		debit: 250,
		credit: '-',
		amount: 250,
		type: 'Liabilities',
	},
	{
		id: '8',
		date: new Date('03.02.2025'),
		description: 'Loan repayment',
		account: 'cash',
		debit: '-',
		credit: 400,
		amount: 400,
		type: 'Assets',
	},
	{
		id: '9',
		date: new Date('03.02.2025'),
		description: 'Employee salary payment',
		account: 'Salaries expense',
		debit: 100,
		credit: '-',
		amount: 100,
		type: 'Expenses',
	},
	{
		id: '10',
		date: new Date('03.02.2025'),
		description: 'Purchased Wall Clock',
		account: 'cash',
		debit: '-',
		credit: 460,
		amount: 460,
		type: 'Assets',
	},
	{
		id: '11',
		date: new Date('03.02.2025'),
		description: 'Purchased Clipboards (Pack of 5)',
		account: 'cash',
		debit: 25,
		credit: '-',
		amount: 25,
		type: 'Assets',
	},
	{
		id: '12',
		date: new Date('03.02.2025'),
		description: 'Sales revenue from product',
		account: 'Sales revenue',
		debit: '-',
		credit: 600,
		amount: 600,
		type: 'Revenues',
	},
	{
		id: '13',
		date: new Date('03.02.2025'),
		description: 'Employee salary payment',
		account: 'cash',
		debit: 90,
		credit: '-',
		amount: 90,
		type: 'Assets',
	},
	{
		id: '14',
		date: new Date('03.02.2025'),
		description: 'Sales revenue from product',
		account: 'cash',
		debit: '-',
		credit: 250,
		amount: 250,
		type: 'Assets',
	},
	{
		id: '15',
		date: new Date('03.02.2025'),
		description: 'Purchased LED Desk Lamp',
		account: 'cash',
		debit: 45,
		credit: '-',
		amount: 45,
		type: 'Assets',
	},
];

//to view----empty---page:
// const data = [];
const itemsPerPage = 10;

export default function JournalEntries() {
	const [isPending, startTransition] = useTransition();
	const [loadingStatus, setLoadingStatus] = useState<{
		isLoading: boolean;
		message?: string;
	}>({
		isLoading: true,
		message: 'Fetching your Journal Entries...',
	});
	const [showJournalEntryFormModal, setShowJournalEntryFormModal] =
		useState(false);
	const [searchTerm, setSearchTerm] = useState('');
	const [debouncedSearch] = useDebounce(searchTerm, 300);
	const [filteredData, setFilteredData] = useState<JournalEntry[]>(data);
	const [currentPageNumber, setCurrentPageNumber] = useState(0);

	const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
	const [showDeleteConfirmDialog, setShowDeleteConfirmDialog] = useState(false);

	const [filters, setFilters] = useState<{ type?: string }>({});
	// Simulated loading effect
	useEffect(() => {
		const timer = setTimeout(() => {
			setLoadingStatus({
				isLoading: false,
				message: '',
			});
		}, 2000);
		return () => clearTimeout(timer);
	}, []);

	// useEffect(() => {
	// 	if (debouncedSearch) {
	// 		const lowercasedSearch = debouncedSearch.toLowerCase();
	// 		const filtered = data.filter(
	// 			(item) =>
	// 				item.description?.toLowerCase().includes(lowercasedSearch) ||
	// 				item.account?.toLowerCase().includes(lowercasedSearch)
	// 		);
	// 		setFilteredData(filtered);
	// 	} else {
	// 		setFilteredData(data);
	// 	}
	// 	setCurrentPageNumber(0);
	// }, [debouncedSearch, data]);

	useEffect(() => {
		const lowercasedSearch = debouncedSearch.toLowerCase();
		const filtered = data.filter((item) => {
			const matchesSearch =
				item.description?.toLowerCase().includes(lowercasedSearch) ||
				item.account?.toLowerCase().includes(lowercasedSearch);

			const matchesFilters =
				// (!filters.account || item.account === filters.account) &&
				!filters.type || item.type === filters.type;

			return matchesSearch && matchesFilters;
		});

		setFilteredData(filtered);
		setCurrentPageNumber(0);
	}, [debouncedSearch, data, filters]);
	const totalPages = Math.ceil(filteredData.length / itemsPerPage);
	const paginatedData = filteredData.slice(
		currentPageNumber * itemsPerPage,
		(currentPageNumber + 1) * itemsPerPage
	);
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

	const handleSelectJournalEntry = (journalEntryId: string) => {
		const foundJournalEntry = paginatedData.find(
			({ id }) => id === journalEntryId
		);
		if (foundJournalEntry) setSelectedEntry(foundJournalEntry);
		return foundJournalEntry;
	};

	const handleJournalEntryActions = (
		actionType: 'edit' | 'delete',
		journalEntryId: string
	) => {
		handleSelectJournalEntry(journalEntryId);
		switch (actionType) {
			case 'edit':
				// Handle edit action
				break;
			case 'delete':
				setShowDeleteConfirmDialog(true);
				break;
		}
	};

	const handleConfirmDelete = () => {
		try {
			// Delete logic here
			toast.success('Journal Entry deleted successfully');
			setShowDeleteConfirmDialog(false);
		} catch (error) {
			toast.error('Failed to delete Journal Entry ');
			console.error('Error deleting Journal Entry :', error);
		}
	};

	if (loadingStatus.isLoading || isPending) {
		return <Loader message={loadingStatus.message} />;
	}

	return (
		<div className='min-h-screen bg-[#f8fafc]'>
			{data?.length > 0 ? (
				<div className='flex flex-col w-full mx-auto p-8'>
					{/* <BreadCrumbs /> */}
					<div>
						<HeaderWithButtons
							title='Journal entries'
							selectText='Download Report'
							button2Text={'New Entry'}
							button2Link={'/en/purchases/new-expense'}
							setStateFunction={setShowJournalEntryFormModal}
						/>
					</div>
					<JournalEntryModal
						isOpen={showJournalEntryFormModal}
						onOpenChange={setShowJournalEntryFormModal}
					/>
					<div className='rounded-3xl border-2 border-[#e2e8f0] bg-white my-6 p-4'>
						<JournalEntriesTopBar
							searchTerm={searchTerm}
							setSearchTerm={setSearchTerm}
							filters={filters}
							setFilters={setFilters}
						/>

						<JournalEntriesDataTable
							data={paginatedData}
							columns={journalEntriesTableColumns}
							handleJournalEntryActions={handleJournalEntryActions}
						/>

						<ConfirmDeleteModal
							isOpen={showDeleteConfirmDialog}
							onOpenChange={setShowDeleteConfirmDialog}
							handleDelete={handleConfirmDelete}
							title='Delete Product'
							description='Are you sure you want to delete this product? This action cannot be undone.'
							confirmButtonText='Delete'
							cancelButtonText='Cancel'
						/>

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
			) : (
				<EmptyPage
					heading='No journal entries found'
					subtitle='Record a journal entries manually'
					buttonText='+ Create a new entry'
					buttonLink='/en/products/new-product'
					SvgComponent={SalesHomeImage}
				/>
			)}
		</div>
	);
}
