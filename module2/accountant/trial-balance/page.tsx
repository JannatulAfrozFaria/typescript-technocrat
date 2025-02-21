'use client';
import EmptyPage from '@/components/empty-page';
import SalesHomeImage from '@/components/icon-components/sales-home-image';

export default function TrialBalancePage() {
	return (
		//TODO: change data------
		<EmptyPage
			heading='No sales yet!'
			subtitle='Start driving growth by creating your first sale and tracking
								your progress with ease.'
			buttonText='+ New invoice'
			buttonLink='/sales/new-invoice'
			SvgComponent={SalesHomeImage}
		/>
	);
}
