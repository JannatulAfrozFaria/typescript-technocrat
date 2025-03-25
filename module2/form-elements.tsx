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
import { twMerge } from 'tailwind-merge';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';

import CalendarIcon from './icon-components/calendar-icon';
import { useRef } from 'react';
// Types for TextField, DatePicker, and DropDown props
type FormControlProps = React.InputHTMLAttributes<HTMLInputElement> & {
	name: string;
	label?: string;
	placeholder?: string;
	type?: HTMLInputTypeAttribute;
	control: Control<any>;
	disabled?: boolean;
	variant?: 'light' | 'dark';
};

type DropDownProps = {
	name: string;
	label?: string;
	control: any;
	disabled?: boolean;
	children: React.ReactNode;
	placeholder?: string;
	selectContentClassName?: string;
	defaultValue?: string;
};
// DropDown Component
const DropDown: React.FC<DropDownProps> = ({
	name,
	label,
	control,
	disabled,
	children,
	placeholder,
	selectContentClassName = '',
	defaultValue = '',
}) => {
	return (
		<FormField
			control={control}
			name={name}
			render={({ field }: { field: any }) => (
				<FormItem>
					{label && <FormLabel className='font-axiforma'>{label}</FormLabel>}
					<FormControl>
						<Select
							disabled={disabled}
							onValueChange={(value) => {
								const newValue = isNaN(Number(value)) ? value : Number(value);
								field.onChange(newValue);
							}}
							// ✅ Set default value
							value={field?.value?.toString() || defaultValue}
						>
							<SelectTrigger
								style={{ backgroundColor: '#F8FAFC', height: 40 }}
								className={`w-full border rounded-md px-3 !font-normal !text-[#64748B] ${
									field.value ? ' !text-black' : ''
								} data-[state=open]:font-semibold data-[state=open]:text-black`}
							>
								<SelectValue placeholder={placeholder} />
							</SelectTrigger>
							<SelectContent
								className={twMerge(
									'font-axiforma font-normal max-h-60 overflow-y-auto',
									selectContentClassName
								)}
							>
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



type CountryPickerProps = {
	control: Control<any>;
	disabled?: boolean;
	name?: string;
};

const CountryPicker: React.FC<CountryPickerProps> = ({
	control,
	disabled,
	name = 'address.countryId',
}) => {
	const { countries, loading } = useCountries();

	if (loading) return <p>Loading countries...</p>;

	const defaultCountry = countries.find((country) => country.label === 'Spain');

	return (
		<DropDown
			label='Country'
			name={name}
			control={control}
			disabled={disabled}
			placeholder='Select Country'
			defaultValue={defaultCountry?.id.toString()} // ✅ Set default value
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
	defaultValue?: string;
};

const LanguagePicker: React.FC<LanguagePickerProps> = ({
	control,
	disabled,
	name = 'languageId',
	defaultValue = '',
}) => {
	const { languages, loading } = useLanguages();

	if (loading) return <p>Loading languages...</p>;

	const defaultLanguage = languages.find(
		(language) => language.label === 'Spanish'
	);

	return (
		<DropDown
			label='Language'
			name={name}
			control={control}
			disabled={disabled}
			placeholder='Select Language'
			defaultValue={defaultLanguage?.id.toString()} // ✅ Set default value
		>
			{languages.map((language) => (
				<SelectItem key={language.id} value={language.id.toString()}>
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
	PhoneNumberInput,
};
