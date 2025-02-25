'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import React, { useEffect, useState, useTransition } from 'react';
import { activeTableColumns } from './active-tab/active-table-columns';
import LostDataTable from './lost-tab/lost-data-table';
import { lostTableColumns } from './lost-tab/lost-table-columns';
import { soldTableColumns } from './sold-tab/sold-table-columns';
import { allTableColumns } from './all-tab/all-table-columns';
import type { Asset } from '@/types/types';
import { useDebounce } from 'use-debounce';
import ConfirmDeleteModal from '@/components/confirm-delete-modal';
import { toast } from 'sonner';
import Loader from '@/components/loader';
import Pagination from '@/components/pagination';
import HeaderWithButtons from '@/components/header-with-buttons';
import AssetsTopBar from './assets-top-bar';
import SoldDataTable from './sold-tab/sold-data-table';
import AllDataTable from './all-tab/all-data-table';
import ActiveDataTable from './active-tab/active-data-table';
import AssetModal from './asset-form/asset-modal';

type TabKey = 'active' | 'lost' | 'sold' | 'all';

const tabConfig = [
	{
		key: 'active',
		label: 'Active',
		buttonText: '+ New Invoice',
		buttonLink: '/en/sales/new-invoice',
	},
	{
		key: 'lost',
		label: 'Lost',
		buttonText: '+ New Offer',
		buttonLink: '/en/sales/new-offer',
	},
	{
		key: 'sold',
		label: 'Sold',
		buttonText: '+ New Recurring Invoice',
		buttonLink: '/en/sales/recurring-invoice',
	},
	{
		key: 'all',
		label: 'All',
		buttonText: '+ New Credit Note',
		buttonLink: '/en/sales/new-credit-note',
	},
];

const tableComponents = {
	active: ActiveDataTable,
	lost: LostDataTable,
	sold: SoldDataTable,
	all: AllDataTable,
};

const tableColumns = {
	active: activeTableColumns,
	lost: lostTableColumns,
	sold: soldTableColumns,
	all: allTableColumns,
};

//TODO: remove dummy data and fetch dynamic data
const dummyData: Asset[] = [
	{
		id: '1',
		name: 'New Car',
		category: 'Demo Category',
		date: new Date('2025-06-01'),
		price: 25000,
		sellingPrice: 28000,
		productLife: '15 Years',
		status: 'Active',
		profitOrLoss: 'None',
		reasonForLoss: 'Fire',
		sellingDate: new Date('2025-06-15'),
	},
];

// const dummyData = [];

const dataByTab: Record<TabKey, Asset[]> = {
	active: dummyData.filter((item) => item.status === 'Active'),
	lost: dummyData.filter((item) => item.status === 'Lost'),
	sold: dummyData.filter((item) => item.status === 'Sold'),
	all: dummyData,
};

const itemsPerPage = 5;

