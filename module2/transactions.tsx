import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import Loader from '@/components/loader';
import { type Transaction } from '@/types/types';
import { formatDate } from '@/lib/utils';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { BankAccount } from '@/types/prisma-types';
import React from 'react';

export default function Transactions({
	transactions,
	loadingTransactions,
	accounts, //---
}: // any)
{
	transactions: any;
	loadingTransactions: boolean;
	accounts: BankAccount[]; // -----
}) {
	const [type, setType] = React.useState('booked');
	const [filteredTransactions, setFilteredTransactions] =
		React.useState(transactions); //-------

	// Update filtered transactions when accounts or transactions change
	React.useEffect(() => {
		setFilteredTransactions(transactions);
	}, [transactions]);

	const handleAccountFilter = (accountIban: string) => {
		if (accountIban === 'all') {
			setFilteredTransactions(transactions);
		} else {
			const filtered = transactions.filter(
				(transaction: Transaction) => transaction.accountIban === accountIban
			);
			setFilteredTransactions(filtered);
		}
	};
	const tableHeaders = [
		'Description',
		'Date',
		'Creditor/Debtor Name',
		'Bank Account',
		'Transaction Amount',
	];
	const rowKeys: (keyof Transaction)[] = [
		'remittanceInformationUnstructured',
		'valueDate',
		'creditorName',
		'accountIban',
		'transactionAmount',
	];
	return (
		<div>
			{filteredTransactions && filteredTransactions ? (
				<div className='rounded-3xl border-2 border-[#e2e8f0] bg-white my-6 p-4'>
					<div className='flex justify-between items-end'>
						<div>
							<h1 className='text-xl font-semibold mt-2'>
								Recent Transactions
							</h1>
							<p className='text-[#334155] text-sm my-2'>
								{loadingTransactions
									? 'Loading transactions...'
									: 'A list of your recent transactions on this account'}
							</p>
						</div>
						{accounts.length > 0 && !loadingTransactions && (
							<div className='flex items-center gap-4'>
								<Select onValueChange={handleAccountFilter}>
									<SelectTrigger className='w-[280px] xl:w-[196px]'>
										<SelectValue placeholder='All Accounts' />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value='all'>All Accounts</SelectItem>
										{accounts?.map((account) => (
											<SelectItem key={account.id} value={account.iban ?? ''}>
												{account.iban ?? 'No IBAN'}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						)}
					</div>
					{/* Custom Progress Bar */}
					{loadingTransactions && (
						<div className='w-full bg-gray-200 rounded-full h-1.5 mt-4 overflow-hidden'>
							<div className='bg-blue-600 h-1.5 rounded-full w-1/2 animate-slide'></div>
						</div>
					)}
					<Table className='w-full p-6'>
						<TableHeader className='font-bold'>
							<TableRow className='border-b'>
								{tableHeaders.map((header, index) => (
									<TableHead
										key={index}
										className='py-4 text-justify text-[12px] text-[#475569] font-medium'
									>
										{header}
									</TableHead>
								))}
							</TableRow>
						</TableHeader>
						<TableBody className='w-full border-b text-[10px] xl:text-[16px]'>
							{filteredTransactions
								?.slice(0, 10)
								.map((transaction: Transaction, index: number) => (
									<TableRow
										key={index}
										className={`${
											index % 2 === 0
												? 'bg-[#f8fafc] border-y-2 border-y-[#e2e8f0] hover:bg-[#F1F5F9]'
												: 'hover:bg-[#f8fafc]'
										}  text-[#334155] font-medium`}
									>
										{rowKeys.map((key, i) => {
											let value;
											if (key === 'transactionAmount') {
												const amount = parseFloat(transaction[key].amount);
												const currency = transaction[key].currency;
												const isNegative = amount < 0;
												const formattedAmount = isNegative
													? `-${Math.abs(amount).toFixed(2)} ${currency}`
													: `+${amount.toFixed(2)} ${currency}`;

												value = (
													<span
														className={
															isNegative ? 'text-red-500' : 'text-green-500'
														}
													>
														{formattedAmount}
													</span>
												);
											} else if (key === 'creditorName') {
												value = transaction[key] || transaction['debtorName'];
											} else if (key === 'valueDate') {
												value = formatDate(transaction[key]);
											} else {
												value = transaction[key];
											}

											return (
												<TableCell
													key={i}
													className={`text-justify py-4 border-b text-sm ${
														key === 'remittanceInformationUnstructured'
															? 'text-[#2354e6]'
															: ''
													}`}
												>
													{value}
												</TableCell>
											);
										})}
									</TableRow>
								))}
						</TableBody>
					</Table>
				</div>
			) : loadingTransactions ? (
				// <Loader loading={true} message='Fetching Transactions...' />
				<div className='rounded-3xl border-2 border-[#e2e8f0] bg-white my-6 p-4'>
					<div className='flex justify-between items-end'>
						<div>
							<h1 className='text-xl font-semibold mt-2'>
								Recent Transactions
							</h1>
							<p className='text-[#334155] text-sm my-2'>
								Loading transactions...
							</p>
						</div>
					</div>
					
				</div>
			) : (
				<p className='text-gray-500 text-center mt-11'>
					Select an account to view transactions
				</p>
			)}
		</div>
	);
}
