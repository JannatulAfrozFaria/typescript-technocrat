'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import SearchIcon from '../../../../components/icon-components/SearchIcon';
import React, { useState } from 'react';
import ThreeDotIcon from '@/components/icon-components/ThreeDotIcon';
import SalesDataTable from './sales-data-table';
import { salesTablecolumns } from './sales-table-columns';
import OfferDataTable from './offer-data-table';
import HeaderWithDropDown from '@/components/header-with-dropdown';
import DownArrowIcon from '@/components/icon-components/DownArrowIcon';
import RecurringDataTable from './recurring-data-table';
import CreditDataTable from './credit-data-table';
import { offerTableColumns } from './offer-table-columns';
import { recurringTableColumns } from './recurring-table-columns';
import { creditTableColumns } from './credit-table-columns';
import type { Invoice } from '@/types/types';
import SelectTime from '../../../../components/select-time';
import { useDebounce } from 'use-debounce';
import DeleteDialog from '../../purchases/components/delete-dialog';
import RegisterPaymentModal from '../../../../components/sales-and-purchases/register-payment-modal';
import SummaryChart, {
	type ChartData,
} from '@/components/sales-and-purchases/summary-chart';

type TabKey = 'invoices' | 'offers' | 'recurring' | 'credit';

const tabConfig = [
	{
		key: 'invoices',
		label: 'Invoices and sales',
		buttonText: '+ New Invoice',
		buttonLink: '/en/sales/new-invoice',
	},
	{
		key: 'offers',
		label: 'Offers',
		buttonText: '+ New Offer',
		buttonLink: '/en/sales/new-offer',
	},
];

const tableComponents = {
	invoices: SalesDataTable,
	offers: OfferDataTable,
	recurring: RecurringDataTable,
	credit: CreditDataTable,
};

const tableColumns = {
	invoices: salesTablecolumns,
	offers: offerTableColumns,
	recurring: recurringTableColumns,
	credit: creditTableColumns,
};

//TODO: remove dummy data and fetch dynamic data
const dummyData: Invoice[] = [
	{
		id: '1',
		customer: 'Acme ITD.',
		invoiceNumber: 'INV-001',
		date: new Date('2025-06-01'),
		status: 'Paid',
		totalAmount: 249,
		icon: <ThreeDotIcon />,
		grandTotal: 1200,
		recurringInvoiceRun: 'INV-001',
		frequency: 'Monthly',
	},
	{
		id: '2',
		customer: 'Gadgets 360',
		invoiceNumber: 'INV-002',
		date: new Date('2025-01-11'),
		status: 'Outstanding',
		totalAmount: 109,
		icon: <ThreeDotIcon />,
		grandTotal: 4000,
		recurringInvoiceRun: 'INV-002',
		frequency: 'Weekly',
	},
];

const dataByTab: Record<TabKey, Invoice[]> = {
	invoices: dummyData,
	offers: dummyData,
	recurring: dummyData,
	credit: dummyData,
};

const itemsPerPage = 5;
const menuItems = [
	{
		id: '1',
		submenuText: 'New invoice',
		submenuRoute: '/en/sales/new-invoice',
	},
	{
		id: '2',
		submenuText: 'New Recurring invoice',
		submenuRoute: '/en/sales/recurring-invoice',
	},
];

const salesGraphData: ChartData[] = [
	{
		id: 1,
		type: 'total',
		title: 'Total Sales',
		amount: '5000.00',
		subtitle: 25,
		subTitleText: 'Invoices',
	},
];

