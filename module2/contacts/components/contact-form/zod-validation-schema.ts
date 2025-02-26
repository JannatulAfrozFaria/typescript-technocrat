import { z } from 'zod';

export const AddressSchema = z.object({
	addressLine1: z.string().min(1,  'Address Line 1 is required' ),
	addressLine2: z.string().nullish(),
	province: z.string().nullish(),
	city: z.string().min(1,  'City is required' ),
	postalCode: z
		.number()
		.min(5,  'Postal code must be at least 5 characters' )
		.nullish(),
	countryId: z.string().min(1,  'Country is required' ),
});

export const ContactSchema = z.object({
	id: z.string().nullish(),
	name: z.string().min(1, 'Name is required'),
	email: z
		.string()
		.min(1, 'Email address is required')
		.email('Invalid email address'),
	phoneNumber: z
		.string()
		.regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format')
		.nullish(),
	vatNumber: z.string().nullish(),
	website: z.string().url('Invalid URL format').nullish(),
	nif: z.number().nullish(),
	discountPercentage: z
		.number()
		.nullish()
		.refine(
			(value) => !value || (value >= 0 && value <= 100),
			'Discount must be between 0 and 100 if provided'
		),
	dueDateInDays: z.number().nullish(),
	note: z.string().nullish(),
	type: z.enum(['CUSTOMER', 'VENDOR', 'CUSTOMER_AND_VENDOR'], {
		required_error: 'Contact Type is required',
		// errorMap: () => {
		// 	return {
		//  'Contact Type is required',
		// 	};
		// },
	}),
	entity: z.enum(['INDIVIDUAL', 'BUSINESS', 'BUSINESS_AND_INDIVIDUAL'], {
		required_error: 'Entity Type is required',
		// errorMap: () => {
		// 	return {
		//  'Entity Type is required',
		// 	};
		// },
	}),

	languageId: z.string().min(1, 'Language is required'),
	currencyId: z.string().min(1, 'Currency is required'),

	address: AddressSchema,
});
