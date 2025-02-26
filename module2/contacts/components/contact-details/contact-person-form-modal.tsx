import { Button } from '@/components/ui/button';
import {
	DialogHeader,
	Dialog,
	DialogContent,
	DialogTitle,
	DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import type { Dispatch, SetStateAction } from 'react';
import type { ContactPersonFormDataType } from './contact-persons';

interface ContactPersonFormModalProps {
	isOpen: boolean;
	onOpenChange: Dispatch<SetStateAction<boolean>>;
	contactPersonData: ContactPersonFormDataType;
	handleContactPersonData: (
		key: keyof ContactPersonFormDataType,
		value: string
	) => void;
	handleSubmitContactPersonForm: () => void;
}

export default function ContactPersonFormModal({
	isOpen,
	onOpenChange,
	handleSubmitContactPersonForm,
	handleContactPersonData,
	contactPersonData,
}: ContactPersonFormModalProps) {
	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent style={{ width: '600px' }}>
				<DialogHeader>
					<DialogTitle>
						<span className='font-semibold text-3xl mb-6'>
							Create contact person
						</span>
					</DialogTitle>
				</DialogHeader>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						handleSubmitContactPersonForm();
					}}
				>
					<h2 className='text-sm font-medium text-black mb-2'>First Name</h2>
					<Input
						bgColor='#f8fafc'
						borderColor='#e2e8f0'
						className='bg-[#f8fafc] border-2 border-[#e2e8f0] rounded-2xl text-[#64748b] w-full py-2 px-4'
						placeholder='First name'
						value={contactPersonData.firstName}
						onChange={({ target: { value } }) =>
							handleContactPersonData('firstName', value)
						}
					/>
					<h2 className='text-sm font-medium text-black my-2'>Last Name</h2>
					<Input
						bgColor='#f8fafc'
						borderColor='#e2e8f0'
						className='bg-[#f8fafc] border-2 border-[#e2e8f0] rounded-2xl text-[#64748b] w-full py-2 px-4'
						placeholder='Last name'
						value={contactPersonData.lastName}
						onChange={({ target: { value } }) =>
							handleContactPersonData('lastName', value)
						}
					/>
					<h2 className='text-sm font-medium text-black my-2'>Email</h2>
					<Input
						bgColor='#f8fafc'
						borderColor='#e2e8f0'
						className='bg-[#f8fafc] border-2 border-[#e2e8f0] rounded-2xl text-[#64748b] w-full py-2 px-4'
						placeholder='Email'
						value={contactPersonData.email}
						onChange={({ target: { value } }) =>
							handleContactPersonData('email', value)
						}
					/>
					<h2 className='text-sm font-medium text-black my-2'>Phone</h2>
					<Input
						bgColor='#f8fafc'
						borderColor='#e2e8f0'
						className='bg-[#f8fafc] border-2 border-[#e2e8f0] rounded-2xl text-[#64748b] w-full py-2 px-4'
						placeholder='Phone'
						value={contactPersonData.phoneNumber}
						onChange={({ target: { value } }) =>
							handleContactPersonData('phoneNumber', value)
						}
					/>
					<Button className='bg-[#2354e6] text-white w-full rounded-md font-semibold mt-6'>
						Create contact person
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
}
