import { type HTMLInputTypeAttribute, useState } from 'react';
import {
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from '@/components/ui/form';
import useCurrencies from '@/lib/hooks/useCurrencies';
import { Input } from '@/components/ui/input';
import useLanguages from '@/lib/hooks/useLanguages';
import useCountries from '@/lib/hooks/useCountries';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from './ui/select';
import { type Control, useController } from 'react-hook-form';
import { Textarea } from './ui/textarea';
import { capitalizeFirstLetter } from '@/lib/utils';
import CalendarIcon from './icon-components/calendar-icon';
import { useRef } from 'react';
// Types for TextField, DatePicker, and DropDown props
type FormControlProps = {
	name: string;
	label: string;
	placeholder?: string;
	type?: HTMLInputTypeAttribute;
	control: Control<any>;
	disabled?: boolean;
};

// TextField Component
const TextField: React.FC<FormControlProps> = ({
	name,
	label,
	placeholder,
	control,
	disabled,
	type = 'text',
}) => {
	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem>
					{label && <FormLabel>{label}</FormLabel>}
					<FormControl>
						<Input
							className='border'
							style={{ backgroundColor: '#F8FAFC', height: 40 }}
							type={type}
							placeholder={placeholder}
							disabled={disabled}
							value={
								type === 'number'
									? field.value !== undefined && field.value !== null
										? field.value
										: ''
									: (field.value ?? '')
							}
							onChange={(e) => {
								const value = e.target.value;
								field.onChange(
									type === 'number'
										? value === ''
											? undefined
											: Number(value)
										: value
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
	);
};

type NumberTypeForm = {
	name: string;
	label: string;
	placeholder?: string;
	type?: HTMLInputTypeAttribute | undefined;
	control: Control<any>;
	disabled?: boolean;
};

const TextFieldNumberType: React.FC<NumberTypeForm> = ({
	name,
	label,
	placeholder,
	control,
	disabled,
	type,
}) => {
	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem>
					<FormLabel>{label}</FormLabel>
					<FormControl>
						<Input
							{...field}
							className='border'
							style={{ backgroundColor: '#F8FAFC', height: 40 }}
							type={type}
							placeholder={placeholder}
							disabled={disabled}
							onChange={(e) => {
								const value = e.target.value;
								field.onChange(type === 'number' ? Number(value) : value);
							}}
						/>
					</FormControl>
					<div className='min-h-[20px] text-red-600'>
						<FormMessage />
					</div>
				</FormItem>
			)}
		/>
	);
};
const TextArea: React.FC<FormControlProps> = ({
	name,
	label,
	placeholder,
	control,
	disabled,
}) => {
	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem>
					<FormLabel>{label}</FormLabel>
					<FormControl>
						<Textarea
							className='h-[88px]  p-4 border'
							style={{ backgroundColor: '#F8FAFC' }}
							placeholder={placeholder}
							{...field}
							disabled={disabled}
						></Textarea>
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
};

// DatePicker Component
// const DatePicker: React.FC<Omit<FormControlProps, 'placeholder'>> = ({
// 	name,
// 	label,
// 	control,
// 	disabled,
// }) => {
// 	return (
// 		<FormField
// 			control={control}
// 			name={name}
// 			render={({ field }) => (
// 				<FormItem>
// 					<FormLabel>{label}</FormLabel>
// 					<FormControl>
// 						<Input
// 							className='border'
// 							style={{ backgroundColor: '#F8FAFC', height: 40 }}
// 							type='date'
// 							{...field}
// 							disabled={disabled}
// 						/>
// 					</FormControl>
// 					<div className='min-h-[20px] text-red-600'>
// 						<FormMessage />
// 					</div>
// 				</FormItem>
// 			)}
// 		/>
// 	);
// };

// const DatePicker: React.FC<Omit<FormControlProps, 'placeholder'>> = ({
// 	name,
// 	label,
// 	control,
// 	disabled,
// }) => {
// 	const dateInputRef = useRef<HTMLInputElement>(null);

