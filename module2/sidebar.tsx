'use client';
import { ChevronDown, ChevronRightIcon } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useWindowWidth } from '@react-hook/window-size';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import DashboardIcon from '@/components/icon-components/dashboard-icon';
import ContactsIcon from '@/components/icon-components/contacts-icon';
import SalesIcon from '@/components/icon-components/sales-icon';
import PurchasesIcon from '@/components/icon-components/purchases-icon';
import BankingIcon from '@/components/icon-components/banking-icon';
import EmployeesIcon from '@/components/icon-components/employees-icon';
import AccountantIcon from '@/components/icon-components/accountant-icon';
import HelpIcon from '@/components/icon-components/help-icon';
// this might be needed in future
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';
import LogOutIcon1 from '@/components/icon-components/log-out-icon';
import UsersIcon from '@/components/icon-components/users-icon';
import SubscriptionIcon from '@/components/icon-components/subscription-icon';
import SwitchAccountIcon from '@/components/icon-components/switch-account-icon';
import SettingsIcon from '@/components/icon-components/settings-icon';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import CallUsIcon from '@/components/icon-components/call-us-icon';
import WhatsAppIcon from '@/components/icon-components/whatsapp-icon';
import Support from '@/components/icon-components/support';
import MyProfileIcon from '@/components/icon-components/my-profile-icon';
import OpnIcon from '@/components/icon-components/opn-icon';
import AddIcon from '@/components/icon-components/add-icon';
import { useClerk } from '@clerk/nextjs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { extractInitials } from '@/lib/utils';
import InboxIcon from './icon-components/inbox-icon';
import ProductsIcon from '@/components/icon-components/products-icon';

