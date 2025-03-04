'use client';


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


const dummyData = [];

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
								<div className='p-64 w-5/6 mx-auto flex flex-col space-y-2 items-center'>
									<p className='text-lg font-semibold mb-2 text-[#0F172A]'>
										You have not registered any{' '}
										{tab.label === 'All' ? '' : tab.label} assets
									</p>
									<button className='border-2 rounded-md border-[#e2e8f0] py-2 px-4 text-sm font-medium text-[#334155] flex items-center gap-2 justify-center'>
										<span>
											<PlusIcon />{' '}
										</span>
										<span>Create a new asset</span>
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