// 	return (
// 		<FormField
// 			control={control}
// 			name={name}
// 			render={({ field }) => (
// 				<FormItem>
// 					<FormLabel>{label}</FormLabel>
// 					<FormControl>
// 						<div className='relative w-full'>
// 							<input
// 								className='border px-3 py-2 rounded-md w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10 bg-[#F8FAFC] cursor-pointer'
// 								type='text'
// 								value={
// 									field.value
// 										? new Date(field.value).toISOString().split('T')[0]
// 										: ''
// 								}
// 								placeholder='Select Date'
// 								readOnly
// 								disabled={disabled}
// 								onClick={() => dateInputRef.current?.showPicker()}
// 							/>

// 							<input
// 								ref={dateInputRef}
// 								type='date'
// 								className='absolute inset-0 opacity-0 cursor-pointer'
// 								value={field.value || ''}
// 								onChange={(e) => field.onChange(e.target.value)}
// 								disabled={disabled}
// 							/>

// 							<div
// 								className='absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer'
// 								onClick={() => dateInputRef.current?.showPicker()}
// 							>
// 								<CalendarIcon
// 									width={19}
// 									height={19}
// 									className='text-gray-500'
// 								/>
// 							</div>
// 						</div>
// 					</FormControl>
// 					<div className='min-h-[20px] text-red-600'>
// 						<FormMessage />
// 					</div>
// 				</FormItem>
// 			)}
// 		/>
// 	);
// };

// DropDown Props Type

const DatePicker: React.FC<Omit<FormControlProps, 'placeholder'>> = ({
	name,
	label,
	control,
	disabled,
}) => {
	const dateInputRef = useRef<HTMLInputElement>(null);

	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem>
					<FormLabel>{label}</FormLabel>
					<FormControl>
						{/* Make the entire field clickable */}
						<div
							className='relative w-full'
							onClick={() => !disabled && dateInputRef.current?.showPicker()}
						>
							{/* Visible input field (text type) */}
							<input
								className='border px-3 py-2 rounded-md w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10 bg-[#F8FAFC] cursor-pointer'
								type='text'
								value={
									field.value
										? new Date(field.value).toISOString().split('T')[0]
										: ''
								}
								placeholder='Select Date'
								readOnly
								disabled={disabled}
							/>

							{/* Hidden actual date input */}
							<input
								ref={dateInputRef}
								type='date'
								className='absolute inset-0 opacity-0 cursor-pointer'
								value={field.value || ''}
								onChange={(e) => field.onChange(e.target.value)}
								disabled={disabled}
							/>

							{/* Custom Calendar Icon */}
							<div className='absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer'>
								<CalendarIcon
									width={19}
									height={19}
									className='text-gray-500'
								/>
							</div>
						</div>
					</FormControl>
					<div className='min-h-[20px] text-red-600'>
						<FormMessage />
					</div>
				</FormItem>
			)}
		/>
	);
};

type DropDownProps = {
	name: string;
	label: string;
	control: any;
	disabled?: boolean;
	children: React.ReactNode;
	placeholder?: string;
};

// DropDown Component
const DropDown: React.FC<DropDownProps> = ({
	name,
	label,
	control,
	disabled,
	children,
	placeholder,
}) => {
	return (
		<FormField
			control={control}
			name={name}
			render={({ field }: { field: any }) => (
				<FormItem>
					<FormLabel className='font-axiforma'>{label}</FormLabel>
					<FormControl>
						<Select
							disabled={disabled}
							onValueChange={(value) => {
								const newValue = isNaN(Number(value)) ? value : Number(value);
								field.onChange(newValue);
							}}
							value={field?.value?.toString() || ''}
						>
							<SelectTrigger
								style={{ backgroundColor: '#F8FAFC', height: 40 }}
								className='w-full border rounded-md px-3 !font-normal'
							>
								<SelectValue
									className='!font-normal'
									placeholder={placeholder}
								/>
							</SelectTrigger>
							<SelectContent className='font-axiforma font-normal max-h-60 overflow-y-auto '>
								{children}
							</SelectContent>
						</Select>
					</FormControl>
					<div className='min-h-[20px] text-red-600'>
						<FormMessage />
					</div>
				</FormItem>
			)}
		/>
	);
};