function Sidebar() {
	const { signOut, user } = useClerk();
	const [isCollapsed, setIsCollapsed] = useState(false);
	const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
	const onlyWidth = useWindowWidth();
	const mobileWidth = onlyWidth < 768;

	const pathname = usePathname();

	useEffect(() => {
		setIsCollapsed(mobileWidth);
	}, [mobileWidth]);

	// Expand parent menu if sub-route is active
	useEffect(() => {
		const activeParent = menuItems.find((item) =>
			item.subLinks?.some((sub) => sub.href === pathname)
		);
		if (activeParent) {
			setExpandedMenu(activeParent.title);
		}
	}, [pathname]);

	// TODO: come back to this after finalizing routes
	const menuItems = [
		{
			title: 'Dashboard',
			href: '/en/dashboard',
			icon: DashboardIcon,
		},
		{
			title: 'Contacts',
			href: '/en/contacts',
			icon: ContactsIcon,
		},
		{
			title: 'Sales',
			icon: SalesIcon,
			subLinks: [
				{ title: 'Sales overview', href: '/en/sales/sales-overview' },
				{ title: 'New invoice', href: '/en/sales/new-invoice' },
				{
					title: 'New recurring Invoice',
					href: '/en/sales/new-recurring-invoice',
				},
				{ title: 'New receipt', href: '/en/sales/new-receipt' },
				{ title: 'New offer', href: '/en/sales/new-offer' },
				{ title: 'New credit note', href: '/en/sales/new-creditnote' },
				{ title: 'New sale', href: '/en/sales/new-sale' },
			],
		},
		{
			title: 'Expenses',
			icon: PurchasesIcon,
			subLinks: [
				{ title: 'Expense overview', href: '/en/expenses/expense-overview' },
				{ title: 'New expense', href: '/en/expenses/new-expense' },
			],
		},
		{
			title: 'Inbox',
			icon: InboxIcon,
			href: '/en/inbox/inbox-list',
		},
		{
			title: 'Banking',
			href: '/en/banking',
			icon: BankingIcon,
			subLinks: [
				{
					title: 'Bank Reconciliation',
					href: '/banking/reconciliation',
					subLinks: [
						{ title: 'Manual', href: '/banking/reconciliation/manual' },
						{
							title: 'Cash Credit',
							href: '/banking/reconciliation/cashCredit',
						},
					],
				},
				{ title: 'Bank Dashboard', href: '/banking/dashboard' },
			],
		},
		{
			title: 'Products',
			href: '/en/products',
			icon: ProductsIcon,
		},
		{
			title: 'Employees',
			href: '/en/employees',
			icon: EmployeesIcon,
		},
		{
			title: 'Accountant',
			// href: '/en/chartOfAccounts',
			icon: AccountantIcon,
			subLinks: [
				{
					title: 'Charts of accounts',
					href: '/en/accountant/chart-of-accounts',
				},
				{ title: 'Journal Entries', href: '/en/accountant/journal-entries' },
				{ title: 'General Ledger', href: '/en/accountant/general-ledger' },
				{ title: 'Trial Balance', href: '/en/accountant/trial-balance' },
				{ title: 'Balance Sheet', href: '/en/accountant/balance-sheet' },
				{ title: 'Profit & Loss', href: '/en/accountant/profit-and-loss' },
				{ title: 'Assets', href: '/en/accountant/assets' },
			],
		},
		{
			title: 'PoCs',
			icon: AccountantIcon,
			subLinks: [
				{ title: 'mailgun', href: '/en/poc/mail-gun' },
				{ title: 'cloud-upload', href: '/en/poc/cloud-upload' },
				{ title: 'inbox', href: '/en/poc/inbox' },
			],
		},
	];

	// To handle the active state for menu items
	const isActive = (item: any) => {
		// Check if the current path matches the item's href or its sub-links
		return (
			pathname === item.href ||
			// @ts-ignore
			(item.subLinks && item.subLinks.some((sub) => pathname === sub.href))
		);
	};

	const handleMenuItemClick = (item: any) => {
		if (item.subLinks) {
			// Prevent default behavior if the item has sublinks
			setExpandedMenu((prev) => (prev === item.title ? null : item.title));
		} else {
			// Redirect to the item's href if it doesn't have sublinks
			window.location.href = item.href;
		}
	};

	const handleToggleCollapse = () => {
		setIsCollapsed(!isCollapsed);
	};
	if (!user) return null;
	return (
		<TooltipProvider>
			<div
				className={`bg-white flex flex-col justify-between relative p-5 h-screen overflow-auto scrollbar-track-gray-300 scrollbar-thin transition-all duration-300 border-r-4 border-[#eaecf0] ${
					isCollapsed
						? 'min-w-[80px] max-w-[80px]'
						: 'min-w-[240px] max-w-[240px]'
				}`}
			>
				{/*TOP-----SECTION---- */}
				<div>
					{/* Logo Section */}
					<div className='flex gap-3 justify-start my-6'>
						<Image
							onClick={handleToggleCollapse}
							width={24}
							height={24}
							src={'/img/logo.svg'}
							alt='web-icon'
						/>
					</div>
					<hr className='border-[#cbd5e1] border-1' />

					{/* COMPANY---DETAILS--- */}
					<div>
						<div className='flex justify-between cursor-pointer  items-center'>
							<div className='flex gap-4 items-center'>
								<div className='min-w-[180px]'>
									<Accordion type='single' collapsible className='w-full'>
										<AccordionItem value='item-1' className='border-none'>
											<AccordionTrigger>
												<div className='flex gap-4 items-center'>
													<Image
														width={24}
														height={24}
														src={'/img/logo.svg'}
														alt='web-icon'
													/>
													{!isCollapsed && (
														<span className=' font-bold text-xl text-[#2354e6]'>
															Vatiero
														</span>
													)}
												</div>
											</AccordionTrigger>

											<AccordionContent className='flex flex-col !border-none'>
												<Link
													href=''
													className='mt-2 text-gray flex gap-2 items-center'
												>
													<SettingsIcon />
													<span>Settings</span>
												</Link>
												<Link
													href=''
													className='mt-2 text-gray flex gap-2 items-center'
												>
													<UsersIcon />
													<span>Users</span>
												</Link>
												<Link
													href=''
													className='mt-2 text-gray flex gap-2 items-center'
												>
													<SubscriptionIcon />
													<span>Subscription</span>
												</Link>
												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<div className='mt-2 text-gray flex gap-2 items-center cursor-pointer'>
															<SwitchAccountIcon />
															<span>Switch account</span>
															<ChevronRightIcon className='ml-auto' />
														</div>
													</DropdownMenuTrigger>
													<DropdownMenuContent
														className='ml-7'
														side='right'
														align='start'
														sideOffset={8}
													>
														{/* TODO: This part is hard coded and needs to be made dynamic */}
														<DropdownMenuItem className='flex items-center gap-1'>
															{' '}
															<OpnIcon /> <span></span> Opndoo
														</DropdownMenuItem>
														<DropdownMenuItem className='flex items-center gap-1'>
															{' '}
															<AddIcon /> <span></span> Add Account
														</DropdownMenuItem>
													</DropdownMenuContent>
												</DropdownMenu>
											</AccordionContent>
										</AccordionItem>
									</Accordion>
								</div>
							</div>
						</div>
					</div>

					{/* Navigation Section */}
					<div className='flex flex-col'>
						{menuItems.map((item) => (
							<div key={item.title}>
								{/* Parent Menu Item */}
								<div
									onClick={() => handleMenuItemClick(item)}
									className={`flex items-center gap-3 p-2 rounded-md  cursor-pointer transition-all ${
										isActive(item) || expandedMenu === item.title
											? 'bg-[#e8edfc]' // Active background for exact match or expanded menu
											: 'hover:bg-[#e8edfc]' // Hover effect for non-active items
									}`}
								>
									{/* @ts-ignore */}
									<item.icon className='w-6' />
									{!isCollapsed && (
										<>
											<span className='font-medium'>{item.title}</span>
											{/* Conditional Arrow */}
											{item.subLinks && (
												<span
													className={`ml-auto transform transition-transform duration-200 ${
														expandedMenu === item.title
															? 'rotate-180'
															: 'rotate-0'
													}`}
												>
													{/* Arrow Icon */}
													<ChevronDown className='w-6 ' />
												</span>
											)}
										</>
									)}
								</div>

								{/* Sub-Nav Below the Parent Item */}
								{item.subLinks && (
									<div
										className={`ml-8  flex flex-col gap-2 overflow-hidden transition-all duration-300 ease-in-out ${
											expandedMenu === item.title ? 'max-h-screen' : 'max-h-0'
										}`}
									>
										{item.subLinks.map((sub) => (
											<Link
												key={sub.title}
												href={sub.href}
												className={`text-gray-700 text-sm ${
													pathname === sub.href
														? 'font-semibold text-[#4880FF]'
														: 'hover:text-[#4880FF]'
												}`}
											>
												{sub.title}
											</Link>
										))}
									</div>
								)}
							</div>
						))}
					</div>
				</div>

				{/* BOTTOM----SECTION---- */}
				<div>
					{/* CARD---OF DISCOUNT---- */}
					{/* <div className='bg-[#2354e6] p-4 text-white rounded-xl my-6 text-sm'>
					<p className='font-semibold'>Special 50% discount for you</p>
					<p className=''>Discover our plans with our welcome offer.</p>
					<div className='mt-2 flex gap-4 font-semibold'>
						<button>Dismiss</button>
						<button className='text-[#fdac17]'>Upgrade plan</button>
					</div>
					</div> */}
					<div className='px-2'>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<div className=' text-gray flex gap-2 items-center cursor-pointer'>
									<HelpIcon />
									<span className='text-sm '>Help and Support</span>
									<ChevronRightIcon className='ml-auto' />
								</div>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								className='ml-5'
								side='right'
								align='end'
								sideOffset={8}
							>
								<DropdownMenuItem className='flex gap-2'>
									{' '}
									<CallUsIcon width={16} /> <span>Call us</span>
								</DropdownMenuItem>
								<DropdownMenuItem className='flex gap-2'>
									<WhatsAppIcon /> <span>Whatsapp</span>{' '}
								</DropdownMenuItem>
								<DropdownMenuItem className='flex gap-2'>
									<Support /> <span>Support</span>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
					<hr className='border-[#e2e8f0] my-4' />
					{/* USER----DETAILS--- */}
					<div className='px-2'>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<div className='mt-2 text-gray flex gap-2 items-center cursor-pointer'>
									<Avatar>
										<AvatarImage src={user?.imageUrl} width={32} />
										<AvatarFallback>
											{extractInitials(user?.fullName as string)}
										</AvatarFallback>
									</Avatar>

									<div className='text-sm'>{user?.fullName}</div>
									<ChevronRightIcon className='ml-auto' />
								</div>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								className='ml-5'
								side='right'
								align='center'
								sideOffset={8}
							>
								<DropdownMenuItem className='flex gap-2'>
									{' '}
									<MyProfileIcon /> <span>My profile</span>
								</DropdownMenuItem>
								<DropdownMenuItem
									className='flex gap-2'
									onClick={() => signOut()}
								>
									<LogOutIcon1 /> <span>Logout</span>{' '}
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>
			</div>
		</TooltipProvider>
	);
}

export default Sidebar;
