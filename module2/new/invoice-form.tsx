'use client';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import {
	TextField,
	DatePicker,
	TextArea,
	CurrencyPicker,
} from '@/components/form-elements';
import { useExpenseSubmit } from '@/lib/hooks/useCreateInvoice';
import { Input } from '@/components/ui/input';
import {
	FormField,
	FormItem,
	FormControl,
	FormMessage,
} from '@/components/ui/form';
import { useRouter, usePathname } from 'next/navigation';
import type { Currency, Invoice, InvoiceType } from '@/types/prisma-types';
import { Button } from '@/components/ui/button';
import { FaArrowRight } from 'react-icons/fa6';
import { GoPlus } from 'react-icons/go';
import ContactFormMinModal from '../dropdowns/contact-dropdown/contact-form-min-modal';
import OurContactFormMinModal from '../dropdowns/our-contact-dropdown/our-contact-form-min-modal';
import ProductFormMinModal from '../dropdowns/product-dropdown/product-form-min-modal';
import BankAccountFormMinModal from '../dropdowns/bank-account-dropdown/bank-account-form-min-modal';
import TagFormMinModal from '../dropdowns/tag-dropdown/tag-form-min-modal';
import AccountFormMinModal from '../dropdowns/account-dropdown/account-form-min-modal';
import { Loader as LucidSmall } from 'lucide-react';
import ContactDropDown from '../dropdowns/contact-dropdown/contact-dropdown';
import OurContactDropDown from '../dropdowns/our-contact-dropdown/our-contact-dropdown';
import ProductDropDown from '../dropdowns/product-dropdown/product-dropdown';
import BankAccountDropDown from '../dropdowns/bank-account-dropdown/bank-account-dropdown';
import ContactPersonDropDown from '../dropdowns/contact-person-dropdown/contact-person-dropdown';
import AccountDropDown from '../dropdowns/account-dropdown/account-dropdown';
import TagDropDown from '../dropdowns/tag-dropdown/tag-dropdown';
import Loader from '@/components/loader';
import { toast } from 'sonner';
import { useState, useMemo, useEffect } from 'react';
import {
	SelectTrigger,
	SelectGroup,
	SelectItem,
	Select,
	SelectContent,
	SelectValue,
} from '@/components/ui/select';
import useCurrencies from '@/lib/hooks/useCurrencies';
import Image from 'next/image';
import {
	InvoiceSchema,
	type InvoiceFormValues,
	defaultInvoiceValues,
	type InvoiceFormKeys,
} from './zod-validation-schema';

import { capitalizeFirstLetter } from '@/lib/utils';
import type { ContactPerson } from '@/types/prisma-types';
import ContactPersonFormMinModal from '../dropdowns/contact-person-dropdown/contact-person-form-min-modal';
import TabButtons from '../tab-buttons';
import BreadCrumbs from '@/components/bread-crumbs';
import type {
	SelectedProduct,
	ContactDropDownOptionType,
	BillDetails,
} from '@/types/types';
import UploadAndPreview from '@/components/upload-and-preview';

interface InvoiceFormProps {
	type: InvoiceType;
	isRecurring?: boolean;
	setFormData?: (data: any) => void;
	goPreview?: () => void;
	needsCrossChecking?: boolean;
	resetForm?: () => void;
}

