// 'use client';

// import { Button } from '@/components/ui/button';
// import {
// 	Dialog,
// 	DialogContent,
// 	DialogTitle,
// 	DialogHeader,
// 	DialogFooter,
// 	DialogDescription,
// } from '@/components/ui/dialog';
// import { type Dispatch, type SetStateAction } from 'react';

// interface ContactConfirmDeleteModalProps {
// 	isOpen: boolean;
// 	onOpenChange: Dispatch<SetStateAction<boolean>>;
// 	handleDeleteContact: () => void;
// }

// export default function ContactConfirmDeleteModal({
// 	isOpen,
// 	onOpenChange,
// 	handleDeleteContact,
// }: ContactConfirmDeleteModalProps) {
// 	return (
// 		<Dialog open={isOpen} onOpenChange={onOpenChange}>
// 			<DialogContent aria-describedby={undefined} className='p-5'>
// 				<DialogHeader className='mb-8'>
// 					<DialogTitle className='!text-lg !font-semibold text-center'>
// 						Are you sure?
// 					</DialogTitle>
// 					<DialogDescription className='text-center '>
// 						You will not be able to retrieve it once deleted
// 					</DialogDescription>
// 				</DialogHeader>

// 				<DialogFooter className='flex flex-row justify-between'>
// 					<Button
// 						variant={'destructive'}
// 						className='w-full bg-red-500 !px-4 !py-2'
// 						onClick={() => handleDeleteContact()}
// 					>
// 						Delete
// 					</Button>
// 					<Button
// 						variant={'outline'}
// 						className='w-full !px-4 !py-2'
// 						onClick={() => onOpenChange(false)}
// 					>
// 						Cancel
// 					</Button>
// 				</DialogFooter>
// 			</DialogContent>
// 		</Dialog>
// 	);
// }
