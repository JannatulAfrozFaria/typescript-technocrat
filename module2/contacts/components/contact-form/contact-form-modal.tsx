'use client';

import ContactForm from './contact-form';

import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogHeader,
} from '@/components/ui/dialog';
import type { Contact } from '@/types/prisma-types';
import { type Dispatch, type SetStateAction } from 'react';

interface ContactFormModalProps {
	isOpen: boolean;
	onOpenChange: Dispatch<SetStateAction<boolean>>;
	handleContactFormSubmit: (contactData: Contact, contactId?: string) => void;
	selectedContact?: Contact;
}

export default function ContactFormModal({
	isOpen,
	onOpenChange,
	handleContactFormSubmit,
	selectedContact,
}: ContactFormModalProps) {
	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent
				className='bg-white h-[95vh] p-5 !max-w-[48.2rem]'
				aria-describedby={undefined}
			>
				<DialogHeader>
					<DialogTitle className='text-[1.75rem] font-semibold'>
						{selectedContact ? 'Update Contact' : 'New Contact'}
					</DialogTitle>
				</DialogHeader>

				<ContactForm
					handleContactFormSubmit={handleContactFormSubmit}
					selectedContact={selectedContact}
				/>
			</DialogContent>
		</Dialog>
	);
}
