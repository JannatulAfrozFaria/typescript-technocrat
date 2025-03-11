import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
} from '@/components/ui/sheet';
import type { Contact, ContactPerson } from '@/types/prisma-types';
import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import { twMerge } from 'tailwind-merge';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import ThreeDotIcon from '@/components/icon-components/three-dot-icon';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import EmailIcon from '@/components/icon-components/email-icon';
import PhoneIcon from '@/components/icon-components/phone-icon';
import WebIcon from '@/components/icon-components/web-icon';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import ContactDetails from './contact-details';
import ContactPersons from './contact-persons';

interface ContactDetailsSheetProps {
	isOpen: boolean;
	onOpenChange: Dispatch<SetStateAction<boolean>>;
	selectedContact?: Contact;
	handleContactActions: (
		actionType: 'view-details' | 'edit' | 'delete',
		contactId: string
	) => void;
	handleUpdateContactNote: (note: string, contactId: string) => Promise<void>;
	handleCreateContactPerson: (
		contactPersonBodyData: ContactPerson
	) => Promise<void>;
}

export default function ContactDetailsSheet({
	isOpen,
	onOpenChange,
	selectedContact,
	handleContactActions,
	handleUpdateContactNote,
	handleCreateContactPerson,
}: ContactDetailsSheetProps) {
	// have to maintain the state separately here, otherwise it disables the UI
	const [showDropDown, setShowDropdown] = useState(false);

	useEffect(() => {
		if (!isOpen) setShowDropdown(false);

		return () => {
			setShowDropdown(false);
		};
	}, [isOpen]);

	const contactTypeBGObj = {
		VENDOR: 'bg-[#7a5af8]',
		CUSTOMER: 'bg-[#2354e6]',
		CUSTOMER_AND_VENDOR: 'bg-[#16b364]',
	};

	const contactTypeLabels = {
		CUSTOMER: 'Customer',
		VENDOR: 'Vendor',
		CUSTOMER_AND_VENDOR: 'Customer / Vendor',
	};

	return (
		<Sheet open={isOpen} onOpenChange={onOpenChange}>
			{selectedContact && (
				<SheetContent
					className='overflow-auto scrollbar-none md:scrollbar-thin'
					aria-describedby={undefined}
				>
					<SheetHeader>
						<SheetTitle>
							<div className='flex justify-between items-center'>
								<div className='flex gap-4 items-center '>
									<h1 className='text-3xl text-left font-semibold '>
										{selectedContact.name}
									</h1>
									<span
										className={twMerge(
											'text-xs rounded-full border mr-4 border-[#E8EDFC] text-ellipsis pt-[6px] pb-1 pl-3 pr-3 text-white shrink-0 whitespace-nowrap text-center',
											contactTypeBGObj[selectedContact.type]
										)}
									>
										{contactTypeLabels[selectedContact.type] ||
											selectedContact.type}
									</span>
								</div>
								{/* Actions */}
								<DropdownMenu
									open={showDropDown}
									onOpenChange={setShowDropdown}
								>
									<DropdownMenuTrigger>
										<ThreeDotIcon />
									</DropdownMenuTrigger>
									<DropdownMenuContent className='px-4 mt-2 mr-2 py-2'>
										<DropdownMenuItem
											onClick={() => {
												setShowDropdown(false);
												handleContactActions('edit', selectedContact.id);
											}}
										>
											Edit
										</DropdownMenuItem>
										<DropdownMenuItem
											onClick={() => {
												setShowDropdown(false);
												handleContactActions('delete', selectedContact.id);
											}}
											className='text-red-500'
										>
											Delete
										</DropdownMenuItem>
										<DropdownMenuItem
											onClick={() => {
												setShowDropdown(false);
												onOpenChange(false);
											}}
										>
											Close
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</div>
							{selectedContact?.nif && (
								<p className='text-[#334155] text-left font-medium mt-2 mb-4'>
									NIF: {selectedContact.nif}
								</p>
							)}
						</SheetTitle>
						<div className='flex gap-6 items-center justify-start mb-4'>
							<TooltipProvider delayDuration={200}>
								<Tooltip>
									<TooltipTrigger asChild>
										<div className='shadow-[0_2px_0_rgba(35,84,230,0.08)] rounded-md w-[48px] p-2 pl-3 h-[48px]'>
											<Button
												variant={'ghost'}
												className=''
												onClick={() => {
													navigator.clipboard.writeText(
														selectedContact.email || ''
													);
													toast.success('Email Address Copied to Clipboard');
												}}
											>
												<EmailIcon />
											</Button>
										</div>
									</TooltipTrigger>
									<TooltipContent>
										<p>Copy to clipboard</p>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
							{selectedContact?.phoneNumber && (
								<TooltipProvider delayDuration={200}>
									<Tooltip>
										<TooltipTrigger asChild>
											<div className='shadow-[0_2px_0_rgba(35,84,230,0.08)] rounded-md w-[48px] p-2 pl-3 h-[48px]'>
												<Button
													variant={'ghost'}
													onClick={() => {
														navigator.clipboard.writeText(
															selectedContact.phoneNumber || ''
														);
														toast.success('Phone Number Copied to Clipboard');
													}}
												>
													<PhoneIcon />
												</Button>
											</div>
										</TooltipTrigger>
										<TooltipContent>
											<p>Copy to clipboard</p>
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>
							)}
							{selectedContact?.website && (
								<TooltipProvider delayDuration={200}>
									<Tooltip>
										<TooltipTrigger asChild>
											<div className='shadow-[0_2px_0_rgba(35,84,230,0.08)] rounded-md w-[48px] p-2 pl-3 h-[48px]'>
												<Button
													variant={'ghost'}
													onClick={() => {
														navigator.clipboard.writeText(
															selectedContact.website || ''
														);
														toast.success('Website Link Copied to Clipboard');
													}}
												>
													<WebIcon />
												</Button>
											</div>
										</TooltipTrigger>
										<TooltipContent>
											<p>Copy to clipboard</p>
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>
							)}
						</div>
					</SheetHeader>
					<ContactDetails
						selectedContact={selectedContact}
						handleContactActions={handleContactActions}
						handleUpdateContactNote={handleUpdateContactNote}
						handleCreateContactPerson={handleCreateContactPerson}
						isOpen={isOpen}
						onOpenChange={onOpenChange}
					/>

					{/* CONTACT PEOPLE---- */}
					<ContactPersons
						contactPersons={selectedContact?.contactPersons || []}
						handleCreateContactPerson={handleCreateContactPerson}
					/>
					{/* TODO: make this functional */}
					{/* TOTAL---REVENUE----EXPENSES---- */}
					<div className='flex justify-between'>
						<div>
							<h1 className='text-lg font-semibold '>Total revenue</h1>
							<p className='text-[#0f172a] mt-4 mb-2'>
								{' '}
								<span className='text-[#334155] text-sm  font-medium'>
									Sales:
								</span>{' '}
								$0.00
							</p>
							<p className='text-[#64748b] text-sm font-medium'>0 invoices</p>
						</div>
						<div className='text-right'>
							<h1 className='text-lg font-semibold '>Total expenses</h1>
							<p className='text-[#0f172a] mt-4 mb-2'>
								{' '}
								<span className='text-[#334155] text-sm font-medium '>
									Purchases:
								</span>{' '}
								$0.00
							</p>
							<p className='text-[#64748b] text-sm font-medium'>0 invoices</p>
						</div>
					</div>
				</SheetContent>
			)}
		</Sheet>
	);
}
