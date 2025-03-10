'use client';
import {
	useForm,
	useFieldArray,
	useWatch,
	Control,
	FieldValues,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import {
	TextField,
	DatePicker,
	TextArea,
	CurrencyPicker,
} from '@/components/form-elements';
import { Input } from '@/components/ui/input';
import {
	FormField,
	FormItem,
	FormControl,
	FormMessage,
} from '@/components/ui/form';
import type { Currency, InvoiceType } from '@/types/prisma-types';
import { Button } from '@/components/ui/button';
import { FaArrowRight } from 'react-icons/fa6';
import { GoPlus } from 'react-icons/go';
import ContactFormMinModal from '../dropdowns/contact-dropdown/contact-form-min-modal';
import OurContactFormMinModal from '../dropdowns/our-contact-dropdown/our-contact-form-min-modal';
import ProductFormMinModal from '../dropdowns/product-dropdown/product-form-min-modal';
import BankAccountFormMinModal from '../dropdowns/bank-account-dropdown/bank-account-form-min-modal';
import TagFormMinModal from '../dropdowns/tag-dropdown/tag-form-min-modal';
import SalesAccountFormMinModal from '../dropdowns/sales-account-dropdown/sales-account-form-min-modal';

import ContactDropDown from '../dropdowns/contact-dropdown/contact-dropdown';
import OurContactDropDown from '../dropdowns/our-contact-dropdown/our-contact-dropdown';
import ProductDropDown from '../dropdowns/product-dropdown/product-dropdown';
import BankAccountDropDown from '../dropdowns/bank-account-dropdown/bank-account-dropdown';
import ContactPersonDropDown from '../dropdowns/contact-person-dropdown/contact-person-dropdown';
import SalesAccountDropDown from '../dropdowns/sales-account-dropdown/sales-account-dropdown';
import TagDropDown from '../dropdowns/tag-dropdown/tag-dropdown';

import { toast } from 'sonner';
import { useState, useMemo, useEffect, useRef } from 'react';
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
} from './zod-validation-schema';

import { useSearchParams } from 'next/navigation';
import type { ContactPerson } from '@/types/prisma-types';
import ContactPersonFormMinModal from '../dropdowns/contact-person-dropdown/contact-person-form-min-modal';
import TabButtons from '../tab-buttons';
import BreadCrumbs from '@/components/bread-crumbs';
interface ProductOption {
	label: string;
	value: string;
	quantity: number;
	unitPrice: number;
	priceWithVAT: number;
}

interface InvoiceFormProps {
	type: InvoiceType;
	isRecurring?: boolean;
	setFormData: (data: any) => void;
	goPreview: () => void;
}

