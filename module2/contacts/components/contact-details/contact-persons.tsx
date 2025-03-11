import { Input } from '@/components/ui/input';
import type { ContactPerson } from '@/types/prisma-types';
import { useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { extractInitials } from '@/lib/utils';
import ContactPersonFormModal from './contact-person-form-modal';
import { toast } from 'sonner';
import SearchIcon from '@/components/icon-components/search-icon';

interface ContactPersonsProps {
	contactPersons: ContactPerson[];
	handleCreateContactPerson: (
		contactPersonBodyData: ContactPerson
	) => Promise<void>;
}

export type ContactPersonFormDataType = {
	firstName: string;
	lastName?: string;
	email?: string;
	phoneNumber?: string;
};

export default function ContactPersons({
	contactPersons,
	handleCreateContactPerson,
}: ContactPersonsProps) {
	const [contactPersonsCopy, setContactPersonsCopy] = useState<
		ContactPerson[] | null
	>(contactPersons);

	const [showContactPersonFormModal, setShowContactPersonFormModal] =
		useState(false);

	const [contactPersonData, setContactPersonData] =
		useState<ContactPersonFormDataType>({
			firstName: '',
			lastName: '',
			email: '',
			phoneNumber: '',
		});

	const [filteredContactPerson, setFilteredContactPersons] = useState<
		ContactPerson[] | undefined | null
	>(
		contactPersonsCopy?.length ? contactPersonsCopy.reverse().slice(0, 2) : null
	);

	const [
		contactPersonPartialNameSearchInput,
		setContactPersonPartialNameSearchInput,
	] = useState('');

	const handleDebouncedContactPartialNameFilter = useDebouncedCallback(
		(value: string) => {
			if (value.trim() && contactPersonsCopy) {
				const filtered = contactPersonsCopy
					.filter((person) =>
						person?.fullName?.toLowerCase().includes(value.toLowerCase())
					)
					.slice(0, 2);
				setFilteredContactPersons(filtered);
			} else {
				setFilteredContactPersons(
					contactPersonsCopy?.reverse().slice(0, 2) || []
				);
			}
		},
		200
	);

	const handleContactPersonData = (
		key: keyof ContactPersonFormDataType,
		value: string
	) => setContactPersonData((prev) => ({ ...prev, [key]: value }));

	// const handleSubmitContactPersonForm = async () => {
	// 	if (!contactPersonData.firstName) {
	// 		toast.error('Contact first name is required');
	// 		return;
	// 	}

	// 	const contactPersonBodyData = {
	// 		fullName:
	// 			contactPersonData.firstName.trim() +
	// 			(contactPersonData.lastName
	// 				? ` ${contactPersonData.lastName.trim()}`
	// 				: ''),
	// 	} as ContactPerson;

	// 	if (contactPersonData.email)
	// 		contactPersonBodyData.email = contactPersonData.email.trim();
	// 	if (contactPersonData.phoneNumber)
	// 		contactPersonBodyData.phoneNumber = contactPersonData.phoneNumber.trim();

	// 	// weird I know, but I am too tired to think of a better name
	// 	const contactPersonsCopyCopy = contactPersonsCopy
	// 		? [...contactPersonsCopy, contactPersonBodyData]
	// 		: [];

	// 	setContactPersonsCopy(contactPersonsCopyCopy);

	// 	setShowContactPersonFormModal(false);

	// 	await handleCreateContactPerson(contactPersonBodyData);
	// };

	const handleSubmitContactPersonForm = async (
		data: ContactPersonFormDataType
	) => {
		if (!data.firstName) {
			toast.error('Contact first name is required');
			return;
		}

		const contactPersonBodyData = {
			fullName:
				data.firstName.trim() +
				(data.lastName ? ` ${data.lastName.trim()}` : ''),
			email: data.email?.trim() || null,
			phoneNumber: data.phoneNumber?.trim() || null,
		} as ContactPerson;

		// Update local state
		const contactPersonsCopyCopy = contactPersonsCopy
			? [...contactPersonsCopy, contactPersonBodyData]
			: [contactPersonBodyData];

		setContactPersonsCopy(contactPersonsCopyCopy);
		setShowContactPersonFormModal(false);

		// Call the API
		await handleCreateContactPerson(contactPersonBodyData);
	};
	useEffect(() => {
		setContactPersonsCopy(contactPersons);
		setFilteredContactPersons(contactPersons.reverse().slice(0, 2));
	}, [contactPersons]);

	useEffect(() => {
		if (!contactPersonData) {
			setContactPersonData({
				firstName: '',
				lastName: '',
				email: '',
				phoneNumber: '',
			});
		}
	}, [showContactPersonFormModal]);

	return (
		<div className='my-8 border-2 border-[#e2e8f0] rounded-xl p-4 grid grid-cols-1 gap-2'>
			<h1 className='text-lg font-semibold'>Contact People</h1>
			<div className='relative'>
				<span className='absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400'>
					<SearchIcon />
				</span>
				<Input
					className='pl-10 h-[40px] bg-white text-[#64748b] w-[320px] xl:w-full rounded-md border border-gray-300 focus:border-[#4880FF] focus:outline-none text-base contactSearch'
					placeholder='Search'
					value={contactPersonPartialNameSearchInput}
					onChange={({ target: { value } }) => {
						setContactPersonPartialNameSearchInput(value);
						handleDebouncedContactPartialNameFilter(value);
					}}
				/>
			</div>
			<div className='space-y-2 text-sm'>
				{filteredContactPerson &&
					filteredContactPerson.map((item) => (
						<div
							key={item.id}
							className='flex gap-2 items-center bg-[#f8fafc] rounded-xl p-2 contactList'
						>
							<Avatar>
								<AvatarImage
									src={item.imageUrl || undefined}
									alt={item.fullName || undefined}
								/>
								<AvatarFallback className='!bg-[#2354E6] text-white'>
									{extractInitials(item.fullName as string)}
								</AvatarFallback>
							</Avatar>
							<p>{item.fullName}</p>
						</div>
					))}
				<button
					className='text-[#2354e6] bg-[#e8edfc] rounded-xl p-2 w-full text-left font-medium'
					onClick={() => setShowContactPersonFormModal(true)}
				>
					+ Add new contact : "
					{contactPersonPartialNameSearchInput &&
						`${contactPersonPartialNameSearchInput}`}
					"
				</button>
				<ContactPersonFormModal
					isOpen={showContactPersonFormModal}
					onOpenChange={setShowContactPersonFormModal}
					handleContactPersonData={handleContactPersonData}
					contactPersonData={contactPersonData}
					handleSubmitContactPersonForm={handleSubmitContactPersonForm}
				/>
			</div>
		</div>
	);
}
