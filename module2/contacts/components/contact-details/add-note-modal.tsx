import AddNoteIcon from '@/components/icon-components/add-note-icon';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { type Dispatch, type SetStateAction, useState } from 'react';

interface AddNoteModalProps {
	isOpen: boolean;
	onOpenChange: Dispatch<SetStateAction<boolean>>;
	handleUpdateContactNote: (note: string, contactId: string) => Promise<void>;
	contactId: string;
	contactNote: string;
}

export default function AddNoteModal({
	isOpen,
	onOpenChange,
	handleUpdateContactNote,
	contactId,
	contactNote,
}: AddNoteModalProps) {
	const [note, setNote] = useState(contactNote);

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent style={{ width: '600px' }}>
				<DialogHeader>
					<DialogTitle>
						<div className='grid grid-cols-1 justify-center text-center'>
							<div className='flex justify-center mt-4'>
								<AddNoteIcon />
							</div>
							<h1 className='font-semibold text-3xl mt-3 mb-6'>Add note</h1>
						</div>
					</DialogTitle>
					<DialogDescription>
						<span className='text-sm font-medium text-black mb-2'>
							Description
						</span>
						<textarea
							className='w-full h-48 mb-6 p-2 overflow-auto scrollbar-thin bg-[#f8fafc] border-2 border-[#e2e8f0] rounded-xl'
							value={note}
							onChange={({ target: { value } }) => setNote(value)}
						/>
						<Button
							className='bg-[#2354e6] text-white w-full rounded-md font-semibold'
							onClick={() => {
								onOpenChange(false);
								handleUpdateContactNote(note, contactId);
							}}
						>
							Save & Close
						</Button>
					</DialogDescription>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	);
}
