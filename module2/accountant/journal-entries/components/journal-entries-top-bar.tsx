'use client';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { SearchIcon } from 'lucide-react';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import CalendarIcon from '@/components/icon-components/calendar-icon';
import DownArrowIcon from '@/components/icon-components/down-arrow-icon';
import React from 'react';

interface JournalEntriesTopBarProps {
	searchTerm: string;
	setSearchTerm: (value: string) => void;
	filters: {
		type?: string;
	};
	setFilters: (filters: { type?: string }) => void;
}

export default function JournalEntriesTopBar({
	searchTerm,
	setSearchTerm,
	filters,
	setFilters,
}: JournalEntriesTopBarProps) {
	const handleTypeChange = (value: string) => {
		setFilters({
			...filters,
			type: value === 'ALL' ? undefined : value,
		});
	};

	return (
		<div className='flex justify-between items-center p-4 border-2 border-[#e2e8f0] rounded-xl'>
			<div className='relative'>
				<span className='absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400'>
					<SearchIcon />
				</span>
				<Input
					className='pl-10 h-[40px] bg-white text-[#64748b] w-[320px] xl:w-full rounded-md border border-gray-300 focus:border-[#4880FF] focus:outline-none text-base'
					placeholder='Search'
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
			</div>
			<div className='flex gap-4 items-center'>
				<div>
					<Select
						value={filters.type || 'ALL'}
						onValueChange={handleTypeChange}
					>
						<SelectTrigger className='flex gap-2 items-center justify-start'>
							<span className='text-[#475569] text-sm font-medium'>
								Account type:{' '}
							</span>
							<SelectValue placeholder='All' />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='ALL'>All</SelectItem>
							<SelectItem value='Assets'>Assets</SelectItem>
							<SelectItem value='Liabilities'>Liabilities</SelectItem>
							<SelectItem value='Equities'>Equities</SelectItem>
							<SelectItem value='Revenues'>Revenues</SelectItem>
							<SelectItem value='Expenses'>Expenses</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<Select>
					<SelectTrigger className=' flex gap-2 items-center '>
						<CalendarIcon /> <SelectValue placeholder={'Jan 01 -Jan 31,2025'} />
					</SelectTrigger>
					<SelectContent className='text-[#0F172A] text-sm'>
						<SelectItem value='December'>Dec 01 -Dec 31,2024</SelectItem>
						<SelectItem value='February'>Feb 01 -Feb 28,2025</SelectItem>
						<SelectItem value='March'>Mar 01 -Mar 31,2025</SelectItem>
					</SelectContent>
				</Select>
			</div>
		</div>
	);
}
