import { Controller } from 'react-hook-form';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import {
	FormControl,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';

interface PhoneNumberInputProps {
	control: any;
	name: string;
	label?: string;
	placeholder?: string;
	defaultCountry?: string;
	preferredCountries?: string[];
}

export default function PhoneNumberInput({
	control,
	name,
	label = 'Phone Number',
	placeholder = 'Enter phone number',
	defaultCountry = 'es',
	preferredCountries = ['es', 'us'],
}: PhoneNumberInputProps) {
	return (
		<Controller
			name={name}
			control={control}
			render={({ field, fieldState }) => (
				<FormItem>
					{label && <FormLabel>{label}</FormLabel>}
					<FormControl>
						<PhoneInput
							defaultCountry={defaultCountry}
							preferredCountries={preferredCountries}
							className='border rounded-md !items-center'
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
									style: { boxShadow: 'none' },
									className:
										'!w-[346px] border !px-1 !overflow-y-auto scrollbar-none',
									listItemClassName: '!py-1 !hover:bg-red-100',
								},
							}}
							placeholder={placeholder}
							value={field.value as string | undefined}
							onChange={(phoneNumber, { country }) => {
								// set phone number value to undefined if "+" + country.dialCode is equals to phoneNumber

								if (phoneNumber === `+${country.dialCode}`) {
									field.onChange(undefined);
								} else field.onChange(phoneNumber);
							}}
							forceDialCode={true}
						/>
					</FormControl>
					<FormMessage>{fieldState?.error?.message}</FormMessage>
				</FormItem>
			)}
		/>
	);
}
