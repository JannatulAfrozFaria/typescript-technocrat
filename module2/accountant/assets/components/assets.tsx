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
import PlusIcon from '@/components/icon-components/plus-icon';

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
	{
		id: '2',
		name: 'Macbook For Office',
		category: 'Demo Category',
		date: new Date('2025-01-11'),
		price: 1800,
		sellingPrice: 2000,
		productLife: '6 Months',
		status: 'Sold',
		profitOrLoss: 'Theft',
		reasonForLoss: 'Damaged',
		sellingDate: new Date('2025-01-25'),
	},
	{
		id: '3',
		name: 'New Laptop',
		category: 'Demo Category',
		date: new Date('2025-01-08'),
		price: 1200,
		sellingPrice: 1400,
		productLife: '2 Years',
		status: 'Active',
		profitOrLoss: 'None',
		reasonForLoss: 'Other',
		sellingDate: new Date('2025-01-20'),
	},
	{
		id: '4',
		name: 'Office Chair',
		category: 'Demo Category',
		date: new Date('2025-01-04'),
		price: 1500,
		sellingPrice: 2000,
		productLife: '8 Years',
		status: 'Lost',
		profitOrLoss: 'Damaged',
		reasonForLoss: 'Damaged',
		sellingDate: new Date('2025-01-10'),
	},
	{
		id: '5',
		name: 'Conference Table',
		category: 'Demo Category',
		date: new Date('2025-01-21'),
		price: 8000,
		sellingPrice: 900,
		productLife: '10 Years',
		status: 'Active',
		profitOrLoss: 'None',
		reasonForLoss: 'Other',
		sellingDate: new Date('2025-02-01'),
	},
	{
		id: '6',
		name: 'Desktop Computer',
		category: 'Demo Category',
		date: new Date('2025-01-20'),
		price: 1000,
		sellingPrice: 1100,
		productLife: '5 Years',
		status: 'Sold',
		profitOrLoss: 'Fire',
		reasonForLoss: 'Fire',
		sellingDate: new Date('2025-02-05'),
	},
	{
		id: '7',
		name: 'Printer',
		category: 'Demo Category',
		date: new Date('2025-01-16'),
		price: 3000,
		sellingPrice: 3500,
		productLife: '4 Years',
		status: 'Lost',
		profitOrLoss: 'None',
		reasonForLoss: 'Expired',
		sellingDate: new Date('2025-01-30'),
	},
	{
		id: '8',
		name: 'New Tablet',
		category: 'Demo Category',
		date: new Date('2025-06-09'),
		price: 6000,
		sellingPrice: 6500,
		productLife: '3 Years',
		status: 'Lost',
		profitOrLoss: 'Theft',
		reasonForLoss: 'Other',
		sellingDate: new Date('2025-06-20'),
	},
	{
		id: '9',
		name: 'Smartphone',
		category: 'Demo Category',
		date: new Date('2025-01-04'),
		price: 7000,
		sellingPrice: 7500,
		productLife: '2 Years',
		status: 'Lost',
		profitOrLoss: 'None',
		reasonForLoss: 'Other',
		sellingDate: new Date('2025-01-15'),
	},
	{
		id: '10',
		name: 'Wireless Headphones',
		category: 'Demo Category',
		date: new Date('2025-06-09'),
		price: 2000,
		sellingPrice: 2200,
		productLife: '1 Year',
		status: 'Sold',
		profitOrLoss: 'Expired',
		reasonForLoss: 'Expired',
		sellingDate: new Date('2025-06-20'),
	},
	{
		id: '11',
		name: 'Gaming Console',
		category: 'Demo Category',
		date: new Date('2025-01-11'),
		price: 4000,
		sellingPrice: 4500,
		productLife: '3 Years',
		status: 'Lost',
		profitOrLoss: 'None',
		reasonForLoss: 'Other',
		sellingDate: new Date('2025-01-25'),
	},
	{
		id: '12',
		name: 'Smartwatch',
		category: 'Demo Category',
		date: new Date('2025-06-09'),
		price: 2500,
		sellingPrice: 3000,
		productLife: '2 Years',
		status: 'Lost',
		profitOrLoss: 'Damaged',
		reasonForLoss: 'Damaged',
		sellingDate: new Date('2025-06-20'),
	},
	// Additional 20 items:
	{
		id: '13',
		name: 'Office Printer',
		category: 'Demo Category',
		date: new Date('2025-02-10'),
		price: 3500,
		sellingPrice: 4000,
		productLife: '5 Years',
		status: 'Active',
		profitOrLoss: 'None',
		reasonForLoss: 'Other',
		sellingDate: new Date('2025-02-20'),
	},
	{
		id: '14',
		name: 'Laser Printer',
		category: 'Demo Category',
		date: new Date('2025-03-05'),
		price: 4500,
		sellingPrice: 5000,
		productLife: '6 Years',
		status: 'Active',
		profitOrLoss: 'None',
		reasonForLoss: 'Other',
		sellingDate: new Date('2025-03-15'),
	},
	{
		id: '15',
		name: 'Workstation PC',
		category: 'Demo Category',
		date: new Date('2025-04-01'),
		price: 2200,
		sellingPrice: 2500,
		productLife: '4 Years',
		status: 'Sold',
		profitOrLoss: 'None',
		reasonForLoss: 'Other',
		sellingDate: new Date('2025-04-10'),
	},
	{
		id: '16',
		name: 'Ergonomic Keyboard',
		category: 'Demo Category',
		date: new Date('2025-02-18'),
		price: 1200,
		sellingPrice: 1400,
		productLife: '3 Years',
		status: 'Active',
		profitOrLoss: 'None',
		reasonForLoss: 'Other',
		sellingDate: new Date('2025-02-25'),
	},
	{
		id: '17',
		name: 'Wireless Mouse',
		category: 'Demo Category',
		date: new Date('2025-03-12'),
		price: 8000,
		sellingPrice: 9500,
		productLife: '2 Years',
		status: 'Sold',
		profitOrLoss: 'None',
		reasonForLoss: 'Other',
		sellingDate: new Date('2025-03-20'),
	},
	{
		id: '18',
		name: 'HD Monitor',
		category: 'Demo Category',
		date: new Date('2025-03-22'),
		price: 3000,
		sellingPrice: 3200,
		productLife: '5 Years',
		status: 'Lost',
		profitOrLoss: 'None',
		reasonForLoss: 'Other',
		sellingDate: new Date('2025-03-30'),
	},
	{
		id: '19',
		name: 'Graphic Tablet',
		category: 'Demo Category',
		date: new Date('2025-04-05'),
		price: 5000,
		sellingPrice: 5500,
		productLife: '3 Years',
		status: 'Sold',
		profitOrLoss: 'None',
		reasonForLoss: 'Other',
		sellingDate: new Date('2025-04-15'),
	},
	{
		id: '20',
		name: 'External Hard Drive',
		category: 'Demo Category',
		date: new Date('2025-04-12'),
		price: 1500,
		sellingPrice: 1700,
		productLife: '2 Years',
		status: 'Active',
		profitOrLoss: 'None',
		reasonForLoss: 'Other',
		sellingDate: new Date('2025-04-20'),
	},
	{
		id: '21',
		name: 'USB Flash Drive',
		category: 'Demo Category',
		date: new Date('2025-04-18'),
		price: 2000,
		sellingPrice: 2500,
		productLife: '1 Year',
		status: 'Active',
		profitOrLoss: 'None',
		reasonForLoss: 'Other',
		sellingDate: new Date('2025-04-25'),
	},
	{
		id: '22',
		name: 'Network Router',
		category: 'Demo Category',
		date: new Date('2025-05-01'),
		price: 2500,
		sellingPrice: 3000,
		productLife: '4 Years',
		status: 'Sold',
		profitOrLoss: 'None',
		reasonForLoss: 'Other',
		sellingDate: new Date('2025-05-10'),
	},
	{
		id: '23',
		name: 'Switch Hub',
		category: 'Demo Category',
		date: new Date('2025-05-05'),
		price: 1800,
		sellingPrice: 2100,
		productLife: '3 Years',
		status: 'Active',
		profitOrLoss: 'None',
		reasonForLoss: 'Other',
		sellingDate: new Date('2025-05-12'),
	},
	{
		id: '24',
		name: 'Projector',
		category: 'Demo Category',
		date: new Date('2025-05-10'),
		price: 2000,
		sellingPrice: 2500,
		productLife: '7 Years',
		status: 'Active',
		profitOrLoss: 'None',
		reasonForLoss: 'Other',
		sellingDate: new Date('2025-05-20'),
	},
	{
		id: '25',
		name: 'Digital Camera',
		category: 'Demo Category',
		date: new Date('2025-05-15'),
		price: 6000,
		sellingPrice: 6500,
		productLife: '3 Years',
		status: 'Sold',
		profitOrLoss: 'None',
		reasonForLoss: 'Other',
		sellingDate: new Date('2025-05-25'),
	},
	{
		id: '26',
		name: 'Scanner',
		category: 'Demo Category',
		date: new Date('2025-05-20'),
		price: 4000,
		sellingPrice: 4500,
		productLife: '5 Years',
		status: 'Active',
		profitOrLoss: 'None',
		reasonForLoss: 'Other',
		sellingDate: new Date('2025-05-30'),
	},
	{
		id: '27',
		name: 'All-in-One Printer',
		category: 'Demo Category',
		date: new Date('2025-05-25'),
		price: 5500,
		sellingPrice: 6000,
		productLife: '4 Years',
		status: 'Active',
		profitOrLoss: 'None',
		reasonForLoss: 'Other',
		sellingDate: new Date('2025-06-05'),
	},
	{
		id: '28',
		name: 'Wireless Router',
		category: 'Demo Category',
		date: new Date('2025-06-01'),
		price: 2800,
		sellingPrice: 3200,
		productLife: '4 Years',
		status: 'Sold',
		profitOrLoss: 'None',
		reasonForLoss: 'Other',
		sellingDate: new Date('2025-06-10'),
	},
	{
		id: '29',
		name: 'Smart LED TV',
		category: 'Demo Category',
		date: new Date('2025-06-05'),
		price: 1200,
		sellingPrice: 1300,
		productLife: '6 Years',
		status: 'Active',
		profitOrLoss: 'None',
		reasonForLoss: 'Other',
		sellingDate: new Date('2025-06-15'),
	},
	{
		id: '30',
		name: 'Soundbar',
		category: 'Demo Category',
		date: new Date('2025-06-08'),
		price: 3000,
		sellingPrice: 3300,
		productLife: '3 Years',
		status: 'Active',
		profitOrLoss: 'None',
		reasonForLoss: 'Other',
		sellingDate: new Date('2025-06-18'),
	},
	{
		id: '31',
		name: 'Bluetooth Speaker',
		category: 'Demo Category',
		date: new Date('2025-06-10'),
		price: 1500,
		sellingPrice: 1700,
		productLife: '2 Years',
		status: 'Sold',
		profitOrLoss: 'None',
		reasonForLoss: 'Other',
		sellingDate: new Date('2025-06-20'),
	},
	{
		id: '32',
		name: 'VR Headset',
		category: 'Demo Category',
		date: new Date('2025-06-12'),
		price: 8000,
		sellingPrice: 8500,
		productLife: '3 Years',
		status: 'Active',
		profitOrLoss: 'None',
		reasonForLoss: 'Other',
		sellingDate: new Date('2025-06-22'),
	},
	{
		id: '33',
		name: 'Smart LED TV',
		category: 'Demo Category',
		date: new Date('2025-06-05'),
		price: 1200,
		sellingPrice: 1300,
		productLife: '6 Years',
		status: 'Lost',
		profitOrLoss: 'None',
		reasonForLoss: 'Other',
		sellingDate: new Date('2025-06-15'),
	},
	{
		id: '34',
		name: 'Soundbar',
		category: 'Demo Category',
		date: new Date('2025-06-08'),
		price: 3000,
		sellingPrice: 3300,
		productLife: '3 Years',
		status: 'Lost',
		profitOrLoss: 'None',
		reasonForLoss: 'Other',
		sellingDate: new Date('2025-06-18'),
	},
	{
		id: '35',
		name: 'Bluetooth Speaker',
		category: 'Demo Category',
		date: new Date('2025-06-10'),
		price: 1500,
		sellingPrice: 1700,
		productLife: '2 Years',
		status: 'Lost',
		profitOrLoss: 'None',
		reasonForLoss: 'Other',
		sellingDate: new Date('2025-06-20'),
	},
	{
		id: '36',
		name: 'VR Headset',
		category: 'Demo Category',
		date: new Date('2025-06-12'),
		price: 8000,
		sellingPrice: 8500,
		productLife: '3 Years',
		status: 'Lost',
		profitOrLoss: 'None',
		reasonForLoss: 'Other',
		sellingDate: new Date('2025-06-22'),
	},
];

