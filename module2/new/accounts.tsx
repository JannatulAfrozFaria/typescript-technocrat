import Card from '@/components/Cards/card';
import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import { toast } from 'sonner';
import { useSearchParams } from 'next/navigation';
import { getTransactions } from '@/actions/gocardless.actions';
import {
	listBankAccountsByCompanyId,
	deleteBankAccount,
} from '@/actions/bank.action';
import { type BankAccount } from '@/types/prisma-types';
import DeleteAccountModal from './delete-account-modal';
import Image from 'next/image';
import AddAccountModal from './add-account-modal';

export default function Accounts({
	setTransactions,
	setLoadingTransactions,
	accounts,
	setAccounts,
}: {
	setTransactions: Dispatch<SetStateAction<any>>; // TODO: create transaction schema
	setLoadingTransactions: Dispatch<SetStateAction<boolean>>;
	accounts: BankAccount[];
	setAccounts: Dispatch<SetStateAction<BankAccount[]>>;
}) {
	const companyId = '679243216bff8182ca775264'; // TODO: replace this
	const searchParams = useSearchParams();
	const reference = searchParams.get('ref');
	const [isOpen, setShowModal] = useState(Boolean(reference));
	const [isRefreshing, setIsRefreshing] = useState(false);
	//state for DELETE----
	const [isDeleteOpen, setShowDeleteModal] = useState(false);
	const [accountToDelete, setAccountToDelete] = useState<string | null>(null);
	const [showAccounts, setShowAccounts] = useState(false);

	const handleRefreshTransactions = async () => {
		if (accounts.length === 0) {
			setTransactions([]);
			return;
		}
		try {
			setIsRefreshing(true);
			setLoadingTransactions(true);
			// Fetch transactions for all accounts
			const allTransactions = await Promise.all(
				accounts.map(async (account: BankAccount) => {
					if (!account.accountId) {
						console.error(`Account ${account.id} does not have an accountId`);
						return [];
					}
					try {
						const response = await getTransactions(account.accountId);
						const transactions = response.transactions.booked;
						transactions.map((transaction: any) => {
							transaction.accountId = account.accountId;
							transaction.accountIban = account.iban;
						});
						return transactions || [];
					} catch (error) {
						console.error(
							`Failed to fetch transactions for account ${account.id}:`,
							error
						);
						return [];
					}
				})
			);
			// Flatten and combine all transactions
			const combinedTransactions = allTransactions.flat();
			setTransactions(combinedTransactions);

			// toast.success('Transactions refreshed successfully');
		} catch (error) {
			console.error('Refresh error:', error);
			toast.error('Failed to refresh transactions');
		} finally {
			setIsRefreshing(false);
			setLoadingTransactions(false);
		}
	};
	async function handleDelete(accountId: string) {
		if (!accountId) return;
		try {
			const response = await deleteBankAccount(accountId);
			setAccounts((prev) => prev.filter((acc) => acc.id !== accountId));
			setShowDeleteModal(false);
			toast.success('Account disconnected successfully.');
		} catch (error) {
			console.error('Delete error:', error);
			toast.error('An unexpected error occurred while deleting.');
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

	// useEffect(() => {
	// 	if (!isRefreshing) {
	// 		handleRefreshTransactions();
	// 	}
	// }, [accounts]);
	const handleAccountsModified = async () => {
		await handleRefreshTransactions();
	};
	return (
		<div className='flex justify-end'>
			<Card className='border-2 border-[#E2E8F0] shadow-none bg-[#FFFFFF] '>
				<div
					className={`flex gap-2 justify-end items-center ${showAccounts ? 'mb-2' : 'mb-0'}`}
				>
					{/* CONNECT---ACCOUNT */}
					{isRefreshing ? (
						<button
							onClick={() => setShowModal(true)}
							className='min-w-[160px] px-3 py-2 bg-[#E8EDFC] text-sm text-[#2354E6] rounded-md hover:bg-[#D6E0FA]  flex items-center justify-center h-10 disabled:opacity-50 disabled:cursor-not-allowed'
							disabled
						>
							Connect new account
						</button>
					) : (
						<button
							onClick={() => setShowModal(true)}
							className='min-w-[160px] px-3 py-2 bg-[#E8EDFC] text-sm text-[#2354E6] rounded-md hover:bg-[#D6E0FA]  flex items-center justify-center h-10'
						>
							Connect new account
						</button>
					)}
					{/* <button
						onClick={() => setShowModal(true)}
						className='min-w-[160px] px-3 py-2 bg-[#E8EDFC] text-sm text-[#2354E6] rounded-md hover:bg-[#D6E0FA]  flex items-center justify-center h-10'
					>
						Connect new account
					</button> */}
					{/* REFRESH---- */}
					{isRefreshing ? (
						<button
							className='min-w-[200px] px-3 py-2 bg-[#E8EDFC] text-sm text-[#2354E6] rounded-md hover:bg-[#D6E0FA] disabled:opacity-50 disabled:cursor-not-allowed flex gap-2 items-center justify-center h-10'
							disabled
						>
							Refreshing Transactions...
						</button>
					) : (
						<button
							className='min-w-[200px] px-3 py-2 bg-[#E8EDFC] text-sm text-[#2354E6] rounded-md hover:bg-[#D6E0FA] disabled:opacity-50 disabled:cursor-not-allowed flex gap-2 items-center justify-center h-10'
							onClick={handleRefreshTransactions}
							disabled={accounts?.length === 0}
						>
							<span>Refresh Transactions</span>
							<Image
								src={'/img/refresh.png'}
								width={16}
								height={16}
								alt='refresh-icon'
							/>
						</button>
					)}
					{/* COGH---ICON */}
					<button
						className='min-w-[44px] px-3 py-2 bg-[#E8EDFC] rounded-md flex items-center justify-center h-10'
						onClick={() => setShowAccounts(!showAccounts)}
					>
						<Image
							src={'/img/cogh.png'}
							width={20}
							height={20}
							alt='toggle-accounts-icon'
						/>
					</button>
				</div>
				{showAccounts && (
					<>
						{accounts?.length === 0 && (
							<p className='text-sm text-gray-500'>
								No accounts found. Add new account to get started
							</p>
						)}
						<div className='grid grid-cols-1 gap-4'>
							{accounts?.map((account, i) => (
								<div
									key={account.id}
									className='flex justify-between items-center  p-2 rounded hover:bg-gray-50'
								>
									<div>
										<p className='text-[#334155]'>
											{i + 1}. {account.iban}
										</p>
									</div>
									<button
										className='text-sm  hover:font-semibold text-red-400 disabled:opacity-50 disabled:cursor-not-allowed'
										onClick={() => handleDeleteClick(account.id)}
										disabled={isRefreshing}
									>
										Disconnect
									</button>
								</div>
							))}
						</div>
					</>
				)}
				<DeleteAccountModal
					isOpen={isDeleteOpen}
					setShowModal={setShowDeleteModal}
					onConfirm={() => {
						if (accountToDelete) {
							handleDelete(accountToDelete);
						}
					}}
				/>
				<AddAccountModal
					isOpen={isOpen}
					setShowModal={setShowModal}
					reference={reference}
					onAccountsModified={handleAccountsModified}
				/>
			</Card>
		</div>
	);
}
