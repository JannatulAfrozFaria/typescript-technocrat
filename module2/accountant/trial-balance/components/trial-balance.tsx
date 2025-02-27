'use client';
import React, { useEffect, useState, useTransition } from 'react';
import { trialBalanceTableColumns } from './trial-balance-table-columns';
import type { JournalEntry } from '@/types/types';
import { useDebounce } from 'use-debounce';
import Loader from '@/components/loader';
import HeaderWithButtons from '@/components/header-with-buttons';
import TrialBalanceTopBar from './trial-balance-top-bar';
import TrialBalanceDataTable from './trial-balance-data-table';

//TODO: import dynamic Data for Chart
const data: JournalEntry[] = [
	{
		id: '1',
		date: new Date('01.01.2025'),
		description: 'Invoice payment from client Nicolas',
		account: 'Cash',
		debit: 1200,
		credit: '-',
		amount: 1200,
		type: 'Assets',
	},
	{
		id: '2',
		date: new Date('01.05.2025'),
		description: 'Invoice payment from client Omar',
		account: 'Accounts receivable',
		debit: '-',
		credit: 3000,
		amount: 3000,
		type: 'Assets',
	},
	{
		id: '3',
		date: new Date('01.09.2025'),
		description: 'Office rent payment',
		account: 'Rent expense',
		debit: 8000,
		credit: '-',
		amount: 8000,
		type: 'Expenses',
	},
	{
		id: '4',
		date: new Date('02.01.2025'),
		description: 'Purchased Wireless Mouse',
		account: 'Cash',
		debit: '-',
		credit: 5000,
		amount: 5000,
		type: 'Assets',
	},
	{
		id: '5',
		date: new Date('02.07.2025'),
		description: 'Equipment purchase',
		account: 'Machinery & equipment',
		debit: 3200,
		credit: '-',
		amount: 3200,
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
		date: new Date('03.09.2025'),
		description: 'Loan repayment',
		account: 'Loan payable',
		debit: 2500,
		credit: '-',
		amount: 2500,
		type: 'Liabilities',
	},
	{
		id: '8',
		date: new Date('04.02.2025'),
		description: 'Loan repayment',
		account: 'Cash',
		debit: '-',
		credit: 4000,
		amount: 4000,
		type: 'Assets',
	},
	{
		id: '9',
		date: new Date('04.08.2025'),
		description: 'Employee salary payment',
		account: 'Salaries expense',
		debit: 1000,
		credit: '-',
		amount: 1000,
		type: 'Expenses',
	},
	{
		id: '10',
		date: new Date('05.06.2025'),
		description: 'Purchased Wall Clock',
		account: 'Cash',
		debit: '-',
		credit: 460,
		amount: 460,
		type: 'Assets',
	},
	{
		id: '11',
		date: new Date('05.07.2025'),
		description: 'Purchased Clipboards (Pack of 5)',
		account: 'Cash',
		debit: 2500,
		credit: '-',
		amount: 2500,
		type: 'Assets',
	},
	{
		id: '12',
		date: new Date('06.04.2025'),
		description: 'Sales revenue from product',
		account: 'Sales revenue',
		debit: '-',
		credit: 6000,
		amount: 6000,
		type: 'Revenues',
	},
	{
		id: '13',
		date: new Date('06.07.2025'),
		description: 'Employee salary payment',
		account: 'Cash',
		debit: 900,
		credit: '-',
		amount: 900,
		type: 'Assets',
	},
	{
		id: '14',
		date: new Date('06.12.2025'),
		description: 'Sales revenue from product',
		account: 'Cash',
		debit: '-',
		credit: 250,
		amount: 250,
		type: 'Assets',
	},
	{
		id: '15',
		date: new Date('07.02.2025'),
		description: 'Purchased LED Desk Lamp',
		account: 'Cash',
		debit: 450,
		credit: '-',
		amount: 450,
		type: 'Assets',
	},
];

const itemsPerPage = 10;

export default function TrialBalance() {
	const [isPending, startTransition] = useTransition();
	const [loadingStatus, setLoadingStatus] = useState<{
		isLoading: boolean;
		message?: string;
	}>({
		isLoading: true,
		message: 'Fetching your Trial Balance...',
	});
	const [showJournalEntryFormModal, setShowJournalEntryFormModal] =
		useState(false);
	const [searchTerm, setSearchTerm] = useState('');
	const [debouncedSearch] = useDebounce(searchTerm, 300);
	const [filteredData, setFilteredData] = useState<JournalEntry[]>(data);
	const [currentPageNumber, setCurrentPageNumber] = useState(0);
	const [filters, setFilters] = useState<{ type?: string }>({});

	useEffect(() => {
		const timer = setTimeout(() => {
			setLoadingStatus({
				isLoading: false,
				message: '',
			});
		}, 2000);
		return () => clearTimeout(timer);
	}, []);

	useEffect(() => {
		const lowercasedSearch = debouncedSearch.toLowerCase();
		const filtered = data.filter((item) => {
			const matchesSearch =
				item.description?.toLowerCase().includes(lowercasedSearch) ||
				item.account?.toLowerCase().includes(lowercasedSearch);

			const matchesFilters = !filters.type || item.type === filters.type;

			return matchesSearch && matchesFilters;
		});

		setFilteredData(filtered);
		setCurrentPageNumber(0);
	}, [debouncedSearch, data, filters]);

	// const totalPages = Math.ceil(filteredData.length / itemsPerPage);
	// const paginatedData = filteredData.slice(
	// 	currentPageNumber * itemsPerPage,
	// 	(currentPageNumber + 1) * itemsPerPage
	// );

	// const canGoToPreviousPage = () => currentPageNumber > 0;
	// const canGoToNextPage = () => currentPageNumber < totalPages - 1;

	// const handlePageChange = (direction: 'next' | 'previous') => {
	// 	startTransition(() => {
	// 		if (direction === 'next' && canGoToNextPage()) {
	// 			setCurrentPageNumber((prev) => prev + 1);
	// 		} else if (direction === 'previous' && canGoToPreviousPage()) {
	// 			setCurrentPageNumber((prev) => prev - 1);
	// 		}
	// 	});
	// };

	if (loadingStatus.isLoading || isPending) {
		return <Loader message={loadingStatus.message} />;
	}

	return (
		<div className='min-h-screen bg-[#f8fafc]'>
			{data?.length > 0 ? (
				<div className='flex flex-col w-full mx-auto p-8'>
					<div>
						<HeaderWithButtons
							title='Trial Balance'
							selectText='Download Report'
						/>
					</div>
					<div className='rounded-3xl border-2 border-[#e2e8f0] bg-white my-6 p-4'>
						<TrialBalanceTopBar
							searchTerm={searchTerm}
							setSearchTerm={setSearchTerm}
						/>
						<TrialBalanceDataTable
							data={filteredData}
							columns={trialBalanceTableColumns}
						/>
						{/* <Pagination
							handlePageChange={handlePageChange}
							isPending={isPending}
							canGoToPreviousPage={canGoToPreviousPage}
							canGoToNextPage={canGoToNextPage}
							currentPageNumber={currentPageNumber}
							totalPages={totalPages}
						/> */}
					</div>
				</div>
			) : (
				// <EmptyPage
				// 	heading='No Trial Balance found'
				// 	subtitle='Record a new trial balance manually'
				// 	buttonText='+ Create Trial Balance'
				// 	buttonLink='/en/products/new-product'
				// 	SvgComponent={SalesHomeImage}
				// />
				''
			)}
		</div>
	);
}
