'use client';

import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogHeader,
} from '@/components/ui/dialog';

import { type Dispatch, type SetStateAction } from 'react';
import AddAccountForm from './add-account-form';

interface AddAccountModalProps {
	isOpen: boolean;
	setShowModal: Dispatch<SetStateAction<boolean>>;
	reference?: string | null;
}

export default function AddAccountModal({
	isOpen,
	setShowModal,
	reference,
}: AddAccountModalProps) {
	return (
		<Dialog
			open={isOpen}
			// onOpenChange={setShowModal}
			onOpenChange={(open) => {
				if (!open) return;
				setShowModal(open);
			}}
			modal
		>
			<DialogContent
				className='bg-white  p-5 max-w-[460px]'
				aria-describedby={undefined}
				//--------------
				onInteractOutside={(e) => {
					e.preventDefault();
				}}
				onEscapeKeyDown={(e) => {
					e.preventDefault();
				}}
			>
				<DialogHeader>
					<DialogTitle className='text-[1.75rem] font-semibold mb-2'>
						Add New Account
					</DialogTitle>
				</DialogHeader>
				<AddAccountForm setShowModal={setShowModal} reference={reference} />
			</DialogContent>
		</Dialog>
	);
}
