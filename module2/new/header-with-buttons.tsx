'use client';
import DownloadExcelIcon from './icon-components/download-excel';
import DownloadPdfIcon from './icon-components/download-pdf';
import ImportIcon from './icon-components/import-icon';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';
interface HeaderProps {
	title?: string;
	selectText?: string;
	buttonText?: string;
	buttonLink?: string;
	button2Text?: string;
	button2Link?: string;
	setStateFunction?: (value: boolean) => void;
}

export default function HeaderWithButtons({
	title,
	selectText,
	buttonText,
	buttonLink,
	button2Text,
	button2Link,
	setStateFunction,
}: HeaderProps) {
	return (
		<div className='flex justify-between items-center'>
			<p className='text-3xl font-semibold'>{title}</p>
			<div className='flex gap-4 items-center font-semibold'>
				{selectText && (
					<Select>
						<SelectTrigger className='w-[280px] xl:w-[196px]'>
							<SelectValue placeholder={selectText} />
						</SelectTrigger>
						<SelectContent className='text-[#0F172A] text-sm'>
							<div className='flex gap-2 items-center hover:bg-[#d1dbfa] p-2 cursor-pointer'>
								<span>
									<DownloadExcelIcon />{' '}
								</span>{' '}
								<span>Download Excel File</span>
							</div>
							<div className='flex gap-2 items-center hover:bg-[#d1dbfa] p-2 cursor-pointer'>
								<span>
									<DownloadPdfIcon />{' '}
								</span>{' '}
								<span>Download PDF</span>
							</div>
							{/* <SelectItem
								value='EXCEL'
								className='flex gap-2 items-center !w-full'
							>
								<span>
									<DownloadExcelIcon />{' '}
								</span>{' '}
								<span>Download Excel File</span>
							</SelectItem>
							<SelectItem
								value='PDF'
								className='flex gap-2 items-center !w-full'
							>
								<span>
									<DownloadPdfIcon />{' '}
								</span>{' '}
								Download PDF
							</SelectItem> */}
						</SelectContent>
					</Select>
				)}

				{buttonText && (
					<button className='bg-[#ffffff] text-[#475569] px-4 text-sm border-2 border-[#e2e8f0] flex gap-2 items-center rounded-md py-2'>
						<ImportIcon />
						{buttonText}
					</button>
				)}

				<button
					className='bg-[#2354e6] text-white px-4 text-sm border-[#2354e6] rounded-md py-2'
					onClick={() => setStateFunction?.(true)}
				>
					{button2Text}
				</button>
			</div>
		</div>
	);
}
