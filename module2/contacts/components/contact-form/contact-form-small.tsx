'use client';

import { useForm } from 'react-hook-form';
import { ContactSchema } from './zod-validation-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Contact } from '@/types/prisma-types';
import { isObjectTruthy } from '@/lib/utils';
// import { Form } from '@/components/ui/form';
import {
	CountryPicker,
	CurrencyPicker,
	LanguagePicker,
	TextField,
} from '@/components/form-elements';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { useEffect } from 'react';
import { toast } from 'sonner';
interface ContactFormProps {
	selectedContact?: Contact;
	handleContactFormSubmit: (contactData: Contact, contactId?: string) => void;
}

export default function ContactForm({
	selectedContact,
	handleContactFormSubmit,
}: ContactFormProps) {
	const form = useForm<Contact>({
		resolver: zodResolver(ContactSchema),
		defaultValues: {
			type: 'VENDOR',
			entity: 'BUSINESS',
			name: '',
			email: '',
			phoneNumber: undefined,
			website: '',
			nif: '',
			vatNumber: '',
			languageId: '',
			discountPercentage: undefined,
			currencyId: '',
			dueDateInDays: undefined,
			address: {
				addressLine1: '',
				addressLine2: '',
				city: '',
				postalCode: undefined,
				province: '',
				countryId: '',
			},
		},
	});

	const {
		control,
		handleSubmit,
		reset,
		formState: { errors },
	} = form;

	async function onSubmit(data: Contact) {
		if (Object.keys(errors).length) {
			toast.error('There are errors in your form');
			return;
		}
		try {
			selectedContact?.id
				? handleContactFormSubmit(data, selectedContact?.id)
				: handleContactFormSubmit(data);
		} catch (error) {
			console.error('Error creating contact:', error);
		}
	}

	useEffect(() => {
		if (selectedContact?.id) {
			reset({
				...form.getValues(),
				...selectedContact,
				address: {
					...form.getValues().address,
					...selectedContact?.address,
				},
			});
		}
	}, [selectedContact]);

	return (
		<Form {...form}>
			<form onSubmit={handleSubmit(onSubmit)}>


				{/* Basic Info */}
				<div>
				

					{/* Invoice settings */}
					<div className='mb-6'>
						<h1 className='text-[#0F172A] text-lg font-semibold mb-4'>
							Invoice Settings
						</h1>
						<div className='grid grid-cols-2 gap-x-6'>
							
							<TextField
								name='discountPercentage'
								label='Standard discount'
								control={control}
								placeholder='0%'
								type='number'
							/>
							{/* Standard Due Date Days */}
							<TextField
								name='dueDateInDays'
								label='Standard due date (days)'
								control={control}
								placeholder='14'
								type='number'
							/>
						</div>
					</div>

					{/* Address */}
					<div>
						<h1 className='text-[#0F172A] text-lg font-semibold mb-4'>
							Address
						</h1>
						<div className='grid grid-cols-2 gap-x-6'>
							
							{/* Postal Code */}
							<TextField
								name='address.postalCode'
								label='Postal Code'
								control={control}
								placeholder='Postal Code'
								type='number'
							/>

							
						</div>
					</div>
				</div>
				{/* BUTTON----- */}
				<div className='text-left mr-1 mt-5 flex justify-end items-end'>
					<button
						type='submit'
						className='w-[198px] h-[44px] bg-[#2354E6] text-white py-2 rounded-md'
					>
						{selectedContact?.id ? 'Update Contact' : 'Create Contact'}
					</button>
				</div>
			</form>
		</Form>
	);
}
