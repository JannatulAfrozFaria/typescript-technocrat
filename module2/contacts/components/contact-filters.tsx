import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import DocumentIcon from '@/components/icon-components/document-icon';
import SearchIcon from '@/components/icon-components/search-icon';
import type { ContactEntity, ContactType } from '@/types/prisma-types';
import type { Dispatch, SetStateAction } from 'react';
import type { DebouncedState } from 'use-debounce';

type ContactFiltersProps = {
	contactFilter: {
		partialName?: string;
		entity?: ContactEntity;
		type?: ContactType;
	};
	setContactFilter: (
		value: SetStateAction<{
			partialName?: string;
			entity?: ContactEntity;
			type?: ContactType;
		}>
	) => void;
	contactPartialNameSearchInput: string;
	setContactPartialNameSearchInput: Dispatch<SetStateAction<string>>;
	handleDebouncedContactPartialNameFilter: DebouncedState<(value: any) => void>;
};

export default function ContactFilters({
	contactFilter,
	setContactFilter,
	contactPartialNameSearchInput,
	setContactPartialNameSearchInput,
	handleDebouncedContactPartialNameFilter,
}: ContactFiltersProps) {
	return (
		<div className='flex flex-col xl:flex-row justify-between items-center xl:items-end gap-6 xl:gap-0 p-4 border-2 rounded-xl my-6'>
			{/* ENTITY ----TYPE ---CONTACT ---TYPE*/}
			<div className='flex gap-4 items-center'>
				<div>
					<h1 className='font-medium text-sm mb-1'>Contact Type</h1>
					<Select
						value={contactFilter.type || 'null'}
						onValueChange={(value) =>
							value === 'null'
								? setContactFilter((prev) => ({
										...prev,
										type: undefined,
									}))
								: setContactFilter((prev) => ({
										...prev,
										type: value as ContactType,
									}))
						}
					>
						<SelectTrigger className='w-[280px] xl:w-[196px]'>
							<SelectValue placeholder='All' />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='null'>All</SelectItem>
							<SelectItem value='CUSTOMER'>Customer</SelectItem>
							<SelectItem value='VENDOR'>Vendor</SelectItem>
							<SelectItem value='CUSTOMER_AND_VENDOR'>
								Customer/Vendor
							</SelectItem>
						</SelectContent>
					</Select>
				</div>
				<div>
					<h1 className='font-medium text-sm mb-1'>Entity Type</h1>
					<Select
						value={contactFilter.entity || 'null'}
						onValueChange={(value) =>
							value === 'null'
								? setContactFilter((prev) => ({
										...prev,
										entity: undefined,
									}))
								: setContactFilter((prev) => ({
										...prev,
										entity: value as ContactEntity,
									}))
						}
					>
						<SelectTrigger className='w-[280px] xl:w-[196px]'>
							<SelectValue placeholder='All' />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='null'>All</SelectItem>
							<SelectItem value='BUSINESS'>Business</SelectItem>
							<SelectItem value='INDIVIDUAL'>Individual</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>
			{/* SEARCH */}
			<div className='flex gap-4 items-center'>
				<div className='relative'>
					<span className='absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400'>
						<SearchIcon />
					</span>
					<Input
						className='pl-10 h-[40px] bg-white text-[#64748b] w-[320px] xl:w-full rounded-md border border-gray-300 focus:border-[#4880FF] focus:outline-none text-base'
						placeholder='Search'
						value={contactPartialNameSearchInput}
						onChange={({ target: { value } }) => {
							setContactPartialNameSearchInput(value);
							handleDebouncedContactPartialNameFilter(value);
						}}
					/>
				</div>
				<div className='border-2 p-2 rounded-md cursor-pointer'>
					<DocumentIcon />
				</div>
			</div>
		</div>
	);
}