// const dummyData = [];

const dataByTab: Record<TabKey, Asset[]> = {
	active: dummyData.filter((item) => item.status === 'Active'),
	lost: dummyData.filter((item) => item.status === 'Lost'),
	sold: dummyData.filter((item) => item.status === 'Sold'),
	all: dummyData,
};
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
	const activeColumns = tableColumns[activeTab]();
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
	const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
	const [showAssetDeleteConfirmDialog, setShowAssetDeleteConfirmDialog] =
		useState(false);
	const [openDeleteDialogId, setOpenDeleteDialogId] = useState<string | null>(
		null
	);

	const handleSelectContact = (assetId: String) => {
		// user will either select a filtered contact or paginated contact
		const foundAsset = paginatedData?.find(({ id }) => id === assetId);

		if (foundAsset) setSelectedAsset(foundAsset);
		return foundAsset;
	};
	const handleAssetActions = (
		actionType: 'edit' | 'delete',
		assetId: String
	) => {
		handleSelectContact(assetId);
		switch (actionType) {
			case 'edit':
				// setShowContactFormModal(true);
				alert('Edit modal UI should be created');
				break;
			case 'delete':
				setShowAssetDeleteConfirmDialog(true);
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
			{paginatedData.length > 0 ? (
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
							{paginatedData.length > 0 && (
								<AssetsTopBar
									activeTab={activeTab}
									searchTerms={searchTerms}
									handleSearchChange={handleSearchChange}
								/>
							)}
						</div>
						{tabConfig.map((tab) => (
							<TabsContent key={tab.key} value={tab.key} className='w-full'>
								<div>
									<ActiveTable
										handleAssetActions={handleAssetActions}
										columns={activeColumns}
										data={paginatedData}
									/>
									{/* delete--- */}
									<ConfirmDeleteModal
										isOpen={showAssetDeleteConfirmDialog}
										onOpenChange={setShowAssetDeleteConfirmDialog}
										handleDelete={handleConfirmDelete}
										title='Delete Asset'
										description='Are you sure you want to delete this Asset? This action cannot be undone.'
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
							</TabsContent>
						))}
					</Tabs>
				</div>
			) : (
				<div className=' rounded-3xl border-2 border-[#e2e8f0]  bg-white my-6  py-72 flex flex-col space-y-2 items-center'>
					<p className='text-lg font-semibold mb-2 text-[#0F172A]'>
						You have not registered any {activeTab === 'all' ? '' : activeTab}{' '}
						assets
					</p>
					<button className='border-2 rounded-md border-[#e2e8f0] py-2 px-4 text-sm font-medium text-[#334155] flex items-center gap-2 justify-center'>
						<span>
							<PlusIcon />
						</span>
						<span>Create a new asset</span>
					</button>
				</div>
			)}
		</div>
	);
}
