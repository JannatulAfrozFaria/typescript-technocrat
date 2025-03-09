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
import { CountrySelectorDropdown } from 'react-international-phone';
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
				{/* Basic Info */}
				<div>
					<div className='mb-6'>
						<h1 className='text-[#0F172A] text-lg font-semibold mb-4'>
							Basic Info
						</h1>
						<div className='grid grid-cols-2 gap-x-6'>
							<TextField
								control={control}
								name='name'
								label='Name'
								placeholder='Name'
							/>
							<FormField
								control={control}
								name={'phoneNumber'}
								render={({ field }) => (
									<FormItem>
										{<FormLabel>Phone Number</FormLabel>}
										<FormControl>
											<PhoneInput
												defaultCountry='es'
												preferredCountries={['es', 'us']}
												className='border rounded-md !items-center '
												style={{
													backgroundColor: '#F8FAFC',
													height: 40,
													fontFamily: 'axiforma',
												}}
												inputClassName='!border-none !bg-transparent !text-sm !font-medium'
												countrySelectorStyleProps={{
													buttonStyle: {
														backgroundColor: 'transparent',
														border: 'none',
														paddingLeft: '0.5rem',
													},
													// buttonContentWrapperClassName: 'hover:bg-blue-300',
													dropdownStyleProps: {
														style: {
															boxShadow: 'none', // Remove shadow
														},
														className:
															'!w-[346px] border rounded-md !px-1 !max-h-60 !overflow-y-auto scrollbar-none custom-dropdown',
													},
													listItemStyle: {
														backgroundColor: 'white', // Default background color
													},
													listItemClassName: 'custom-dropdown-item',
												}}
												placeholder={'Phone Number'}
												value={field.value as string | undefined}
												
												onChange={(phoneNumber, { country }) => {
													field.onChange(phoneNumber); // Update the form field value
													setSelectedCountry(country.iso2); // Update the selected country state
												}}
												disableDialCodeAndPrefix={!selectedCountry} // Hide dial code by default
												showDisabledDialCodeAndPrefix={!!selectedCountry} // Show dial code when a country is selected
											/>
										</FormControl>
										<div className='min-h-[20px] text-red-600'>
											<FormMessage />
										</div>
									</FormItem>
								)}
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
