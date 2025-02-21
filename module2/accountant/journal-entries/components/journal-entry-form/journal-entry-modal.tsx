'use client';
import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogHeader,
} from '@/components/ui/dialog';
import type { Contact } from '@/types/prisma-types';
import { type Dispatch, type SetStateAction } from 'react';
import JournalEntryForm from './journal-entry-form';
import FormHeading from '@/components/form-heading';

interface JournalEntryModalProps {
	isOpen: boolean;
	onOpenChange: Dispatch<SetStateAction<boolean>>;
}

export default function JournalEntryModal({
	isOpen,
	onOpenChange,
}: JournalEntryModalProps) {
	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent
				className='bg-white  !max-w-[48.2rem]'
				aria-describedby={undefined}
			>
				<DialogHeader>
					<DialogTitle>
						<FormHeading text='New  entry' />
					</DialogTitle>
				</DialogHeader>
				<JournalEntryForm onOpenChange={onOpenChange} />
			</DialogContent>
		</Dialog>
	);
}
