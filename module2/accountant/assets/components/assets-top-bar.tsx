'use client';
import { Input } from '@/components/ui/input';
import { SearchIcon } from 'lucide-react';
interface AssetsTopBarProps {
	activeTab: string;
	searchTerms: { [key: string]: string }; // Adjust the type if necessary
	handleSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function AssetsTopBar({
	activeTab,
	searchTerms,
	handleSearchChange,
}: AssetsTopBarProps) {
	return (
		<div
			className={`grid gap-4 items-center 
           				 ${activeTab === 'invoices' ? 'grid-cols-2' : 'grid-cols-1'} 
           				 `}
		>
			<div className='relative'>
				<span className='absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400'>
					<SearchIcon />
				</span>
				<Input
					className='pl-10 h-[40px] bg-white text-[#64748b] w-[320px] xl:w-full rounded-md border border-gray-300 focus:border-[#4880FF] focus:outline-none text-base'
					placeholder='Search'
					value={searchTerms[activeTab]}
					onChange={handleSearchChange}
				/>
			</div>
		</div>
	);
}
