'use client';

import { useForm } from 'react-hook-form';
import { ContactSchema } from './zod-validation-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Contact } from '@/types/prisma-types';
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
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';

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
			nif: undefined,
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
		console.log(
			'📣 -> file: contact-form.tsx:70 -> onSubmit -> data:',
			JSON.stringify(data, null, 2)
		);
		if (Object.keys(errors).length) {
			console.log(
				'📣 -> file: contact-form.tsx:72 -> onSubmit -> errors:',
				JSON.stringify(errors, null, 2)
			);
			toast.error('There are errors in your form');
			return;
		}
		try {
			// selectedContact?.id
			// 	? handleContactFormSubmit(data, selectedContact?.id)
			// 	: handleContactFormSubmit(data);
		} catch (error) {
			console.error('Error creating contact:', error);
		}
	}

	useEffect(() => {
		if (selectedContact?.id) {
			reset({
				...form.getValues(),
				...selectedContact,
				address: { ...form.getValues().address, ...selectedContact?.address },
			});
		}
	}, [selectedContact]);
	const [selectedCountry, setSelectedCountry] = useState<string | undefined>(
		undefined
	);
	return (
		<Form {...form}>
			<form onSubmit={handleSubmit(onSubmit)}>

				<div>
					

					{/* Invoice settings */}
					<div className='mb-6'>
						
						<div className='grid grid-cols-2 gap-x-6'>
							<LanguagePicker control={control} />

							
						</div>
					</div>

					{/* Address */}
					<div>
						
						<div className='grid grid-cols-2 gap-x-6'>
							

							
							{/* Country Dropdown */}
							<CountryPicker control={control} name='address.countryId' />
						</div>
					</div>
				</div>
				{/* BUTTON----- */}
				<div >
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
