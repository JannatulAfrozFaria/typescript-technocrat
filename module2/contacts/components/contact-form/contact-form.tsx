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
				{/* Basic Info */}
				<div>
					<div className='mb-6'>


							<FormField
								control={control}
								name={'phoneNumber'}
								render={({ field }) => (
									<FormItem>
										{<FormLabel>Phone Number</FormLabel>}
										<FormControl>
											<div>
												<PhoneInput
													defaultCountry='es'
													preferredCountries={['es', 'us']}
													className='border rounded-md !items-center '
													style={{
														backgroundColor: '#F8FAFC',
														height: 40,
														fontFamily: 'axiforma',
													}}
													inputClassName='!border-none !bg-transparent !text-sm !font-medium !w-full'
													countrySelectorStyleProps={{
														buttonStyle: {
															backgroundColor: 'transparent',
															border: 'none',
															paddingLeft: '0.5rem',
															paddingRight: '0.5rem',
														},
														dropdownStyleProps: {
															style: {
																boxShadow: 'none',
															},
															className:
																'!w-[346px] border !px-1 !overflow-y-auto scrollbar-none',
															listItemClassName: '!py-1 !hover:bg-red-100',
														},
													}}
													placeholder={'Phone Number'}
													value={field.value as string | undefined}
													// onChange={(phoneNumber) => field.onChange(phoneNumber)}
													onChange={(phoneNumber, { country }) => {
														field.onChange(phoneNumber);
														setSelectedCountry(country.iso2);
													}}
													disableDialCodeAndPrefix={!selectedCountry}
													showDisabledDialCodeAndPrefix={!!selectedCountry}
												/>
											</div>
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
					
				</div>
			</form>
		</Form>
	);
}
