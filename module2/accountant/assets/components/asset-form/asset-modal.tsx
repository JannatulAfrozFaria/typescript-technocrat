'use client';
import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogHeader,
} from '@/components/ui/dialog';
import { type Dispatch, type SetStateAction } from 'react';
import FormHeading from '@/components/form-heading';
import AssetForm from './asset-form';

interface AssetModalProps {
	isOpen: boolean;
	onOpenChange: Dispatch<SetStateAction<boolean>>;
}

export default function AssetModal({ isOpen, onOpenChange }: AssetModalProps) {
	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent
				className='bg-white  !max-w-[42.2rem]'
				aria-describedby={undefined}
			>
				<DialogHeader>
					<DialogTitle>
						<FormHeading text='New asset' />
					</DialogTitle>
				</DialogHeader>
				<AssetForm onOpenChange={onOpenChange} />
			</DialogContent>
		</Dialog>
	);
}
