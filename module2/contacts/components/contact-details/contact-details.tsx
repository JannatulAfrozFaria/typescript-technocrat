import AddNoteIcon from '@/components/icon-components/add-note-icon';
import EditGrayIcon from '@/components/icon-components/edit-gray-icon';
import { Button } from '@/components/ui/button';
import type { Contact, ContactPerson } from '@/types/prisma-types';
import { EditIcon } from 'lucide-react';
import { useState, type Dispatch, type SetStateAction } from 'react';
import AddNoteModal from './add-note-modal';

interface ContactDetailsProps {
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

export default function ContactDetails({
	handleContactActions,
	handleUpdateContactNote,
	selectedContact,
}: ContactDetailsProps) {
	const [showAddNoteModal, setShowAddNoteModal] = useState(false);

	return (
		<>
			<div className='flex justify-between items-center my-4'>
				<div>
					<h1 className='text-lg font-semibold'>Contact Information</h1>
				</div>
				<button
					className='text-[#2354e6] flex gap-2 items-center font-semibold'
					onClick={() =>
						handleContactActions('edit', selectedContact?.id as string)
					}
				>
					<EditIcon />
					Edit
				</button>
			</div>
			<div className='p-4 text-[#334155]  bg-[#f8fafc] rounded-2xl  '>
				<div className='flex gap-4 justify-between  w-full'>
					<p>Email</p>
					<p className='text-right text-black'>{selectedContact?.email}</p>
				</div>
				<div className='flex justify-between  w-full'>
					<p>Phone</p>
					<p className='text-right text-black'>
						{selectedContact?.phoneNumber}
					</p>
				</div>
				<div className='flex justify-between  w-full'>
					<p>Address</p>
					<p className='text-right text-black'>
						{selectedContact?.address?.addressLine1}
					</p>
				</div>
				<div className='flex justify-between  w-full'>
					<p>Website</p>
					<p className='text-right text-black'>{selectedContact?.website}</p>
				</div>
			</div>
			<div>
				<h1 className='text-lg font-semibold mt-8 mb-4'>Create new</h1>
				<div className='grid grid-cols-3 gap-2 items-center text-[#334155] text-lg font-semibold'>
					<div className='py-2  border-2 rounded-xl border-[#e2e8f0] flex gap-2 items-center justify-center cursor-pointer '>
						<EditGrayIcon />
						<span>Offer</span>
					</div>
					<div className='py-2  border-2 rounded-xl border-[#e2e8f0] flex gap-2 items-center justify-center cursor-pointer'>
						{' '}
						<EditGrayIcon />
						<span>Invoice</span>
					</div>
					<div
						className='py-2  border-2 rounded-xl border-[#e2e8f0] flex gap-2 items-center justify-center cursor-pointer'
						onClick={() => setShowAddNoteModal(true)}
					>
						{' '}
						<EditGrayIcon />
						<span>Note</span>
					</div>
				</div>
			</div>
			<AddNoteModal
				isOpen={showAddNoteModal}
				onOpenChange={setShowAddNoteModal}
				handleUpdateContactNote={handleUpdateContactNote}
				contactId={selectedContact?.id || ''}
				contactNote={selectedContact?.note || ''}
			/>
		</>
	);
}
