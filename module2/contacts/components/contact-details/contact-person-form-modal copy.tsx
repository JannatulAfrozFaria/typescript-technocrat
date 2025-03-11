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
import PhoneNumberInput from '@/components/phone-number-input';
import { ContactPerson } from '@/types/prisma-types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form } from '@/components/ui/form';
import { TextField } from '@/components/form-elements';
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
const ContactPersonFormSchema = z.object({
	firstName: z.string().min(1, 'First Name is required'),
	lastName: z.string().min(1, 'Last Name is required'),
	email: z.string().min(1, 'Email is required'),
	phoneNumber: z
		.string()
		.regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format')
		.nullish(),
});

export default function ContactPersonFormModal({
	isOpen,
	onOpenChange,
	handleSubmitContactPersonForm,
	handleContactPersonData,
	contactPersonData,
}: ContactPersonFormModalProps) {
	const form = useForm<ContactPerson>({
		resolver: zodResolver(ContactPersonFormSchema),
		defaultValues: {},
	});
	// TODO: replace with dynamic company ID
	const {
		control,
		handleSubmit,
		formState: { errors },
	} = form;
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
				<Form {...form}>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							handleSubmitContactPersonForm();
						}}
					>
						{/* <h2 className='text-sm font-medium text-black mb-2'>First Name</h2>
						<Input
							bgColor='#f8fafc'
							borderColor='#e2e8f0'
							className='bg-[#f8fafc] border-2 border-[#e2e8f0] rounded-2xl text-[#64748b] w-full py-2 px-4'
							placeholder='First name'
							value={contactPersonData.firstName}
							onChange={({ target: { value } }) =>
								handleContactPersonData('firstName', value)
							}
						/> */}
						<TextField
							name='firstName'
							label='First Name'
							placeholder='Last name'
							control={control}
						></TextField>

						{/* <h2 className='text-sm font-medium text-black my-2'>Last Name</h2>
						<Input
							bgColor='#f8fafc'
							borderColor='#e2e8f0'
							className='bg-[#f8fafc] border-2 border-[#e2e8f0] rounded-2xl text-[#64748b] w-full py-2 px-4'
							placeholder='Last name'
							value={contactPersonData.lastName}
							onChange={({ target: { value } }) =>
								handleContactPersonData('lastName', value)
							}
						/> */}
						<TextField
							name='lastName'
							label='Last Name'
							placeholder='Last name'
							control={control}
						></TextField>
						{/* <h2 className='text-sm font-medium text-black my-2'>Email</h2>
						<Input
							bgColor='#f8fafc'
							borderColor='#e2e8f0'
							className='bg-[#f8fafc] border-2 border-[#e2e8f0] rounded-2xl text-[#64748b] w-full py-2 px-4'
							placeholder='Email'
							value={contactPersonData.email}
							onChange={({ target: { value } }) =>
								handleContactPersonData('email', value)
							}
						/> */}
						<TextField
							name='email'
							placeholder='Email'
							label='Email'
							control={control}
						></TextField>
						{/* <h2 className='text-sm font-medium text-black my-2'>Phone</h2>
						<Input
							bgColor='#f8fafc'
							borderColor='#e2e8f0'
							className='bg-[#f8fafc] border-2 border-[#e2e8f0] rounded-2xl text-[#64748b] w-full py-2 px-4'
							placeholder='Phone'
							value={contactPersonData.phoneNumber}
							onChange={({ target: { value } }) =>
								handleContactPersonData('phoneNumber', value)
							}
						/> */}
						<PhoneNumberInput control={control} name='phoneNumber' />
						{/* <Button className='bg-[#2354e6] text-white w-full rounded-md font-semibold mt-6'>
							Create contact person
						</Button> */}
						<Button
							type='submit'
							className=' bg-[#2354E6] w-full mt-6 h-[44px] border text-white py-2 rounded-md '
						>
							Create contact person
						</Button>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