export default function InvoiceForm({
	type,
	isRecurring,
	setFormData,
	goPreview,
}: InvoiceFormProps) {
	const form = useForm<InvoiceFormValues>({
		resolver: zodResolver(InvoiceSchema),
		defaultValues: defaultInvoiceValues,
	});

	const errors = form.formState.errors;
	const submitRef = useRef<() => void | undefined>();
	useEffect(() => {
		setValue('type', type);
		if (isRecurring) {
			setValue('recurringInfo.isRecurring', isRecurring);
		}
	}, [type, isRecurring]);

	const [contacts, setContacts] = useState<
		{
			label: string;
			value: string;
			contactPersons: ContactPerson[];
			address: string;
			phoneNumber: string;
		}[]
	>([]);
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

	const { control, setValue, getValues } = form;
	const { fields, append, remove, replace } = useFieldArray<InvoiceFormValues>({
		control: form.control,
		name: 'products',
	});

	const [lastEdited, setLastEdited] = useState<
		Record<number, 'unitPrice' | 'priceWithVAT'>
	>({});

	useEffect(() => {
		console.log('Form errors:', errors);
	}, [errors]);

	type BillDetails = {
		name: string;
		address: string;
		phone: string;
	};

	const [billedFrom, setBilledFrom] = useState<BillDetails>({
		name: '',
		address: '',
		phone: '',
	});

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
			// const discount = product.discount || 0; //using discount as amount
			const discount = (product.unitPrice * product.discount) / 100 || 0; //using discount as percentage
			const unitPrice = product.unitPrice || 0;
			const tax = product.tax || 0;

			const initialSubtotal = unitPrice * quantity;
			const discountAmount = (initialSubtotal * discount) / 100;
			const priceAfterDiscount = initialSubtotal - discountAmount;
			const vatAmount = priceAfterDiscount * (tax / 100);

			subtotal += initialSubtotal;
			totalDiscount += discountAmount;
			taxTotal += vatAmount;
		});

		return {
			subtotal,
			totalDiscount,
			taxTotal,
			finalTotal: subtotal - totalDiscount + taxTotal,
		};
	}, [watchedProducts]);

	const updatedProducts = watchedProducts?.map((product) => {
		const unitPrice = Number(product.unitPrice) || Number(product.priceWithVAT);
		const quantity = Number(product.quantity) || 0;
		const discount = Number(product.discount) || 0;
		const initialSubtotal = unitPrice * quantity;
		const discountAmount = (initialSubtotal * discount) / 100;
		const subtotal = initialSubtotal;
		return { ...product, subtotal, discountAmount };
	});

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
				tax: 0,
				priceWithVAT: 0,
				discount: 0,
			},
		];
		if (JSON.stringify(watchedProducts) !== JSON.stringify(defaultProducts)) {
			toast.message('Selected products were removed due to currency change');
		}
		replace(defaultProducts);
	}, [currencyId]);

	const onSubmit = (data: InvoiceFormValues) => {
		// console.log('submiting', data);
		//
		setFormData({
			...data,
			isFilled: true,
			billedFrom,
			billedTo: contacts?.find(
				(contact) => contact.value === selectedContactId
			),
			updatedProducts,
			subtotal,
			totalDiscount,
			taxTotal,
			finalTotal,
		});
		setIsFilled(true);
		goPreview();
	};

	const handleUnitPriceChange = (
		e: React.ChangeEvent<HTMLInputElement>,
		onChange: (value: number) => void,
		index: number
	) => {
		const value = e.target.valueAsNumber || 0;
		onChange(value);

		const tax = Number(getValues(`products.${index}.tax`)) || 0;
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

		const tax = Number(getValues(`products.${index}.tax`)) || 0;
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

	//TODO: see if this already exists in prisma-types
	type SelectedProduct = {
		id: string;
		name: string;
		priceBeforeVat: number;
		vatPercentage: number | null;
		priceAfterVat: number | null;
	};
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
			setValue(`products.${index}.tax`, vatPercentage);
		} else {
			setValue(`products.${index}.tax`, 0);
		}
		// setLastEdited((prev) => ({ ...prev, [index]: 'unitPrice' }));
	};

	// TODO: replace with dynamic company ID
	const companyId = '679243216bff8182ca775264';
	return (
		<div className='p-8'>
			<BreadCrumbs />
			<Form {...form}>
				<form className='rounded-3xl ' onSubmit={form.handleSubmit(onSubmit)}>
					<div className='flex justify-between'>
						<h1 className='text-[28px] font-semibold text-[#0F172A]'>
							New Invoice
						</h1>
						<Button
							type='submit'
							className='bg-[#2354e6] text-white px-8 text-lg'
						>
							Next Step <FaArrowRight style={{ marginLeft: 10 }} />
						</Button>
					</div>
					<div className='flex pt-4 gap-6'>
						<TabButtons
							action={() => isFilled && form.handleSubmit(onSubmit)()}
							state='details'
						/>
					</div>

					<div className='flex mt-6 justify-between'>
						<p className='text-lg text-[#0F172A] mt-2 font-semibold'>
							Invoice Details
						</p>
						<div className='w-[232px]'>
							<FormField
								control={form.control}
								name='type'
								render={({ field }: { field: any }) => (
									<FormItem>
										<FormControl>
											<Select
												key={
													form.watch('type') +
													form.watch('recurringInfo.isRecurring')
												}
												onValueChange={(selectedValue) => {
													const isRecurringInvoice =
														selectedValue === 'RECURRING';

													// Map duplicate values back to 'SALE'
													const mappedType = ['RECEIPT', 'NEW_SALE'].includes(
														selectedValue
													)
														? 'SALE'
														: selectedValue;

													// Update form values
													form.setValue('type', mappedType);
													form.setValue(
														'recurringInfo.isRecurring',
														isRecurringInvoice
													);
												}}
												value={
													form.watch('type') // Otherwise, show the actual type value
												}
											>
												<SelectTrigger className='!font-normal !text-sm !text-[#0F172A]'>
													<SelectValue placeholder='Select invoice type' />
												</SelectTrigger>
												<SelectContent className='font-axiforma font-normal'>
													<SelectGroup>
														<SelectItem value='SALE'>
															Standard Invoice
														</SelectItem>
														<SelectItem value='RECURRING'>
															Recurring Invoice
														</SelectItem>
														<SelectItem value='RECEIPT'>New Receipt</SelectItem>{' '}
														{/* Changed from SALE */}
														<SelectItem value='OFFER'>New Offer</SelectItem>
														<SelectItem value='CREDIT_NOTE'>
															New Credit Note
														</SelectItem>
														<SelectItem value='NEW_SALE'>New Sale</SelectItem>{' '}
														{/* Changed from SALE */}
													</SelectGroup>
												</SelectContent>
											</Select>
										</FormControl>
									</FormItem>
								)}
							/>
						</div>
					</div>

					{/* Invoice Details */}
					<div className=' bg-[#FFFFFF] border border-[#E2E8F0] p-4 mt-2 rounded-2xl'>
						<div className='flex rounded-2xl justify-between gap-6 items-center'>
							{/* WHO IS IT FOR---? */}
							<div className='w-[344px]'>
								<ContactDropDown
									name='contactId'
									label={'Who is this invoice for?'}
									control={form.control}
									companyId={companyId}
									setValue={setValue}
									contacts={contacts}
									setContacts={setContacts}
									setShowModal={setShowContactFormModal}
								/>
							</div>
							{/* CUSTOMER---CONTACT---- */}
							<div className='w-[344px]'>
								<ContactPersonDropDown
									control={form.control}
									setShowModal={setShowContactPersonFormModal}
									isReady={selectedContactId !== ''}
									contacts={selectedContactPersons}
								/>
							</div>
							{/* OUR---CONTACT--- */}
							<div className='w-[344px]'>
								<OurContactDropDown
									control={form.control}
									companyId={companyId}
									setShowModal={setShowOurContactFormModal}
									setBilledFrom={setBilledFrom}
								/>
							</div>
						</div>

						{/* Additional Invoice Fields */}
						<div className='flex gap-6 items-center'>
							{/* REFERENCE---- */}
							<div className='w-1/2'>
								<TextArea
									name='reference'
									label='Reference'
									placeholder=''
									control={form.control}
								/>
							</div>

							{/* COMMENT---- */}

							<div className='w-1/2'>
								<TextArea
									name='commentToCustomer'
									label='Comment to Customer'
									placeholder=''
									control={form.control}
								/>
							</div>
						</div>
					</div>

					<div className='flex bg-[#FFFFFF] border pl-4 pr-4 pt-4 rounded-2xl justify-between gap-6 items-center mt-[30px]'>
						<div className='w-[344px]'>
							<SalesAccountDropDown
								control={form.control}
								companyId={companyId}
								setShowModal={setShowSalesAFormModal}
							/>
						</div>

						<div className='w-[344px]'>
							<TagDropDown
								control={form.control}
								companyId={companyId}
								setShowModal={setShowTagFormModal}
							/>
						</div>

						<div className='w-[344px]'>
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
							<div className='flex justify-between gap-6 items-center'>
								<div className='w-[344px]'>
									<DatePicker
										name='recurringInfo.firstSendingDate'
										label='First Sending Date'
										variant='dark'
										control={form.control}
									/>
								</div>
								<div className='w-[344px]'>
									<DatePicker
										name='recurringInfo.lastSendingDate'
										label='Last Sending Date'
										variant='dark'
										control={form.control}
									/>
								</div>
								<div className='w-[344px]'>
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
					<div className='bg-[#E8EDFC] rounded-2xl pl-4 pr-4 pt-4 h-[112px] flex justify-between gap-6 items-center mt-[30px]'>
						<div className='w-[233px]'>
							<BankAccountDropDown
								control={form.control}
								companyId={companyId}
								setShowModal={setShowBankFormModal}
							/>
						</div>
						<div className='w-[186px]'>
							<TextField
								name={`invoiceNumber`}
								label='Invoice no.'
								placeholder=''
								type='number'
								control={form.control}
							/>
						</div>
						<div className='w-[186px]'>
							<DatePicker
								name={`invoiceDate`}
								label='Invoice Date'
								control={form.control}
							/>
						</div>
						<div className='w-[185px]'>
							<DatePicker
								name={`dueDate`}
								label='Due Date'
								control={form.control}
							/>
						</div>
						<div className='w-[185px]'>
							<CurrencyPicker control={form.control} />
						</div>
					</div>

					{/* Product Details */}
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
											currencyCode={selectedCurrency?.code || false}
											setValue={setValue}
											setShowModal={setShowProductFormModal}
											onProductSelect={(selectedProduct) =>
												handleProductSelect(selectedProduct, index)
											}
										/>
									</div>

									{/* Quantity */}
									<div>
										<TextField
											disabled={selectedCurrency ? false : true}
											name={`products.${index}.quantity`}
											control={form.control}
											type='number'
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
															placeholder=''
															value={field.value ?? ''}
															onChange={(e) => {
																const value = e.target.value;
																field.onChange(
																	value === '' ? undefined : Number(value)
																);
																handleUnitPriceChange(e, field.onChange, index);
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
											name={`products.${index}.tax`}
											render={({ field }) => (
												<FormItem>
													<FormControl>
														<Select
															onValueChange={(value) => {
																console.log('tax', value);
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
											name={`products.${index}.discount`}
											placeholder='0 %'
											control={form.control}
											type='number'
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
										tax: 0,
										priceWithVAT: 0,
										discount: 0,
									})
								}
							>
								<div className='flex mb-28 cursor-pointer text-[#2354E6] gap-2 items-center'>
									<GoPlus /> Add Product Line
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
										<b>$ {subtotal.toFixed(2)}</b>
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
									}}
								>
									<p className='text-[#084C2E] font-semibold'> Grand Total</p>
									<p>
										<b>$ {finalTotal.toFixed(2)}</b>
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
			/>
			<BankAccountFormMinModal
				isOpen={showBankFormModal}
				setShowModal={setShowBankFormModal}
			/>
			<TagFormMinModal
				isOpen={showTagFormModal}
				setShowModal={setShowTagFormModal}
			/>
			<SalesAccountFormMinModal
				isOpen={showSalesAFormModal}
				setShowModal={setShowSalesAFormModal}
			/>
		</div>
	);
}