export default function Assets() {
	const [isPending, startTransition] = useTransition();
	const [loadingStatus, setLoadingStatus] = useState<{
		isLoading: boolean;
		message?: string;
	}>({
		isLoading: true,
		message: 'Fetching your Assets data...',
	});

	const [activeTab, setActiveTab] = useState<TabKey>('active');
	const ActiveTable = tableComponents[activeTab];
	const activeColumns = tableColumns[activeTab];

	// const itemsPerPage = activeTab === 'active' ? 5 : 10;
	const itemsPerPage = 10;

	const [searchTerms, setSearchTerms] = useState<Record<TabKey, string>>({
		active: '',
		lost: '',
		sold: '',
		all: '',
	});
	const [debouncedSearch] = useDebounce(searchTerms[activeTab], 300);

	const [currentPageNumber, setCurrentPageNumber] = useState<
		Record<TabKey, number>
	>({
		active: 0,
		lost: 0,
		sold: 0,
		all: 0,
	});

	useEffect(() => {
		setTimeout(() => {
			setLoadingStatus({ isLoading: false });
		}, 2000);
	}, []);

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerms({ ...searchTerms, [activeTab]: e.target.value });
		// Reset pagination for the active tab only
		setCurrentPageNumber((prev) => ({
			...prev,
			[activeTab]: 0,
		}));
	};
	const handleTabChange = (value: string) => {
		setActiveTab(value as TabKey);
	};

	const filteredData = dataByTab[activeTab].filter((item) => {
		if (!debouncedSearch) return true;
		const search = debouncedSearch.toLowerCase();
		return (
			item.name?.toLowerCase().includes(search) ||
			item.status?.toLowerCase().includes(search)
		);
	});
	const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));
	const paginatedData = filteredData.slice(
		currentPageNumber[activeTab] * itemsPerPage,
		(currentPageNumber[activeTab] + 1) * itemsPerPage
	);
	const [showAssetFormModal, setShowAssetFormModal] = useState(false);
	const [isRegisterPaymentModalOpen, setIsRegisterPaymentModalOpen] =
		useState(false);
	const [selectedInvoice, setSelectedInvoice] = useState<Asset | null>(null);
	const [showContactDeleteConfirmDialog, setShowContactDeleteConfirmDialog] =
		useState(false);

	const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
	const [openDeleteDialogId, setOpenDeleteDialogId] = useState<string | null>(
		null
	);

	const handleSelectContact = (contactId: String) => {
		// user will either select a filtered contact or paginated contact
		const contacts = paginatedData.length ? paginatedData : '';
		const foundContact = paginatedData?.find(({ id }) => id === contactId);

		if (foundContact) setSelectedInvoice(foundContact);
		return foundContact;
	};
	const handleAssetActions = (
		actionType: 'edit' | 'delete',
		contactId: String
	) => {
		handleSelectContact(contactId);
		switch (actionType) {
			case 'edit':
				// setShowContactFormModal(true);
				alert('Edit modal UI should be created');
				break;
			case 'delete':
				setShowContactDeleteConfirmDialog(true);
				break;
		}
	};

	const handleConfirmDelete = () => {
		try {
			toast.success('Asset deleted successfully');
			setOpenDeleteDialogId(null);
		} catch (error) {
			toast.error('Failed to delete Asset');
			console.error('Error deleting Asset:', error);
		}
	};

	// Pagination utility functions
	const canGoToPreviousPage = () => currentPageNumber[activeTab] > 0;
	const canGoToNextPage = () => currentPageNumber[activeTab] < totalPages - 1;
	const handlePageChange = (direction: 'next' | 'previous') => {
		startTransition(() => {
			const currentTab = activeTab;
			if (direction === 'next' && canGoToNextPage()) {
				setCurrentPageNumber((prev) => ({
					...prev,
					[currentTab]: prev[currentTab] + 1,
				}));
			} else if (direction === 'previous' && canGoToPreviousPage()) {
				setCurrentPageNumber((prev) => ({
					...prev,
					[currentTab]: prev[currentTab] - 1,
				}));
			}
		});
	};

	if (loadingStatus.isLoading || isPending) {
		return <Loader message={loadingStatus.message} />;
	}
	return (
		<div className=' min-h-screen  bg-[#f8fafc] flex flex-col w-full  mx-auto p-8'>
			<HeaderWithButtons
				title='Assets'
				button2Text='Create new asset'
				setStateFunction={setShowAssetFormModal}
			/>
			<AssetModal
				isOpen={showAssetFormModal}
				onOpenChange={setShowAssetFormModal}
			/>
			<div className=' rounded-3xl border-2 border-[#e2e8f0]  bg-white my-6'>
				{/* TABS----- */}
				<Tabs value={activeTab} onValueChange={handleTabChange}>
					<div className='flex flex-col xl:flex-row items-center justify-between p-4 pb-0 gap-y-2 xl:gap-y-0'>
						<TabsList customPadding=''>
							{tabConfig.map((tab) => (
								<TabsTrigger key={tab.key} value={tab.key}>
									{tab.label}
								</TabsTrigger>
							))}
						</TabsList>
						{/* SEARCH & SELECT */}
						<AssetsTopBar
							activeTab={activeTab}
							searchTerms={searchTerms}
							handleSearchChange={handleSearchChange}
						/>
					</div>
					{tabConfig.map((tab) => (
						<TabsContent key={tab.key} value={tab.key} className='w-full'>
							{paginatedData.length > 0 ? (
								<div>
									<ActiveTable
										handleAssetActions={handleAssetActions}
										columns={activeColumns}
										data={paginatedData}
									/>
									{/* delete--- */}
									<ConfirmDeleteModal
										isOpen={showContactDeleteConfirmDialog}
										onOpenChange={setShowContactDeleteConfirmDialog}
										handleDelete={handleConfirmDelete}
										title='Delete Contact'
										description='Are you sure you want to delete this contact? This action cannot be undone.'
										confirmButtonText='Delete'
										cancelButtonText='Cancel'
									/>
									{/* PAGINATION---- */}
									<div className='px-4'>
										<Pagination
											handlePageChange={handlePageChange}
											isPending={isPending}
											canGoToPreviousPage={canGoToPreviousPage}
											canGoToNextPage={canGoToNextPage}
											currentPageNumber={currentPageNumber[activeTab]}
											totalPages={totalPages}
										/>
									</div>
								</div>
							) : (
								<div className='p-64 w-5/6 mx-auto text-center'>
									<p className='text-lg font-semibold mb-2'>
										You have not registered any{' '}
										{tab.label === 'All' ? '' : tab.label} assets
									</p>
									<button className='border-2 rounded-md border-[#e2e8f0] py-2 px-4 text-sm font-medium text-[#334155]'>
										+ Create a new asset
									</button>
								</div>
							)}
						</TabsContent>
					))}
				</Tabs>
			</div>
		</div>
	);
}
