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
				{/* Radio Group */}
				<div className='grid grid-cols-2 gap-x-16 mb-10'>
					{/* CONTACT---TYPE */}
					<FormField
						control={form.control}
						name='type'
						render={({ field }) => (
							<FormItem className='space-y-4'>
								<FormLabel className='text-sm font-medium'>
									Contact type
								</FormLabel>
								<FormControl>
									<RadioGroup
										onValueChange={field.onChange}
										defaultValue={field.value}
										className='!flex gap-[2.5rem]'
									>
										<div className='flex items-center space-x-2'>
											<RadioGroupItem
												value='VENDOR'
												id='vendor'
												className='h-5 w-5 border border-[#94A3B8] text-white rounded-full data-[state=checked]:border-[4px] data-[state=checked]:border-[#2354E6]  '
											/>
											<FormLabel
												htmlFor='vendor'
												className='text-sm font-medium'
											>
												Vendor
											</FormLabel>
										</div>
										<div className='flex items-center space-x-2'>
											<RadioGroupItem
												value='CUSTOMER'
												id='customer'
												className='h-5 w-5 border border-[#94A3B8] text-white rounded-full data-[state=checked]:border-[4px] data-[state=checked]:border-[#2354E6]'
											/>
											<FormLabel
												htmlFor='customer'
												className='text-sm font-medium'
											>
												Customer
											</FormLabel>
										</div>
										<div className='flex items-center space-x-2'>
											<RadioGroupItem
												value='CUSTOMER_AND_VENDOR'
												id='both'
												className='h-5 w-5 border border-[#94A3B8] text-white rounded-full data-[state=checked]:border-[4px] data-[state=checked]:border-[#2354E6]'
											/>
											<FormLabel htmlFor='both' className='text-sm font-medium'>
												Both
											</FormLabel>
										</div>
									</RadioGroup>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					{/* ENTITY---TYPE---- */}
					<FormField
						control={form.control}
						name='entity'
						render={({ field }) => (
							<FormItem className='space-y-4'>
								<FormLabel className='text-sm font-medium'>
									Entity type
								</FormLabel>
								<FormControl>
									<RadioGroup
										onValueChange={field.onChange}
										defaultValue={field.value}
										className='!flex gap-[2.5rem]'
									>
										<div className='flex items-center space-x-2'>
											<RadioGroupItem
												value='BUSINESS'
												id='business'
												className='h-5 w-5 border border-[#94A3B8] text-white rounded-full data-[state=checked]:border-[4px] data-[state=checked]:border-[#2354E6]'
											/>
											<FormLabel
												htmlFor='business'
												className='text-sm font-medium'
											>
												Business
											</FormLabel>
										</div>
										<div className='flex items-center space-x-2'>
											<RadioGroupItem
												value='INDIVIDUAL'
												id='individual'
												className='h-5 w-5 border border-[#94A3B8] text-white rounded-full data-[state=checked]:border-[4px] data-[state=checked]:border-[#2354E6]'
											/>
											<FormLabel
												htmlFor='individual'
												className='text-sm font-medium'
											>
												Individual
											</FormLabel>
										</div>
									</RadioGroup>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

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
							<TextField
								name='email'
								label='Email'
								control={control}
								placeholder='Email'
							/>

							<TextField
								name='phoneNumber'
								label='Phone Number'
								control={control}
								placeholder='Phone Number'
							/>
							{/* Website Field */}
							<TextField
								name='website'
								label='Website'
								control={control}
								placeholder='Website'
							/>
							{/* NIF Field */}
							<TextField
								name='nif'
								label='NIF'
								control={control}
								placeholder='NIF'
							/>
							{/* VAT Number Field */}
							<TextField
								name='vatNumber'
								label='VAT Number'
								control={control}
								placeholder='VAT Number'
							/>
						</div>
					</div>

					{/* Invoice settings */}
					<div className='mb-6'>
						<h1 className='text-[#0F172A] text-lg font-semibold mb-4'>
							Invoice Settings
						</h1>
						<div className='grid grid-cols-2 gap-x-6'>
							<LanguagePicker control={control} />
							<CurrencyPicker control={control} />
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
							<TextField
								name='address.addressLine1'
								label='Address Line 1'
								control={control}
								placeholder='Address Line 1'
							/>
							{/* Postal Code */}
							<TextField
								name='address.postalCode'
								label='Postal Code'
								control={control}
								placeholder='Postal Code'
								type='number'
							/>

							<TextField
								name='address.addressLine2'
								label='Address Line 2'
								control={control}
								placeholder='Address Line 2'
							/>
							{/* PROVINCE--- */}
							<TextField
								name='address.province'
								label='Province'
								control={control}
								placeholder='Province'
							/>
							<TextField
								name='address.city'
								label='City'
								control={control}
								placeholder='City'
							/>
							{/* Country Dropdown */}
							<CountryPicker control={control} name='address.countryId' />
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
