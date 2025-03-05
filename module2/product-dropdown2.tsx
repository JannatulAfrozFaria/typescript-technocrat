import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';

import { listProductsByCompanyId } from '@/actions/product.action';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { type Control } from 'react-hook-form';
import { TextField } from '@/components/form-elements';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { IoCart } from 'react-icons/io5';
import ProductAvatar from '@/components/images/Avatars.png';
import Image from 'next/image';
type FormControlProps = {
	name: string;
	control: Control<any>;
	companyId: string;
	setShowModal: Dispatch<SetStateAction<boolean>>;
	onProductSelect: (product: any) => void;
	setValue: (name: string, value: string) => void;
};

export default function ProductDropDown({
	name,
	control,
	companyId,
	setShowModal,
	onProductSelect,
	setValue,
}: FormControlProps) {
	const [products, setProducts] = useState<
		{ label: string; value: string; imageUrl?: string }[]
	>([]);
	const [product, setProduct] = useState<string>('');
	const [open, setOpen] = useState(false);
	const [search, setSearch] = useState('');
	const [isTextField, setIsTextField] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	// const name = 'product';

	useEffect(() => {
		const fetchProducts = async () => {
			try {
				setLoading(true);
				const response = await listProductsByCompanyId(companyId, false);
				// console.log(response);
				if ('message' in response) {
					// ErrorResponse handling
					throw new Error(response.message);
				}
				// Map the API response to dropdown options
				const productOptions = response.map((product) => ({
					label: product.name,
					value: product.name,
					// ...product,
					imageUrl: product?.imageUrl as string | undefined,
				}));
				setProducts(productOptions);
			} catch (err: any) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		fetchProducts();
	}, [companyId, open]);

	const filteredOptions = products.filter((option) =>
		option.label.toLowerCase().includes(search.toLowerCase())
	);

	return isTextField ? (
		<div className='flex justify-between'>
			<TextField control={control} name={name} disabled={true} />
			<div>
				<button
					type='button'
					onClick={() => {
						setProduct('');
						setIsTextField(false);
						setValue(name, '');
						setOpen(false); // Close dropdown
					}}
					className='px-3 py-2 bg-[#fcebe8] text-sm text-red-600 rounded-md h-[40px] w-[40px]'
				>
					-
				</button>
			</div>
		</div>
	) : (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem>
					<FormControl>
						<Select
							open={open}
							onOpenChange={setOpen}
							onValueChange={(value) => {
								field.onChange(value);

								const selectedProduct = products.find(
									(option) => option.value === value
								);
								if (selectedProduct) {
									onProductSelect(selectedProduct);
								}
							}}
							value={field.value}
						>
							<SelectTrigger
								onClick={() => setOpen(!open)}
								style={{ backgroundColor: '#F8FAFC', height: 40 }}
							>
								<SelectValue placeholder='Select' />
							</SelectTrigger>

							<SelectContent>
								<div className='p-2'>
									<Input
										type='text'
										placeholder='Search...'
										value={search}
										onChange={(e) => {
											setSearch(e.target.value);
											setTimeout(() => e.target.focus(), 0);
										}}
										className='w-full px-2 py-1 border rounded-md mb-2'
									/>
								</div>
								{filteredOptions.length > 0 ? (
									filteredOptions.map((option) => (
										<SelectItem
											key={option.value}
											value={option.value}
											className='!font-normal'
										>
											<div className='flex items-center gap-2'>
												<Avatar className='w-7 h-7 flex items-center justify-center'>
													<AvatarImage
														src={option.imageUrl || undefined}
														alt={option.label || undefined}
													/>
													<AvatarFallback className='] text-sm'>
														<Image src={ProductAvatar} alt='avatar' />
													</AvatarFallback>
												</Avatar>
												<span>{option.label}</span>
											</div>
										</SelectItem>
									))
								) : (
									<div className='p-2 text-gray-500'>No results found</div>
								)}

								<hr className='my-2 border-gray-300' />
								<div className='p-2 flex'>
									<Input
										type='text'
										placeholder='Or type in a product...'
										onChange={(e) => {
											setProduct(e.target.value);
											setOpen(true);
											setTimeout(() => e.target.focus(), 0);
										}}
										className='w-full px-2 py-1 border rounded-md'
									/>
									<div>
										<button
											type='button'
											onClick={() => {
												setIsTextField(true);
												setValue(name, product);
												setOpen(false);
											}}
											className='px-3 py-2 bg-[#E8EDFC] text-sm text-[#2354E6] rounded-md w-full ml-1'
										>
											+
										</button>
									</div>
								</div>

								<hr className='my-2 border-gray-300' />

								<div className='p-2 text-center'>
									<button
										type='button'
										onClick={() => {
											setOpen(false);
											setShowModal(true);
										}}
										className='px-3 py-2 bg-[#E8EDFC] text-sm text-[#2354E6] rounded-md w-full'
									>
										+ Add new product
									</button>
								</div>
							</SelectContent>
						</Select>
						{/* <Select
							open={open}
							onOpenChange={setOpen}
							onValueChange={(value) => {
								setValue(name, value); 
								setProduct(value); 
								const selectedProduct = products.find((p) => p.value === value);
								if (selectedProduct) {
									onProductSelect(selectedProduct); 
								}
								setOpen(false);
							}}
							value={product} 
						>
							<SelectTrigger className='bg-[#F8FAFC] h-10 !font-normal !text-[#64748B]'>
								<SelectValue placeholder='Select Product' />
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
										<SelectItem
											key={option.value}
											value={option.value}
											className='!font-normal'
										>
											<div className='flex items-center gap-2'>
												<Avatar className='w-7 h-7 flex items-center justify-center'>
													<AvatarImage
														src={option.imageUrl || undefined}
														alt={option.label || undefined}
													/>
													<AvatarFallback className='] text-sm'>
														<Image src={ProductAvatar} alt='avatar' />
													</AvatarFallback>
												</Avatar>
												<span>{option.label}</span>
											</div>
										</SelectItem>
									))
								) : (
									<div className='p-2 text-gray-500'>No results found</div>
								)}
							</SelectContent>
						</Select> */}
					</FormControl>
					<div className='min-h-[20px] text-red-600'>
						<FormMessage />
					</div>
				</FormItem>
			)}
		/>
	);
}
