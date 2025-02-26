import { Button } from '@/components/ui/button';

type ContactPaginationProps = {
	handlePageChange: (direction: 'next' | 'previous') => void;
	isPending: boolean;
	canGoToPreviousPage: () => boolean;
	canGoToNextPage: () => boolean;
	currentPageNumber: number;
	totalPages: number;
};

export default function ContactPagination({
	handlePageChange,
	isPending,
	canGoToPreviousPage,
	canGoToNextPage,
	currentPageNumber,
	totalPages,
}: ContactPaginationProps) {
	return (
		<div className='flex items-center justify-between my-6'>
			<div>
				<Button
					onClick={() => handlePageChange('previous')}
					disabled={isPending || !canGoToPreviousPage()}
					className='bg-white font-semibold border-2 p-2 text-sm'
				>
					Previous
				</Button>
			</div>
			<div>
				<p>
					Page {currentPageNumber + 1} of {totalPages}
				</p>
			</div>
			<div>
				<Button
					onClick={() => handlePageChange('next')}
					disabled={isPending || !canGoToNextPage()}
					className='bg-white font-semibold border-2 p-2 text-sm'
				>
					Next
				</Button>
			</div>
		</div>
	);
}