export default function SalesOverviewData() {
	const [activeTab, setActiveTab] = useState<TabKey>('invoices');
	const { buttonText, buttonLink } = tabConfig.find(
		(tab) => tab.key === activeTab
	)!;
	const ActiveTable = tableComponents[activeTab];
	const activeColumns = tableColumns[activeTab];

	//dynamic items per page
	const itemsPerPage = activeTab === 'invoices' ? 5 : 10;

	// Dynamic state for each tab
	const [searchTerms, setSearchTerms] = useState<Record<TabKey, string>>({
		invoices: '',
		offers: '',
		recurring: '',
		credit: '',
	});
	const [debouncedSearch] = useDebounce(searchTerms[activeTab], 300);

	const [currentPageNumbers, setCurrentPageNumbers] = useState<
		Record<TabKey, number>
	>({
		invoices: 1,
		offers: 1,
		recurring: 1,
		credit: 1,
	});

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerms({ ...searchTerms, [activeTab]: e.target.value });
		setCurrentPageNumbers({ ...currentPageNumbers, [activeTab]: 1 });
	};

	// Filtered data for the active tab
	const filteredData = dataByTab[activeTab].filter((item) => {
		const search = debouncedSearch.toLowerCase();
		return (
			item.customer?.toLowerCase().includes(search) ||
			item.status?.toLowerCase().includes(search)
		);
	});

	// const totalPages = Math.ceil(filteredData.length / itemsPerPage);
	const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));
	const paginatedData = filteredData.slice(
		(currentPageNumbers[activeTab] - 1) * itemsPerPage,
		currentPageNumbers[activeTab] * itemsPerPage
	);
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
	const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
	const [openDeleteDialogId, setOpenDeleteDialogId] = useState<string | null>(
		null
	);
	const handleDropdownToggle = (invoiceId: string) => {
		setOpenDropdownId((prev) => (prev === invoiceId ? null : invoiceId));
	};
	const handleDeleteDialogToggle = (invoiceId: string | null) => {
		setOpenDeleteDialogId(invoiceId);
	};
	const handleConfirmDelete = () => {
		alert(`Deleting invoice ID: ${openDeleteDialogId}`);
		setOpenDeleteDialogId(null);
	};
	return (
		<div className=''>
			<HeaderWithDropDown
				title='Sales Overview'
				buttonText={buttonText}
				buttonLink={buttonLink}
				icon={<DownArrowIcon color='#f8fafc' />}
				menuItems={menuItems}
			/>
			<div className=' rounded-3xl border-2 border-[#e2e8f0]  bg-white my-6'>
				<div className='relative'>
					{/* SEARCH-----SELECT */}
					<div
						className={`grid gap-4 items-center xl:hidden p-4 
              			${activeTab === 'invoices' ? 'grid-cols-2' : 'grid-cols-1'} 
            			`}
					>
						<div className='relative'>
							<span className='absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400'>
								<SearchIcon />
							</span>
							<Input
								className='pl-10 h-[40px] bg-white text-[#64748b] w-[320px] xl:w-full rounded-md border border-gray-300 focus:border-[#4880FF] focus:outline-none text-base'
								placeholder='Search'
								value={searchTerms[activeTab]}
								onChange={handleSearchChange}
							/>
						</div>
						{/* Conditionally Render Select */}
						<SelectTime activeTab={activeTab} />
					</div>
					{/* TABS----- */}
					<div className=''>
						<Tabs
							defaultValue='invoices'
							onValueChange={(value) => setActiveTab(value as TabKey)}
						>
							<TabsList customPadding='px-4 py-0 xl:px-4 xl:pt-4'>
								{tabConfig.map((tab) => (
									<TabsTrigger key={tab.key} value={tab.key}>
										{tab.label}
									</TabsTrigger>
								))}
							</TabsList>
							{tabConfig.map((tab) => (
								<TabsContent key={tab.key} value={tab.key} className='w-full'>
									{tab.key === 'invoices' && (
										<SummaryChart data={salesGraphData} />
									)}
									{paginatedData.length > 0 ? (
										<div>
											<ActiveTable
												columns={activeColumns(
													handleRegisterPayment,
													handleDropdownToggle,
													handleDeleteDialogToggle,
													openDropdownId
												)}
												data={paginatedData}
												totalPages={totalPages}
												currentPageNumber={currentPageNumbers[activeTab]}
												setCurrentPageNumber={(page) =>
													setCurrentPageNumbers((prev) => ({
														...prev,
														[activeTab]: page,
													}))
												}
											/>
											{/* modal */}
											{selectedInvoice && (
												<RegisterPaymentModal
													isOpen={isRegisterPaymentModalOpen}
													onClose={closeRegisterPaymentModal}
													invoice={selectedInvoice}
												/>
											)}
											{/* delete--- */}
											<DeleteDialog
												isOpen={!!openDeleteDialogId}
												onClose={() => setOpenDeleteDialogId(null)}
												onConfirmDelete={handleConfirmDelete}
											/>
											{/* PAGINATION---- */}
											<div className='flex items-center justify-between my-6 px-4'>
												<Button
													className='bg-white font-semibold border-2 p-2 text-sm'
													disabled={currentPageNumbers[activeTab] === 1}
													onClick={() =>
														setCurrentPageNumbers({
															...currentPageNumbers,
															[activeTab]: currentPageNumbers[activeTab] - 1,
														})
													}
												>
													Previous
												</Button>
												<span>
													Page {currentPageNumbers[activeTab]} of {totalPages}
												</span>
												<Button
													className='bg-white font-semibold border-2 p-2 text-sm'
													disabled={
														currentPageNumbers[activeTab] === totalPages
													}
													onClick={() => {
														if (currentPageNumbers[activeTab] < totalPages) {
															setCurrentPageNumbers({
																...currentPageNumbers,
																[activeTab]: currentPageNumbers[activeTab] + 1,
															});
														}
													}}
												>
													Next
												</Button>3
											</div>
										</div>
									) : (
										<p>No {tab.label} found.</p>
									)}
								</TabsContent>
							))}
						</Tabs>
					</div>
				</div>
			</div>
		</div>
	);
}

