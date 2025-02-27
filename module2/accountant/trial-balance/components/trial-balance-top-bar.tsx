'use client';
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
import ExportIcon from '@/components/icon-components/export-icon';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
interface JournalEntriesTopBarProps {
	searchTerm: string;
	setSearchTerm: (value: string) => void;
}

export default function TrialBalanceTopBar({
	searchTerm,
	setSearchTerm,
}: JournalEntriesTopBarProps) {
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
				<Select>
					<SelectTrigger className=' flex gap-2 items-center '>
						{/* <div className='flex items-center gap-2'> */}
						<CalendarIcon /> <SelectValue placeholder={'Jan 01 -Jan 31,2025'} />
						{/* </div> */}
					</SelectTrigger>
					<SelectContent className='text-[#0F172A] text-sm'>
						<SelectItem value='December'>Dec 01 -Dec 31,2024</SelectItem>
						<SelectItem value='February'>Feb 01 -Feb 28,2025</SelectItem>
						<SelectItem value='March'>Mar 01 -Mar 31,2025</SelectItem>
					</SelectContent>
				</Select>
				<div className='bg-[#f8fafc] p-2 h-[40px] rounded-md border'>
					<ExportIcon />
				</div>
			</div>
		</div>
	);
}