type DropDownWithInputAndButtonProps = {
	name: string;
	label: string;
	control: any;
	disabled?: boolean;
	button?: React.ReactNode;
	options: { label: string; value: string }[];
	errors?: string;
};

const DropDownWithInputAndButton: React.FC<DropDownWithInputAndButtonProps> = ({
	name,
	label,
	control,
	button,
	options,
}) => {
	const { field } = useController({ name, control });

	const [search, setSearch] = useState('');

	const filteredOptions = options.filter((option) =>
		option.label.toLowerCase().includes(search.toLowerCase())
	);

	return (
		<FormItem>
			{label && <FormLabel>{label}</FormLabel>}
			<FormControl>
				<Select onValueChange={field.onChange} defaultValue={field.value}>
					<SelectTrigger style={{ backgroundColor: '#F8FAFC', height: 40 }}>
						<SelectValue placeholder='Select' />
					</SelectTrigger>
					<SelectContent>
						<div className='p-2'>
							<Input
								type='text'
								placeholder='Search...'
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								className='w-full px-2 py-1 border rounded-md mb-2'
							/>
						</div>
						{filteredOptions.length > 0 ? (
							filteredOptions.map((option) => (
								<SelectItem key={option.value} value={option.value}>
									{option.label}
								</SelectItem>
							))
						) : (
							<div className='p-2 text-gray-500'>No results found</div>
						)}
						{button && <hr className='my-2 border-gray-300' />}
						{button && <div className='p-2 text-center'>{button}</div>}
					</SelectContent>
				</Select>
			</FormControl>
			<FormMessage />
		</FormItem>
	);
};

// CurrencyPicker Component
type CurrencyPickerProps = {
	control: Control<any>;
	disabled?: boolean;
	name?: string;
};

const CurrencyPicker: React.FC<CurrencyPickerProps> = ({
	control,
	disabled,
	name = 'currencyId',
}) => {
	const { currencies, loading } = useCurrencies();
	if (loading) return <p>Loading currencies...</p>;

	return (
		<DropDown
			label='Currency'
			name={name}
			control={control}
			disabled={disabled}
			placeholder='Select Currency'
		>
			{currencies?.map((currency, index) => (
				<SelectItem key={index} value={currency?.id?.toString()}>
					{`${currency.code} ${currency.label}`}
				</SelectItem>
			))}
		</DropDown>
	);
};
type CountryPickerProps = {
	control: Control<any>;
	disabled?: boolean;
	name?: string;
};

const CountryPicker: React.FC<CountryPickerProps> = ({
	control,
	disabled,
	name = 'countryId',
}) => {
	const { countries, loading } = useCountries(); // Assuming useCountries hook to fetch countries

	if (loading) return <p>Loading countries...</p>;

	return (
		<DropDown
			label='Country'
			name={name}
			control={control}
			disabled={disabled}
			placeholder='Select Country'
		>
			{countries.map((country) => (
				<SelectItem key={country.id} value={country.id.toString()}>
					{country.label}
				</SelectItem>
			))}
		</DropDown>
	);
};

type LanguagePickerProps = {
	control: Control<any>;
	disabled?: boolean;
	name?: string;
};

const LanguagePicker: React.FC<LanguagePickerProps> = ({
	control,
	disabled,
	name = 'languageId',
}) => {
	const { languages, loading } = useLanguages(); // Assuming useLanguages hook to fetch languages

	if (loading) return <p>Loading languages...</p>;

	return (
		<DropDown
			label='Language'
			name={name}
			control={control}
			disabled={disabled}
			placeholder='Select Language'
		>
			{languages.map((language) => (
				<SelectItem
					className='font-medium'
					key={language.id}
					value={language.id.toString()}
				>
					{capitalizeFirstLetter(language.label)}
				</SelectItem>
			))}
		</DropDown>
	);
};

export {
	TextField,
	DatePicker,
	DropDown,
	CurrencyPicker,
	CountryPicker,
	LanguagePicker,
	TextArea,
	DropDownWithInputAndButton,
	TextFieldNumberType,
};
