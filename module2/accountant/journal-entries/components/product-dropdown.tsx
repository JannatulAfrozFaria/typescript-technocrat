import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import ThreeDotIcon from '@/components/icon-components/three-dot-icon';

interface DropdownProps {
	invoiceId: string;
	openDropdownId: string | null;
	onToggleDropdown: (invoiceId: string) => void;
	onDeleteClick: (invoiceId: string) => void;
}

const ProductDropdown = ({
	invoiceId,
	openDropdownId,
	onToggleDropdown,
	onDeleteClick,
}: DropdownProps) => {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button onClick={() => onToggleDropdown(invoiceId)}>
					<ThreeDotIcon />
				</button>
			</DropdownMenuTrigger>
			{openDropdownId === invoiceId && (
				<DropdownMenuContent
					align='end'
					className='w-40 shadow-md border rounded-md'
				>
					<DropdownMenuItem className='cursor-pointer hover:bg-gray-100'>
						View
					</DropdownMenuItem>
					<DropdownMenuItem className='cursor-pointer hover:bg-gray-100'>
						Edit
					</DropdownMenuItem>
					<DropdownMenuItem
						className='cursor-pointer hover:bg-gray-100'
						onClick={() => onDeleteClick(invoiceId)}
					>
						Delete
					</DropdownMenuItem>
				</DropdownMenuContent>
			)}
		</DropdownMenu>
	);
};

export default ProductDropdown;
