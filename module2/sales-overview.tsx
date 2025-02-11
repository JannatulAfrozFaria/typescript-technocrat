'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import Pagination from '@/components/sales-and-purchases/pagination';
import BreadCrumbs from '@/components/bread-crumbs';

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
	{
		key: 'recurring',
		label: 'Recurring invoices',
		buttonText: '+ New Recurring Invoice',
		buttonLink: '/en/sales/recurring-invoice',
	},
	{
		key: 'credit',
		label: 'Credit notes',
		buttonText: '+ New Credit Note',
		buttonLink: '/en/sales/new-credit-note',
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
		grandTotal: 7000,
		frequency: 'Monthly',
	},
	{
		id: '2',
		customer: 'Gadgets 360',
		invoiceNumber: 'INV-002',
		date: new Date('2025-01-11'),
		status: 'Outstanding',
		totalAmount: 109,
		grandTotal: 4000,
		frequency: 'Weekly',
	},
	{
		id: '3',
		customer: 'Gloxy LTD',
		invoiceNumber: 'INV-003',
		date: new Date('2025-01-08'),
		status: 'Paid',
		totalAmount: 149,
		grandTotal: 900,
		frequency: 'Monthly',
	},
	{
		id: '4',
		customer: 'Aceme Crop.',
		invoiceNumber: 'INV-004',
		date: new Date('2025-01-04'),
		status: 'Overdue',
		totalAmount: 329,
		grandTotal: 600,
		frequency: 'Yearly',
	},
	{
		id: '5',
		customer: 'Gloxy LTD',
		invoiceNumber: 'INV-005',
		date: new Date('2025-01-21'),
		status: 'Paid',
		totalAmount: 149,
		grandTotal: 5200,
		frequency: 'Yearly',
	},
	{
		id: '6',
		customer: 'Aceme Crop.',
		invoiceNumber: 'INV-006',
		date: new Date('2025-01-20'),
		status: 'Overdue',
		totalAmount: 329,
		grandTotal: 4800,
		frequency: 'Weekly',
	},
	{
		id: '7',
		customer: 'Gadgets 360',
		invoiceNumber: 'INV-007',
		date: new Date('2025-01-16'),
		status: 'Outstanding',
		totalAmount: 189,
		grandTotal: 3800,
		frequency: 'Yearly',
	},
	{
		id: '8',
		customer: 'Acme ITD.',
		invoiceNumber: 'INV-001',
		date: new Date('2025-06-09'),
		status: 'Paid',
		totalAmount: 200,
		grandTotal: 1600,
		frequency: 'Weekly',
	},
	{
		id: '9',
		customer: 'Gloxy LTD',
		invoiceNumber: 'INV-010',
		date: new Date('2025-01-04'),
		status: 'Overdue',
		totalAmount: 329,
		grandTotal: 600,
		frequency: 'Yearly',
	},
	{
		id: '10',
		customer: 'Acme ITD.',
		invoiceNumber: 'INV-011',
		date: new Date('2025-06-09'),
		status: 'Paid',
		totalAmount: 200,
		grandTotal: 1600,
		frequency: 'Yearly',
	},
	{
		id: '11',
		customer: 'Gadgets 360',
		invoiceNumber: 'INV-012',
		date: new Date('2025-01-11'),
		status: 'Outstanding',
		totalAmount: 109,
		grandTotal: 4000,
		frequency: 'Weekly',
	},
	{
		id: '12',
		customer: 'Acme ITD.',
		invoiceNumber: 'INV-014',
		date: new Date('2025-06-09'),
		status: 'Paid',
		totalAmount: 200,
		grandTotal: 1600,
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
	{
		id: '3',
		submenuText: 'New receipt',
		submenuRoute: '/en/sales/new-receipt',
	},
	{ id: '4', submenuText: 'New offer', submenuRoute: '/en/sales/new-offer' },
	{
		id: '5',
		submenuText: 'New credit note',
		submenuRoute: '/en/sales/new-credit-note',
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
	{
		id: 2,
		type: 'overdue',
		title: 'Overdue Sales',
		amount: '1200.00',
		subtitle: 5,
		subTitleText: 'Overdue',
	},
	{
		id: 3,
		type: 'outstanding',
		title: 'Outstanding Sales',
		amount: '2000.00',
		subtitle: 10,
		subTitleText: 'Outstanding',
	},
];

export default function SalesOverview() {
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

	const [currentPageNumber, setCurrentPageNumber] = useState<
		Record<TabKey, number>
	>({
		invoices: 1,
		offers: 1,
		recurring: 1,
		credit: 1,
	});

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerms({ ...searchTerms, [activeTab]: e.target.value });
		setCurrentPageNumber({ ...currentPageNumber, [activeTab]: 1 });
	};

	// Filtered data for the active tab
	const filteredData = dataByTab[activeTab].filter((item) => {
		const search = debouncedSearch.toLowerCase();
		return (
			item.customer?.toLowerCase().includes(search) ||
			item.status?.toLowerCase().includes(search)
		);
	});
	const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));
	const paginatedData = filteredData.slice(
		(currentPageNumber[activeTab] - 1) * itemsPerPage,
		currentPageNumber[activeTab] * itemsPerPage
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
		<div className=' min-h-screen  bg-[#f8fafc] flex flex-col gap-4 w-full  mx-auto p-8'>
			<BreadCrumbs />
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
												currentPageNumber={currentPageNumber[activeTab]}
												setCurrentPageNumber={(page) =>
													setCurrentPageNumber((prev) => ({
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
											<Pagination
												currentPage={currentPageNumber[activeTab]}
												totalPages={totalPages}
												onPageChange={(newPage) =>
													setCurrentPageNumber((prev) => ({
														...prev,
														[activeTab]: newPage,
													}))
												}
											/>
										</div>
									) : (
										<p>No {tab.label} found.</p>
									)}
								</TabsContent>
							))}
						</Tabs>
					</div>
					{/* SEARCH---AND---SELECT */}
					<div
						className={`hidden xl:grid absolute top-0 right-0  gap-4 items-center pt-[16px] pr-[16px]
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
				</div>
			</div>
		</div>
	);
}
