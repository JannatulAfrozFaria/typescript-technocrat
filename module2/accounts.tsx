import Card from '@/components/Cards/card';
import React, {
	useEffect,
	useState,
	type Dispatch,
	type SetStateAction,
} from 'react';
import { toast } from 'sonner';
import { useSearchParams } from 'next/navigation';
import { getTransactions } from '@/actions/gocardless.actions';
import {
	listBankAccountsByCompanyId,
	deleteBankAccount,
} from '@/actions/bank.action';
import { type BankAccount } from '@/types/prisma-types';
import AddAccModal from './add-acc-modal';
import DeleteAccountModal from './delete-acc-modal';

export default function Accounts({
	setTransactions,
	setLoadingTransactions,
}: {
	setTransactions: Dispatch<SetStateAction<any>>; // TODO: create transaction schema
	setLoadingTransactions: Dispatch<SetStateAction<boolean>>;
}) {
	const companyId = '679243216bff8182ca775264'; // TODO: replace this
	const searchParams = useSearchParams();
	const reference = searchParams.get('ref');
	const [accounts, setAccounts] = useState<BankAccount[]>([]);
	const [isOpen, setShowModal] = useState(Boolean(reference));
	const [selectedAccountId, setSelectedAccountId] = useState<string | null>(
		null
	);
	//state for DELETE----
	const [isDeleteOpen, setShowDeleteModal] = useState(false);
	const [accountToDelete, setAccountToDelete] = useState<string | null>(null);

	async function handleTransactions(account: any) {
		setSelectedAccountId(account.id); // highlight the selected one
		setLoadingTransactions(true);
		const response = await getTransactions(account.accountId);
		if (response.error) {
			console.error('Transactions:', response);
			setLoadingTransactions(false);
			return;
		}
		console.log('Transactions:', response);
		setTransactions(response.transactions);
		setLoadingTransactions(false);
	}
	// async function handleDelete(accountId: string) {
	// 	try {
	// 		if (!confirm('Are you sure you want to delete this account?')) return;

	// 		const response = await deleteBankAccount(accountId);
	// 		console.log('Delete response:', response);

	// 		setAccounts((prev) => prev.filter((acc) => acc.id !== accountId));

	// 		if (selectedAccountId === accountId) {
	// 			setSelectedAccountId(null);
	// 			setTransactions([]);
	// 		}

	// 		toast.success('Account deleted successfully.');
	// 	} catch (error) {
	// 		console.error('Delete error:', error);
	// 		toast.error('An unexpected error occurred while deleting.');
	// 	}
	// }
	// Update the handleDelete function
	async function handleDelete() {
		try {
			if (!accountToDelete) return;

			const response = await deleteBankAccount(accountToDelete);
			console.log('Delete response:', response);

			setAccounts((prev) => prev.filter((acc) => acc.id !== accountToDelete));

			if (selectedAccountId === accountToDelete) {
				setSelectedAccountId(null);
				setTransactions([]);
			}

			toast.success('Account deleted successfully.');
		} catch (error) {
			console.error('Delete error:', error);
			toast.error('An unexpected error occurred while deleting.');
		} finally {
			setShowDeleteModal(false);
			setAccountToDelete(null);
		}
	}

	// Update the delete button click handler
	const handleDeleteClick = (accountId: string) => {
		setAccountToDelete(accountId);
		setShowDeleteModal(true);
	};

	useEffect(() => {
		if (isOpen) return;
		const getAccounts = async () => {
			const accounts = await listBankAccountsByCompanyId(companyId);
			console.log('Accounts:', accounts);

			// Type guard to check if accounts is ErrorResponse
			if ('data' in accounts && Array.isArray(accounts.data)) {
				if (accounts.data.length > 0) {
					setAccounts(accounts.data);
				}
			} else {
				console.error('Failed to fetch accounts:', accounts);
			}
		};

		getAccounts();
	}, [isOpen]);

	return (
		<Card className='max-w-[500px] border-2 border-[#e2e8f0] shadow-none bg-[#ffffff]'>
			<h1 className='text-lg font-bold mb-4 text-[#334155] '>Accounts</h1>
			{accounts?.length === 0 && (
				<p className='text-sm text-gray-500'>
					No accounts found. Add new account to get started
				</p>
			)}
			{/* {accounts?.map((account, i) => (
				<div
					key={account.id}
					className={`flex justify-between  items-center mb-4 p-2 rounded ${
						selectedAccountId === account.id
							? 'bg-[#E8EDFC] border border-[#2354E6]'
							: ''
					}`}
				>
					<div>
						<p className='text-[#334155]'>
							{i + 1}. {account.iban}
						</p>
					</div>
					<div className='flex gap-4 items-center'>
						<button
							className='text-sm text-[#2354E6] hover:font-semibold'
							onClick={() => handleTransactions(account)}
						>
							Select
						</button>
						<button
							className='text-sm text-red-400 hover:font-semibold'
							onClick={() => handleDelete(account.id)}
						>
							Delete
						</button>
					</div>
				</div>
			))} */}
			{accounts?.map((account, i) => (
				<div
					key={account.id}
					className={`flex justify-between  items-center mb-4 p-2 rounded ${
						selectedAccountId === account.id
							? 'bg-[#E8EDFC] border border-[#2354E6]'
							: ''
					}`}
				>
					<div>
						<p className='text-[#334155]'>
							{i + 1}. {account.iban}
						</p>
					</div>
					<div className='flex gap-4 items-center'>
						<button
							className='text-sm text-[#2354E6] hover:font-semibold'
							onClick={() => handleTransactions(account)}
						>
							Select
						</button>
						<button
							className='text-sm text-red-400 hover:font-semibold'
							onClick={() => handleDeleteClick(account.id)}
						>
							Delete
						</button>
					</div>
				</div>
			))}
			{/* Add the new modal */}
			<DeleteAccountModal
				isOpen={isDeleteOpen}
				setShowModal={setShowDeleteModal}
				onConfirm={handleDelete}
			/>
			<br />
			<button
				onClick={() => {
					setShowModal(true); // Open modal
				}}
				className='px-3 py-2 bg-[#E8EDFC] text-sm text-[#2354E6] rounded-md w-full'
			>
				Add new Account
			</button>
			<AddAccModal
				isOpen={isOpen}
				setShowModal={setShowModal}
				reference={reference}
			/>
		</Card>
	);
}
git merge --abort