import ContactsHomeIcon from '@/components/icon-components/contacts-home-icon';
import { Button } from '@/components/ui/button';
import type { Dispatch, SetStateAction } from 'react';

type EmptyContactProps = {
	isPending: boolean;
	setShowContactFormModal: Dispatch<SetStateAction<boolean>>;
};

export default function EmptyContact({
	isPending,
	setShowContactFormModal,
}: EmptyContactProps) {
	return (
		<div className='px-12 py-40'>
			<div className='flex flex-col xl:flex-row gap-12 xl:gap-8 justify-start items-start xl:items-center bg-[#ffffff]  py-48 px-12 rounded-3xl'>
				<div className='w-4/5 xl:w-1/2'>
					<h1 className='text-xl xl:text-3xl font-semibold text-[#0F172A]'>
						Your contact list is feeling lonely
					</h1>
					<p className='mt-2  mb-6 text-base'>
						Start building relationships by adding new contacts or importing
						them in a snap!
					</p>
					<Button
						disabled={isPending}
						onClick={() => setShowContactFormModal(true)}
						className='bg-[#2354e6] text-white px-8 text-lg xl:text-xl '
					>
						{' '}
						+ New Contact
					</Button>
				</div>
				<div className='w-5/6 xl:w-1/2 flex justify-center'>
					<ContactsHomeIcon />
				</div>
			</div>
		</div>
	);
}
