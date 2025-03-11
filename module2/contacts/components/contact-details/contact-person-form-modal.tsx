import { Button } from '@/components/ui/button';
import {
	DialogHeader,
	Dialog,
	DialogContent,
	DialogTitle,
} from '@/components/ui/dialog';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form } from '@/components/ui/form';
import { TextField } from '@/components/form-elements';
import PhoneNumberInput from '@/components/phone-number-input';
import type { Dispatch, SetStateAction } from 'react';
import type { ContactPersonFormDataType } from './contact-persons';

// Zod schema for validation
const ContactPersonFormSchema = z.object({
	firstName: z.string().min(1, 'First Name is required'),
	lastName: z.string().optional(),
	email: z.string().email('Invalid email format').optional().or(z.literal('')),
	phoneNumber: z
		.string()
		.regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format')
		.optional()
		.or(z.literal('')),
});

interface ContactPersonFormModalProps {
	isOpen: boolean;
	onOpenChange: Dispatch<SetStateAction<boolean>>;
	contactPersonData: ContactPersonFormDataType;
	handleContactPersonData: (
		key: keyof ContactPersonFormDataType,
		value: string
	) => void;
	handleSubmitContactPersonForm: (data: ContactPersonFormDataType) => void;
}

export default function ContactPersonFormModal({
	isOpen,
	onOpenChange,
	handleSubmitContactPersonForm,
	handleContactPersonData,
	contactPersonData,
}: ContactPersonFormModalProps) {
	const form = useForm<ContactPersonFormDataType>({
		resolver: zodResolver(ContactPersonFormSchema),
		defaultValues: contactPersonData, // Initialize with existing data
	});

	const {
		control,
		handleSubmit,
		formState: { errors },
	} = form;

	const onSubmit = (data: ContactPersonFormDataType) => {
		handleSubmitContactPersonForm(data); // Pass validated data to parent
		onOpenChange(false); // Close the modal
	};

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent style={{ width: '600px' }}>
				<DialogHeader>
					<DialogTitle>
						<span className='font-semibold text-3xl mb-6'>
							Create Contact Person
						</span>
					</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={handleSubmit(onSubmit)}>
						<TextField
							name='firstName'
							label='First Name'
							placeholder='First name'
							control={control}
						/>
						<TextField
							name='lastName'
							label='Last Name'
							placeholder='Last name'
							control={control}
						/>
						<TextField
							name='email'
							placeholder='Email'
							label='Email'
							control={control}
						/>
						<PhoneNumberInput control={control} name='phoneNumber' />
						<Button
							type='submit'
							className='bg-[#2354E6] w-full mt-6 h-[44px] text-white py-2 rounded-md'
						>
							Create Contact Person
						</Button>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
