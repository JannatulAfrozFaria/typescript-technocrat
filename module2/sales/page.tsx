'use client';

import SalesHomeImage from '@/components/icon-components/SalesHomeImage';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function SalesPage() {
	return (
		<main className=' min-h-screen  bg-[#f8fafc]'>
			<div className='flex flex-col gap-6 w-full  mx-auto p-12'>
				<div className='px-12 py-40'>
					<div className='flex flex-col xl:flex-row gap-12 xl:gap-8 justify-start items-start xl:items-center bg-[#ffffff]  py-48 px-12 rounded-3xl'>
						<div className='w-4/5 xl:w-1/2'>
							<h1 className='text-xl xl:text-4xl font-semibold'>
								No sales yet!
							</h1>
							<p className='mt-2  mb-6 text-base'>
								Start driving growth by creating your first sale and tracking
								your progress with ease.
							</p>
							<Button className='bg-[#2354e6] text-white px-8 text-lg xl:text-xl'>
								{' '}
								<Link href={'/sales/overview'}> + New invoice</Link>
							</Button>
						</div>
						<div className='w-5/6 xl:w-1/2'>
							<SalesHomeImage />
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}