export default function InvoiceForm({
	type,
	isRecurring,
	setFormData,
	needsCrossChecking = false,
	goPreview,
	resetForm = () => {},
}: InvoiceFormProps) {
	const form = useForm<InvoiceFormValues>({
		resolver: zodResolver(InvoiceSchema),
		defaultValues: defaultInvoiceValues,
	});
	const errors = form.formState.errors;
	useEffect(() => {
		if (isRecurring) {
			setValue('type', 'SALE');
			setValue('recurringInfo.isRecurring', isRecurring);
		} else {
			setValue('type', type);
			setValue('recurringInfo.isRecurring', false);
		}
	}, [type, isRecurring]);

	const [contacts, setContacts] = useState<ContactDropDownOptionType[]>([]);
	const [selectedCurrency, setSelectedCurrency] = useState<Currency>();

	//Modals
	const [showContactFormModal, setShowContactFormModal] = useState(false);
	const [showContactPersonFormModal, setShowContactPersonFormModal] =
		useState(false);
	const [showOurContactFormModal, setShowOurContactFormModal] = useState(false);
	const [showProductFormModal, setShowProductFormModal] = useState(false);
	const [showBankFormModal, setShowBankFormModal] = useState(false);
	const [showTagFormModal, setShowTagFormModal] = useState(false);
	const [showSalesAFormModal, setShowSalesAFormModal] = useState(false);
	const [isFilled, setIsFilled] = useState(false);
	const [isRedirecting, setIsRedirecting] = useState(false);

	const [attachments, setAttachments] = useState<File[]>([]);
	const { isUploading, uploadError, handleExpenseSubmit } = useExpenseSubmit();
	const { control, setValue, getValues } = form;
	const { fields, append, remove, replace } = useFieldArray<InvoiceFormValues>({
		control: form.control,
		name: 'products',
	});

	const [lastEdited, setLastEdited] = useState<
		Record<number, 'unitPrice' | 'priceWithVAT'>
	>({});

	// TODO: Replace this with actual company details
	const billedFrom = {
		name: 'Vatiero',
		address: {
			addressLine1: 'Kosta Hadjikakou 10, Atlantis Building, Apt 401',
		},
		phoneNumber: '+880 1836096182',
	};
	//Contacts
	const contactId = useWatch({ control, name: 'contactId' });
	useEffect(() => {
		if (contactId) {
			setValue('contactPersonId', ''); // Reset contactPersonId
		}
	}, [contactId]);

	// Contact Person
	const selectedContactId = form.watch('contactId');
	const selectedContactPersons =
		contacts?.find((contact) => contact.value === selectedContactId)
			?.contactPersons || [];

	const handleContactPersonCreate = (contactPerson: ContactPerson) => {
		setContacts((prev) =>
			prev.map((contact) =>
				contact.value === selectedContactId
					? {
							...contact,
							contactPersons: [...contact.contactPersons, contactPerson],
						}
					: contact
			)
		);
	};

	// Products
	const watchedProducts = useWatch({ control, name: 'products' });
	const { subtotal, totalDiscount, taxTotal, finalTotal } = useMemo(() => {
		let subtotal = 0,
			totalDiscount = 0,
			taxTotal = 0;

		(watchedProducts || []).forEach((product) => {
			const quantity = product.quantity || 0;

			//using discount as percentage
			const discountAmount = product.discountPercentage
				? (product.unitPrice * product.discountPercentage) / 100
				: 0;

			const unitPrice = product.unitPrice || 0;
			const tax = product.vatPercentage || 0;

			const priceAfterDiscount = unitPrice - discountAmount;
			const vatAmount = priceAfterDiscount * (tax / 100);

			const rowSubtotal = unitPrice * quantity;
			const rowDiscountAmount = discountAmount * quantity;
			const rowVatAmount = vatAmount * quantity;

			subtotal += rowSubtotal;
			totalDiscount += rowDiscountAmount;
			taxTotal += rowVatAmount;
		});

		let finalTotal = subtotal - totalDiscount + taxTotal;
		form.setValue('subtotal', subtotal);
		form.setValue('discountAmount', totalDiscount);
		form.setValue('vatAmount', taxTotal);
		form.setValue('grandTotal', finalTotal);
		return {
			subtotal,
			totalDiscount,
			taxTotal,
			finalTotal,
		};
	}, [watchedProducts]);

	const currencyId = useWatch({ control, name: 'currencyId' });
	const { currencies } = useCurrencies();

	useEffect(() => {
		const currency = currencies.find((currency) => currency.id === currencyId);
		setSelectedCurrency(currency);
		const defaultProducts = [
			{
				productName: '',
				quantity: 1,
				unitPrice: 0,
				vatPercentage: 0,
				priceWithVAT: 0,
				discountPercentage: 0,
			},
		];
		if (watchedProducts && subtotal) {
			if (JSON.stringify(watchedProducts) !== JSON.stringify(defaultProducts)) {
				toast.message('Selected products were removed due to currency change');
			}
		}
		if (needsCrossChecking) {
		} else {
			replace(defaultProducts);
		}
	}, [currencyId]);

	const onSubmit = async (data: InvoiceFormValues) => {
		let currentData;
		if (type === 'CREDIT_NOTE') {
			const { dueDate, ...rest } = data; // Remove dueDate
			currentData = rest;
		} else {
			currentData = data;
		}
		if (needsCrossChecking) {
			await handleExpenseSubmit(companyId, currentData as Invoice, attachments);
			if (type === 'EXPENSE') {
				router.push('/en/expenses/expense-overview');
			}
			if (type === 'SALE') {
				router.push('/en/sales/sales-overview');
			}
		} else {
			//@ts-ignore because its not undefined when crossChecking is not require
			setFormData({
				...currentData,
				isFilled: true,
				billedFrom,
				billedTo: contacts?.find(
					(contact) => contact.value === selectedContactId
				),
			});
			setIsFilled(true);
			//@ts-ignore because its not undefined when crossChecking is not require
			goPreview();
		}
	};

	const handleUnitPriceChange = (
		e: React.ChangeEvent<HTMLInputElement>,
		onChange: (value: number) => void,
		index: number
	) => {
		const value = e.target.valueAsNumber || 0;
		onChange(value);

		const tax = Number(getValues(`products.${index}.vatPercentage`)) || 0;
		const priceWithVAT = (value * (1 + tax / 100)).toFixed(2);

		setValue(`products.${index}.priceWithVAT`, parseFloat(priceWithVAT));
		setLastEdited((prev) => ({ ...prev, [index]: 'unitPrice' }));
	};

	const handleVatIncludedChange = (
		e: React.ChangeEvent<HTMLInputElement>,
		onChange: (value: number) => void,
		index: number
	) => {
		const value = e.target.valueAsNumber || 0;
		onChange(value);

		const tax = Number(getValues(`products.${index}.vatPercentage`)) || 0;
		const unitPrice = (value / (1 + tax / 100)).toFixed(2);

		setValue(`products.${index}.unitPrice`, parseFloat(unitPrice));
		setLastEdited((prev) => ({ ...prev, [index]: 'priceWithVAT' }));
	};

	const handleTaxChange = (
		value: string,
		onChange: (value: number) => void,
		index: number
	) => {
		const tax = parseFloat(value);
		onChange(tax);

		const lastEditedField = lastEdited[index] || 'unitPrice';
		const currentUnitPrice = getValues(`products.${index}.unitPrice`) || 0;
		const currentVatIncluded = getValues(`products.${index}.priceWithVAT`) || 0;

		if (lastEditedField === 'unitPrice') {
			const newVatIncluded = (currentUnitPrice * (1 + tax / 100)).toFixed(2);
			setValue(`products.${index}.priceWithVAT`, parseFloat(newVatIncluded));
		} else {
			const newUnitPrice = (currentVatIncluded / (1 + tax / 100)).toFixed(2);
			setValue(`products.${index}.unitPrice`, parseFloat(newUnitPrice));
		}
	};

	// TODO: move this to types folder to make reusable
	// we need to handle product select differently so created custom type here

	const handleProductSelect = (
		selectedProduct: SelectedProduct,
		index: number
	) => {
		const { id, name, priceBeforeVat, vatPercentage, priceAfterVat } =
			selectedProduct;
		setValue(`products.${index}.productId`, id);
		setValue(`products.${index}.productName`, name);

		if (priceBeforeVat) {
			setValue(`products.${index}.unitPrice`, priceBeforeVat);
		} else {
			setValue(`products.${index}.unitPrice`, 0);
		}
		if (priceAfterVat) {
			setValue(`products.${index}.priceWithVAT`, priceAfterVat);
		} else {
			setValue(`products.${index}.priceWithVAT`, 0);
		}

		if (vatPercentage) {
			setValue(`products.${index}.vatPercentage`, vatPercentage);
		} else {
			setValue(`products.${index}.vatPercentage`, 0);
		}
	};

	// only to be used by child components like in dropdowns
	const handleSetValue = <K extends keyof InvoiceFormKeys>(
		key: K,
		value: InvoiceFormKeys[K]
	) => {
		// @ts-expect-error
		setValue(key, value);
	};

	// TODO: replace with dynamic company ID
	const companyId = '679243216bff8182ca775264';

	// TODO: replace with dynamic company address
	const companyAddress = {
		addressLine1: '221B Baker Street',
	};

	// TODO: replace with dynamic company phone number
	const companyPhoneNumber = '+34958151271';

	const router = useRouter();
	const pathname = usePathname();

	// Mapping values to URLs

	// Set selected value based on URL
	if (isRedirecting) return <Loader message='Setting New Invoice Form...' />;
	return (
		<div className='p-8'>
			<BreadCrumbs />
			<Form {...form}>
				<form className='rounded-3xl ' onSubmit={form.handleSubmit(onSubmit)}>
					<div className='flex justify-between'>
						<h1 className='text-[28px] font-semibold text-[#0F172A] capitalize'>
							{needsCrossChecking ? `New ${type.toLowerCase()}` : 'New Invoice'}
						</h1>

						<Button
							type='submit'
							className='bg-[#2354e6] text-white px-8 text-lg capitalize'
							disabled={isUploading}
						>
							{needsCrossChecking ? (
								isUploading ? (
									<>
										<LucidSmall className='h-5 w-5 animate-spin text-white mr-2' />{' '}
										Registering...
									</>
								) : (
									`Register ${type.toLowerCase()}`
								)
							) : (
								'Next Step'
							)}
							<FaArrowRight style={{ marginLeft: 10 }} />
						</Button>
					</div>

					{!needsCrossChecking && (
						<div className='flex pt-4 gap-6'>
							<TabButtons
								action={() => isFilled && form.handleSubmit(onSubmit)()}
								state='details'
							/>
						</div>
					)}
					<div className='flex mt-6 justify-between'>
						<p className='text-lg text-[#0F172A] mt-2 font-semibold'>
							{needsCrossChecking ? capitalizeFirstLetter(type) : 'Invoice'}{' '}
							Details
						</p>
						{!needsCrossChecking && (
							<div className='w-[232px]'>
								<Select
									onValueChange={(selectedValue) => {
										setIsRedirecting(true);
										router.push(selectedValue); // Redirect to the selected URL
									}}
									value={pathname.split('/').pop()}
								>
									<SelectTrigger className='!font-normal !text-sm !text-[#0F172A]'>
										<SelectValue placeholder='Select invoice type' />
									</SelectTrigger>
									<SelectContent className='font-axiforma font-normal'>
										<SelectGroup>
											{[
												'New Standard Invoice',
												'New Recurring Invoice',
												'New Receipt',
												'New Offer',
												'New Credit Note',
												'New Sale',
											].map((value) => (
												<SelectItem
													key={value}
													value={value.toLowerCase().replace(/\s+/g, '-')}
												>
													{value}
												</SelectItem>
											))}
										</SelectGroup>
									</SelectContent>
								</Select>
							</div>
						)}
					</div>
					{/* Form ----Inputs */}
					<div className={needsCrossChecking ? 'flex ' : 'block'}>
						{/* Main Form Inputs */}
						<div className={needsCrossChecking ? 'w-full' : ''}>
							{/* Invoice Details */}
							<div className=' bg-[#FFFFFF] border border-[#E2E8F0] p-4 mt-2 rounded-2xl'>
								<div
									className={`grid grid-cols-3 rounded-2xl justify-between items-end ${needsCrossChecking ? 'gap-0 xl:gap-6' : 'gap-6'}`}
								>
									{/* WHO IS IT FOR---? */}
									<div
										className={
											needsCrossChecking
												? 'col-span-3 xl:col-span-1'
												: 'col-span-1'
										}
									>
										<ContactDropDown
											name='contactId'
											label={'Who is this invoice for?'}
											control={form.control}
											companyId={companyId}
											setValue={handleSetValue}
											contacts={contacts}
											setContacts={setContacts}
											setShowModal={setShowContactFormModal}
										/>
									</div>
									{/* CUSTOMER---CONTACT---- */}
									<div
										className={
											needsCrossChecking
												? 'col-span-3 xl:col-span-1'
												: 'col-span-1'
										}
									>
										<ContactPersonDropDown
											control={form.control}
											setShowModal={setShowContactPersonFormModal}
											isReady={selectedContactId !== ''}
											contactPersons={selectedContactPersons}
										/>
									</div>
									{/* OUR---CONTACT--- */}
									<div
										className={
											needsCrossChecking
												? 'col-span-3 xl:col-span-1'
												: 'col-span-1'
										}
									>
										<OurContactDropDown
											control={form.control}
											companyId={companyId}
											setShowModal={setShowOurContactFormModal}
											// setBilledFrom={setBilledFrom}
											addressLine1={companyAddress.addressLine1 || ''}
										/>
									</div>
								</div>

								{/* Additional Invoice Fields */}
								<div className={`grid grid-cols-2 gap-6 items-end`}>
									{/* REFERENCE---- */}
									<div className='col-span-2 xl:col-span-1'>
										<TextArea
											name='reference'
											label='Reference'
											placeholder=''
											control={form.control}
										/>
									</div>

									{/* COMMENT---- */}

									<div className='col-span-2 xl:col-span-1'>
										<TextArea
											name='commentToCustomer'
											label='Comment to Customer'
											placeholder=''
											control={form.control}
										/>
									</div>
								</div>
							</div>

							{/* <div className='flex bg-[#FFFFFF] border pl-4 pr-4 pt-4 rounded-2xl justify-between gap-6 items-end mt-[30px]'> */}
							<div
								className={`grid grid-cols-3 bg-[#FFFFFF] border pl-4 pr-4 pt-4 rounded-2xl justify-between items-end mt-[30px] ${needsCrossChecking ? 'gap-0 xl:gap-6' : 'gap-6'}`}
							>
								<div
									className={
										needsCrossChecking
											? 'col-span-3 xl:col-span-1'
											: 'col-span-1'
									}
								>
									<AccountDropDown
										control={form.control}
										companyId={companyId}
										isExpense={type == 'EXPENSE' ? true : false}
										setShowModal={setShowSalesAFormModal}
									/>
								</div>

								<div
									className={
										needsCrossChecking
											? 'col-span-3 xl:col-span-1'
											: 'col-span-1'
									}
								>
									<TagDropDown
										control={form.control}
										companyId={companyId}
										setShowModal={setShowTagFormModal}
									/>
								</div>

								<div
									className={
										needsCrossChecking
											? 'col-span-3 xl:col-span-1'
											: 'col-span-1'
									}
								>
									<TextField
										name={`internalNote`}
										label='Internal Note'
										placeholder=''
										control={form.control}
									/>
								</div>
							</div>

							{/* Recurring Invoice */}
							{form.watch('recurringInfo.isRecurring') && (
								<div className='bg-[#FFFFFF] border pl-4 pr-4 pt-4 rounded-2xl mt-[30px]'>
									<p className='text-[#0F172A] mt-2 mb-4  font-semibold'>
										Recurring Schedule
									</p>
									<div
										// className='flex justify-between gap-6 items-center'
										className={`grid grid-cols-3 bg-[#FFFFFF] border pl-4 pr-4 pt-4 rounded-2xl justify-between items-end mt-[30px] ${needsCrossChecking ? 'gap-0' : 'gap-6'}`}
									>
										<div
											// className='w-[344px]'
											className={
												needsCrossChecking ? 'col-span-3 ' : 'col-span-1'
											}
										>
											<DatePicker
												name='recurringInfo.firstSendingDate'
												label='First Sending Date'
												variant='dark'
												control={form.control}
											/>
										</div>
										<div
											className={
												needsCrossChecking ? 'col-span-3 ' : 'col-span-1'
											}
										>
											<DatePicker
												name='recurringInfo.lastSendingDate'
												label='Last Sending Date'
												variant='dark'
												control={form.control}
											/>
										</div>
										<div
											className={
												needsCrossChecking ? 'col-span-3 ' : 'col-span-1'
											}
										>
											<TextField
												name='recurringInfo.frequency'
												control={form.control}
												type='text'
												label='Frequency'
											/>
										</div>
									</div>
								</div>
							)}

							<div className='bg-[#E8EDFC] rounded-2xl p-4 h-auto flex flex-wrap md:grid md:grid-cols-2 lg:flex justify-between gap-x-4 sm:gap-x-6 items-center mt-[30px]'>
								<div className='flex-1 min-w-[250px] w-full'>
									<BankAccountDropDown
										control={form.control}
										companyId={companyId}
										setShowModal={setShowBankFormModal}
									/>
								</div>
								<div className='flex-1 min-w-[250px] w-full'>
									<TextField
										name='invoiceNumber'
										label='Invoice no.'
										placeholder=''
										type='number'
										control={form.control}
									/>
								</div>
								<div className='flex-1 min-w-[250px] w-full'>
									<DatePicker
										name='invoiceDate'
										label='Invoice Date'
										control={form.control}
									/>
								</div>
								{type !== 'CREDIT_NOTE' && (
									<div className='flex-1 min-w-[250px] w-full'>
										<DatePicker
											name='dueDate'
											label='Due Date'
											control={form.control}
										/>
									</div>
								)}
								<div className='flex-1 min-w-[250px]  w-full'>
									<CurrencyPicker
										key={form.watch('currencyId')}
										selectContentClassName='!w-[230px]'
										control={form.control}
									/>
								</div>
							</div>
							{needsCrossChecking && (
								<div className='grid grid-cols-4 bg-[#FFFFFF] border pl-4 pr-4 pt-4 rounded-2xl justify-between gap-x-6 xl:gap-6 items-end mt-[30px]'>
									<div className='col-span-2 xl:col-span-1'>
										<TextField
											name={`subtotal`}
											label='Subtotal'
											placeholder=''
											type='number'
											step='any'
											min='0'
											control={form.control}
										/>
									</div>

									<div className='col-span-2 xl:col-span-1'>
										<TextField
											name={`vatAmount`}
											label='VAT'
											placeholder=''
											type='number'
											step='any'
											min='0'
											control={form.control}
										/>
									</div>

									<div className='col-span-2 xl:col-span-1'>
										<TextField
											name={`discountAmount`}
											label='Discount'
											placeholder=''
											type='number'
											step='any'
											min='0'
											control={form.control}
										/>
									</div>

									<div className='col-span-2 xl:col-span-1'>
										<TextField
											name={`grandTotal`}
											label='Grand Total'
											placeholder=''
											type='number'
											step='any'
											min='0'
											control={form.control}
										/>
									</div>
								</div>
							)}
						</div>

						{needsCrossChecking && (
							<div className='mt-2 w-[100%] xl:w-[50%] ml-2 h-[calc(100vh-400px)] sm:h-[calc(75vh-40px)] xl:h-auto'>
								<UploadAndPreview
									heading='Upload File for Preview'
									attachments={attachments}
									setAttachments={setAttachments}
								/>
							</div>
						)}
					</div>
					{/* Product Details */}
					{!needsCrossChecking && (
						<div className='bg-[#FFFFFF] border border-[#E2E8F0] shadow-sm mt-[30px] rounded-2xl p-4'>
							<h3 className='text-xl'>Product Details</h3>
							<div>
								{/* Column Titles */}
								<div className='grid grid-cols-[0.25fr_3.5fr_2fr_2fr_2fr_2fr_2fr_0.25fr] gap-4 font-medium mt-8'>
									<div>#</div>
									<div>Product</div>
									<div>Quantity</div>
									<div>Unit Price excl. VAT</div>
									<div>VAT</div>
									<div>Unit Price inc. VAT</div>
									<div>Discount %</div>
									<div></div>
								</div>

								{fields.map((field, index) => (
									<div
										key={field.id}
										className={`grid grid-cols-[0.25fr_3.5fr_2fr_2fr_2fr_2fr_2fr_0.25fr] gap-4 items-start ${
											index === 0 ? 'mt-2' : 'mt-0'
										}`}
									>
										{/* Index Number */}
										<div className='font-medium flex items-center align-center mt-2'>
											{index + 1}
										</div>

										{/* Product Dropdown */}
										<div>
											<ProductDropDown
												control={form.control}
												companyId={companyId}
												name={`products.${index}.`}
												currency={selectedCurrency}
												// @ts-expect-error because I want to deploy
												fields={fields}
												currentIndex={index}
												setValue={handleSetValue}
												setShowModal={setShowProductFormModal}
												onProductSelect={(selectedProduct) =>
													handleProductSelect(selectedProduct, index)
												}
											/>
										</div>

										{/* Quantity */}
										<div>
											<FormField
												control={control}
												name={`products.${index}.quantity`}
												render={({ field }) => (
													<FormItem>
														<FormControl>
															<Input
																disabled={selectedCurrency ? false : true}
																className='border w-full'
																style={{
																	backgroundColor: '#F8FAFC',
																	height: 40,
																}}
																type='number'
																step='1'
																min='0'
																placeholder=''
																value={field.value ?? ''}
																onChange={(e) => {
																	const value = e.target.value;
																	field.onChange(
																		value === ''
																			? undefined
																			: Math.floor(Number(value))
																	);
																}}
															/>
														</FormControl>
														<div className='min-h-[20px] text-red-600'>
															<FormMessage />
														</div>
													</FormItem>
												)}
											/>
										</div>

										{/* Unit Price excl. VAT */}
										<div>
											<FormField
												control={control}
												name={`products.${index}.unitPrice`}
												render={({ field }) => (
													<FormItem>
														<FormControl>
															<Input
																disabled={selectedCurrency ? false : true}
																className='border w-full'
																style={{
																	backgroundColor: '#F8FAFC',
																	height: 40,
																}}
																type='number'
																step='any'
																min='0'
																placeholder=''
																value={field.value ?? ''}
																onChange={(e) => {
																	const value = e.target.value;
																	field.onChange(
																		value === '' ? undefined : Number(value)
																	);
																	handleUnitPriceChange(
																		e,
																		field.onChange,
																		index
																	);
																}}
															/>
														</FormControl>
														<div className='min-h-[20px] text-red-600'>
															<FormMessage />
														</div>
													</FormItem>
												)}
											/>
										</div>

										{/* VAT */}
										<div>
											<FormField
												control={control}
												name={`products.${index}.vatPercentage`}
												render={({ field }) => (
													<FormItem>
														<FormControl>
															<Select
																disabled={selectedCurrency ? false : true}
																onValueChange={(value) => {
																	handleTaxChange(value, field.onChange, index);
																}}
																value={
																	field.value !== undefined &&
																	field.value !== null
																		? String(field.value)
																		: '0'
																}
															>
																<SelectTrigger
																	style={{
																		backgroundColor: '#F8FAFC',
																		height: 40,
																		color: selectedCurrency
																			? 'black'
																			: '#A0AEC0',
																		fontWeight: selectedCurrency
																			? '400'
																			: 'lighter',
																		cursor: selectedCurrency
																			? 'pointer'
																			: 'not-allowed',
																	}}
																	className='w-full border'
																>
																	<SelectValue placeholder='Select Tax' />
																</SelectTrigger>
																<SelectContent>
																	<SelectItem value='0'>0%</SelectItem>
																	<SelectItem value='10'>10%</SelectItem>
																	<SelectItem value='20'>20%</SelectItem>
																	<SelectItem value='21'>21%</SelectItem>
																</SelectContent>
															</Select>
														</FormControl>
														<div className='min-h-[20px] text-red-600'>
															<FormMessage />
														</div>
													</FormItem>
												)}
											/>
										</div>

										{/* Unit Price inc. VAT */}
										<div>
											<FormField
												control={control}
												name={`products.${index}.priceWithVAT`}
												render={({ field }) => (
													<FormItem>
														<FormControl>
															<Input
																disabled={selectedCurrency ? false : true}
																className='border w-full'
																style={{
																	backgroundColor: '#F8FAFC',
																	height: 40,
																}}
																type='number'
																step='any'
																min='0'
																placeholder=''
																value={field.value ?? ''}
																onChange={(e) => {
																	const value = e.target.value;
																	field.onChange(
																		value === '' ? undefined : Number(value)
																	);
																	handleVatIncludedChange(
																		e,
																		field.onChange,
																		index
																	);
																}}
															/>
														</FormControl>
														<div className='min-h-[20px] text-red-600'>
															<FormMessage />
														</div>
													</FormItem>
												)}
											/>
										</div>

										{/* Discount */}
										<div>
											<TextField
												disabled={selectedCurrency ? false : true}
												name={`products.${index}.discountPercentage`}
												placeholder='0 %'
												control={form.control}
												type='number'
												step='any'
												min='0'
											/>
										</div>

										{/* Delete Button */}
										<div className='flex justify-center mt-3'>
											{fields.length > 1 && (
												<button
													type='button'
													className='cursor-pointer'
													onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
														e.preventDefault();
														remove(index);
													}}
												>
													<Image
														src='/elements.svg'
														width={20}
														height={20}
														alt='delete icon'
														className='cursor-pointer '
													/>
												</button>
											)}
										</div>
									</div>
								))}
							</div>
							{/* Common Fields */}

							<div className='flex justify-between gap-6 mt-14 mr-2 items-center mb-6'>
								<div
									onClick={() =>
										append({
											productName: '',
											quantity: 1,
											unitPrice: 0,
											vatPercentage: 0,
											priceWithVAT: 0,
											discountPercentage: 0,
										})
									}
								>
									<div className='flex mb-28 cursor-pointer text-[#2354E6] gap-2 items-center'>
										<GoPlus /> Add another Product
									</div>
								</div>
								<div
									style={{
										float: 'right',
										width: 'max-content',
										marginTop: '20px',
									}}
								>
									<div
										style={{
											display: 'flex',
											justifyContent: 'space-between',
											gap: 50,
										}}
									>
										<p>Subtotal</p>
										<p>
											<b>
												{selectedCurrency?.symbol} {subtotal.toFixed(2)}
											</b>
										</p>
									</div>
									<div
										style={{
											display: 'flex',
											justifyContent: 'space-between',
											marginTop: 10,
										}}
									>
										<p>Discount</p>
										<p>{totalDiscount.toFixed(2)}</p>
									</div>
									<div
										style={{
											display: 'flex',
											justifyContent: 'space-between',
											marginTop: 10,
										}}
									>
										<p>VAT</p>
										<p>{taxTotal.toFixed(2)}</p>
									</div>
									<div
										style={{
											display: 'flex',
											justifyContent: 'space-between',
											marginTop: 10,
											minWidth: 200,
										}}
									>
										<p className='text-[#084C2E] font-semibold'> Grand Total</p>
										<p>
											<b>
												{selectedCurrency?.symbol} {finalTotal.toFixed(2)}
											</b>
										</p>
									</div>
									<Button
										type='submit'
										className='bg-[#2354e6] text-white px-8 text-lg w-full mt-4'
									>
										Next Step <FaArrowRight style={{ marginLeft: 10 }} />
									</Button>
								</div>
							</div>
						</div>
					)}
				</form>
			</Form>
			<ContactFormMinModal
				isOpen={showContactFormModal}
				setShowModal={setShowContactFormModal}
				companyId={companyId}
			/>
			<OurContactFormMinModal
				isOpen={showOurContactFormModal}
				setShowModal={setShowOurContactFormModal}
				// companyId={companyId}
			/>
			<ContactPersonFormMinModal
				isOpen={showContactPersonFormModal}
				selectedContactId={selectedContactId}
				setShowModal={setShowContactPersonFormModal}
				handleCreate={handleContactPersonCreate}
			/>
			<ProductFormMinModal
				isOpen={showProductFormModal}
				setShowModal={setShowProductFormModal}
				currency={selectedCurrency}
			/>
			<BankAccountFormMinModal
				isOpen={showBankFormModal}
				setShowModal={setShowBankFormModal}
			/>
			<TagFormMinModal
				isOpen={showTagFormModal}
				setShowModal={setShowTagFormModal}
			/>
			<AccountFormMinModal
				isOpen={showSalesAFormModal}
				setShowModal={setShowSalesAFormModal}
				isExpense={type == 'EXPENSE' ? true : false}
			/>
		</div>
	);
}
