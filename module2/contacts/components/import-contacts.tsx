'use client';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function AddNewContacts() {
	const InvoiceFormSchema = z.object({
		partnerId: z.string().min(1, 'Partner is required'),
		number: z.string().min(1, 'Bill number is required'),
		currency: z.string().optional(),
		items: z
			.array(
				z.object({
					description: z.string().optional(),
					qty: z.number().optional(),
					price: z.number().optional(),
				})
			)
			.optional(),
		subTotal: z.number().optional(),
		grandTotal: z.number().optional(),
	});

	const form = useForm<z.infer<typeof InvoiceFormSchema>>({
		resolver: zodResolver(InvoiceFormSchema),
		defaultValues: {
			partnerId: '',
			number: '',
			currency: 'Euro',
			items: [{ description: '', qty: 0, price: 0 }],
			subTotal: 0,
			grandTotal: 0,
		},
	});

	return (
		<Form {...form}>
			<div className='bg-white p-6 rounded-2xl'>
				<div className='grid grid-cols-2 gap-6 w-full'>
					{/* NAME------- */}
					<FormField
						control={form.control}
						name='partnerId'
						render={({ field }) => (
							<FormItem className='grid grid-cols-3 gap-2 items-center'>
								<FormLabel className='text-black'>Name</FormLabel>
								<FormControl>
									<Input
										placeholder='First Name'
										className='h-[60px] mt-4 w-full'
										{...field}
									/>
								</FormControl>
								<FormControl>
									<Input
										placeholder='Last Name'
										className='h-[60px] mt-4 w-full'
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					{/* TRADE NAME------ */}
					<FormField
						control={form.control}
						name='number'
						render={({ field }) => (
							<FormItem className='grid grid-cols-3 gap-2 items-center'>
								<FormLabel className='col-span-1 text-black'>
									Trade Name
								</FormLabel>
								<FormControl className='col-span-2'>
									<Input
										placeholder=''
										className='h-[60px] mt-4 w-full'
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					{/* PHONE------ */}
					<FormField
						control={form.control}
						name='partnerId'
						render={({ field }) => (
							<FormItem className='grid grid-cols-3 gap-2 items-center'>
								<FormLabel className='text-black'>Phone</FormLabel>
								<FormControl>
									<Input
										placeholder='Work Phone'
										className='h-[60px] mt-4 w-full'
										{...field}
									/>
								</FormControl>
								<FormControl>
									<Input
										placeholder='Mobile Phone'
										className='h-[60px] mt-4 w-full'
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					{/* VAT IDENTIFICATION */}
					<FormField
						control={form.control}
						name='number'
						render={({ field }) => (
							<FormItem className='grid grid-cols-3 gap-2 items-center'>
								<FormLabel className='col-span-1 text-black'>
									VAT Identification
								</FormLabel>
								<FormControl className='col-span-2'>
									<Input
										placeholder=''
										className='h-[60px] mt-4 w-full'
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					{/* EMAIL-----*/}
					<FormField
						control={form.control}
						name='number'
						render={({ field }) => (
							<FormItem className='grid grid-cols-3 gap-2 items-center'>
								<FormLabel className='col-span-1 text-black'>
									Email Address
								</FormLabel>
								<FormControl className='col-span-2'>
									<Input
										placeholder='ex:@email.com'
										className='h-[60px] mt-4 w-full'
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					{/* ASSIGN USERS----- */}
					<FormField
						control={form.control}
						name='number'
						render={({ field }) => (
							<FormItem className='grid grid-cols-3 gap-2 items-center'>
								<FormLabel className='col-span-1 text-black'>
									Assign users
								</FormLabel>
								<FormControl className='col-span-2'>
									<Input
										placeholder=''
										className='h-[60px] mt-4 w-full'
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					{/* ADDRESS---- */}
					<FormField
						control={form.control}
						name='number'
						render={({ field }) => (
							<FormItem className='grid grid-cols-3 gap-2 items-center'>
								<FormLabel className='col-span-1 text-black'>Address</FormLabel>
								<FormControl className='col-span-2'>
									<Input
										placeholder='xyz'
										className='h-[60px] mt-4 w-full'
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					{/* WEBSITE */}
					<FormField
						control={form.control}
						name='number'
						render={({ field }) => (
							<FormItem className='grid grid-cols-3 gap-2 items-center'>
								<FormLabel className='col-span-1 text-black'>
									VAT Identification
								</FormLabel>
								<FormControl className='col-span-2'>
									<Input
										placeholder=''
										className='h-[60px] mt-4 w-full'
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<div className='grid grid-cols-1 gap-6'>
						{/* PROVINCE--- */}
						<FormField
							control={form.control}
							name='number'
							render={({ field }) => (
								<FormItem className='grid grid-cols-3 gap-2 items-center'>
									<FormLabel className='col-span-1 text-black'>
										Province
									</FormLabel>
									<FormControl className='col-span-2'>
										<Input
											placeholder=''
											className='h-[60px] mt-4 w-full'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						{/* COUNTRY--- */}
						<FormField
							control={form.control}
							name='number'
							render={({ field }) => (
								<FormItem className='grid grid-cols-3 gap-2 items-center'>
									<FormLabel className='col-span-1 text-black'>
										Country
									</FormLabel>
									<FormControl className='col-span-2'>
										<Input
											placeholder='select'
											className='h-[60px] mt-4 w-full'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
				</div>
				<div className='flex justify-center mt-3'>
					<Button
						type='submit'
						className='mt-6 bg-[#4880ff] text-white 
        p-6 rounded-md border'
					>
						Add Contacts
					</Button>
				</div>
			</div>
		</Form>
	);
}
