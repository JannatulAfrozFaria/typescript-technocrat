'use client';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { DropDown } from '@/components/form-elements';
import { Form } from '@/components/ui/form';
import { type Dispatch, type SetStateAction } from 'react';
import { toast } from 'sonner';
import Loader from '@/components/loader';
import { listBankAccountsByCompanyId } from '@/actions/bank.action';
import supportedCountries from './supportedCountries';
import { FaArrowRight } from 'react-icons/fa6';
import {
	getBanksByCountry,
	buildRedirectLink,
	getAccounts,
	getAccountDetails,
	getRequisitionIdByReference,
} from '@/actions/gocardless.actions';
import { SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { createBankAccounts } from '@/actions/bank.action';
import type { BankAccount } from '@/types/prisma-types';
import { CountryPicker } from './country-picker';
interface AddAccountFormProps {
	setShowModal: Dispatch<SetStateAction<boolean>>;
	reference?: string | null;
}
interface BankAccountForm {
	institutionId: string;
	countryCode: string;
}

export default function AddAccountForm({
	setShowModal,
	reference,
}: AddAccountFormProps) {
	const dummyBank = {
		id: 'SANDBOXFINANCE_SFIN0000',
		name: 'The Dummy Bank',
		bic: 'ABNAGB2LXXX',
		countries: ['GB'],
		logo: 'https://storage.googleapis.com/gc-prd-institution_icons-production/UK/PNG/abnamrobank.png',
		max_access_valid_for_days: '90',
		transaction_total_days: '540',
	};
	const router = useRouter();
	const [banks, setBanks] = useState([]);
	const [accounts, setAccounts] = useState<BankAccount[]>([]);
	const [loader, setLoader] = useState(false);
	// const [loader, setLoader] = useState(true);

	const form = useForm<BankAccountForm>({
		// resolver: zodResolver(BankAccountFormSchema),
		defaultValues: {},
	});
	// TODO: replace with dynamic company ID
	const companyId = '679243216bff8182ca775264';
	const {
		control,
		handleSubmit,
		watch,
		getValues,
		formState: { errors },
	} = form;

	async function onSubmit(data: BankAccountForm) {
		if (Object.keys(errors).length) {
			toast.error('There are errors in your form');
			return;
		}
		const response = (await buildRedirectLink(
			data.institutionId,
			companyId
		)) as {
			link: string;
		};
		const redirectUrl = response.link;
		window.location.replace(redirectUrl);
	}
	useEffect(() => {
		const fetchBanks = async () => {
			try {
				const countryCode = getValues('countryCode') as string;
				if (!countryCode) return;
				const response = await getBanksByCountry(countryCode);
				setBanks(response);
			} catch (error) {
				console.error('Error fetching banks:', error);
			}
		};
		fetchBanks();
	}, [watch('countryCode')]);

	useEffect(() => {
		if (!reference) return;
		const fetchAccounts = async () => {
			setLoader(true);
			try {
				const requisitionId = await getRequisitionIdByReference(reference);
				if (!requisitionId) {
					console.error('No requisition found for reference:', reference);
					setLoader(false);
					router.push('/en/banking/dashboard');
					setShowModal(false);
					return;
				}
				const response = await getAccounts(requisitionId);
				if (!response?.accounts?.length) {
					console.error('No accounts found for requisition:', requisitionId);
					return;
				}
				const accountDetails = await Promise.all(
					response.accounts.map(async (accountId: string) => {
						const { account } = await getAccountDetails(accountId);
						account.accountId = accountId;
						account.companyId = companyId;
						account.currencyShortLabel = account.currency;
						delete account.currency;
						return account;
					})
				);
				setAccounts(accountDetails);
				setLoader(false);
			} catch (error) {
				console.error('Error fetching accounts:', error);
			}
		};

		fetchAccounts();
	}, [reference]);

	const handleSaveAccounts = async () => {
		let latestAccounts: BankAccount[] = [];

		const exitFlow = () => {
			setShowModal(false);
			router.push('/en/banking/dashboard');
		};

		try {
			const latest = await listBankAccountsByCompanyId(companyId);

			// TODO: Move duplication check to backend to prevent race conditions
			if ('code' in latest) {
				toast.error('Error fetching accounts');
				exitFlow();
				return;
			}

			if ('data' in latest && Array.isArray(latest.data)) {
				if (latest.data.length > 0) {
					latestAccounts = latest.data;
				}
			} else {
				console.error('Failed to fetch accounts:', latest);
			}

			// Filter out duplicates
			const accountsToSave = accounts.filter(
				(account) =>
					!latestAccounts.some(
						(saved: BankAccount) => saved.iban === account.iban
					)
			);

			if (accountsToSave.length === 0) {
				toast.error('No new accounts to save');
				exitFlow();
				return;
			}

			const response = await createBankAccounts(accountsToSave);

			if ('code' in response) {
				toast.error('Error saving accounts');
				exitFlow();
				return;
			}

			toast.success('Accounts saved successfully');
			exitFlow();
		} catch (err) {
			console.error(err);
			toast.error('An unexpected error occurred.');
		}
	};

	return reference ? (
		<div className='flex flex-col gap-4 h-[100%]'>
			{loader && (
				<div className='py-28'>
					<Loader loading={loader} message='Fetching Accounts...' />
					<button onClick={() => setShowModal(false)}>Cancel</button>
				</div>
			)}
			{!loader && (
				<>
					<p className='text-lg text-gray-500'>Accounts</p>
					<div className='grid grid-cols-1 gap-4'>
						{accounts?.map((account, i) => (
							<div
								key={account.iban}
								className='border-b-2 border-[#e2e8f0] pb-2'
							>
								<p>
									{i + 1}. {account.iban}
								</p>
								<p className='text-sm text-gray-500'>
									{account.name} - {account.product}
								</p>
								<p className='text-sm text-gray-500'>{account.ownerName}</p>
								<p className='text-sm text-gray-500'>
									{account.cashAccountType}
								</p>
								<p className='text-sm text-gray-500'>
									{account.currencyShortLabel}
								</p>
							</div>
						))}
					</div>
					<Button
						className='bg-[#2354e6] text-white px-8 text-lg w-full mt-2'
						onClick={handleSaveAccounts}
						disabled={accounts.length === 0}
					>
						Save Accounts
					</Button>
				</>
			)}
		</div>
	) : (
		<Form {...form}>
			<form onSubmit={handleSubmit(onSubmit)}>
				<CountryPicker
					control={control}
					name='countryCode'
					label='Country'
					placeholder='Select Country'
				/>
				<DropDown
					label='Bank'
					name='institutionId'
					control={control}
					placeholder='Select Bank'
					disabled={!watch('countryCode')}
				>
					{[dummyBank, ...banks]?.map((bank) => (
						<SelectItem key={bank.id} value={bank.id}>
							{bank.name}
						</SelectItem>
					))}
				</DropDown>
				{/* <Button
					type='submit'
					className='bg-[#2354e6] text-white px-8 text-lg w-full mt-4'
				>
					Next Step <FaArrowRight style={{ marginLeft: 10 }} />
				</Button> */}
				<div className='flex gap-2'>
					<Button
						type='button'
						variant='outline'
						className='w-full mt-4'
						onClick={() => setShowModal(false)}
					>
						Cancel
					</Button>
					<Button
						type='submit'
						className='bg-[#2354e6] text-white px-8 text-lg w-full mt-4'
					>
						Next Step <FaArrowRight style={{ marginLeft: 10 }} />
					</Button>
				</div>
			</form>
		</Form>
	);
}
