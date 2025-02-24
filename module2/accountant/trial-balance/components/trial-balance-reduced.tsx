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
						
					</div> 
				</div>
			) : (
				
				''
			)}
		</div>
	);
}
