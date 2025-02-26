'use client';

import { useEffect, useState, useTransition } from 'react';
import ContactDataTable from './contact-data-table';
import { contactTableColumns } from './contact-table-columns';
import { Button } from '@/components/ui/button';
import type {
	Contact,
	ContactEntity,
	ContactPerson,
	ContactType,
} from '@/types/prisma-types';
import type { PaginatedContactResponse } from './types';
import Loader from '@/components/loader';
import {
	filterContactsAccordingToCompanyId,
	listContactsByCompanyId,
	createContact,
	updateContactById,
	deleteContactById,
} from '@/actions/contact.actions';
import { createContactPerson } from '@/actions/contact-person.actions';
import { useRouter } from 'next/navigation';
import { isObjectTruthy } from '@/lib/utils';
import { useDebouncedCallback } from 'use-debounce';
import ContactFilters from './contact-filters';
import EmptyContact from './empty-contact';
import ContactPagination from './contact-pagination';
import ContactFormModal from './contact-form/contact-form-modal';
import { toast } from 'sonner';
// import ContactConfirmDeleteModal from './contact-confirm-delete-modal';
import ContactDetailsSheet from './contact-details/contact-details-sheet';
import ConfirmDeleteModal from '@/components/confirm-delete-modal';
import Pagination from '@/components/pagination';
import BreadCrumbs from '@/components/bread-crumbs';

// TODO: for now we have to use a fixed company ID, we will use dynamic company ID when that feature is ready
const companyId = '679243216bff8182ca775264';

const itemsPerPage = 5;

export default function Contacts() {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();
	const [loadingStatus, setLoadingStatus] = useState<{
		isLoading: boolean;
		message?: string;
	}>({
		isLoading: true,
		message: 'Fetching your contacts...',
	});

	const [contactData, setContactData] =
		useState<PaginatedContactResponse | null>(null);
	const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);

	const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

	const [contactPartialNameSearchInput, setContactPartialNameSearchInput] =
		useState('');

	const handleDebouncedContactPartialNameFilter = useDebouncedCallback(
		(value) => {
			setContactFilter((prev) => ({ ...prev, partialName: value }));
		},
		800
	);

	const [contactFilter, setContactFilter] = useState<{
		partialName?: string;
		entity?: ContactEntity;
		type?: ContactType;
	}>({
		partialName: '',
		entity: undefined,
		type: undefined,
	});

	const [showContactFormModal, setShowContactFormModal] = useState(false);
	const [showContactDetailsSheet, setShowContactDetailsSheet] = useState(false);
	const [showContactDeleteConfirmDialog, setShowContactDeleteConfirmDialog] =
		useState(false);

	const [currentPageNumber, setCurrentPageNumber] = useState(0);

	const totalPages = Math.ceil((contactData?.totalCount || 0) / itemsPerPage);

	const canGoToPreviousPage = () => !(currentPageNumber === 0);
	const canGoToNextPage = () => !(currentPageNumber >= totalPages - 1);

	const handlePageChange = (direction: 'next' | 'previous') => {
		startTransition(() => {
			if (direction === 'next' && canGoToNextPage()) {
				setCurrentPageNumber((prev) => prev + 1);
				listContactsByCompanyId(
					companyId,
					'next',
					contactData?.nextCursor as string
				).then((contactData) => {
					setContactData(contactData as PaginatedContactResponse);
				});
			} else if (direction === 'previous' && canGoToPreviousPage()) {
				setCurrentPageNumber((prev) => prev - 1);
				listContactsByCompanyId(
					companyId,
					'previous',
					contactData?.previousCursor as string
				).then((contactData) => {
					setContactData(contactData as PaginatedContactResponse);
				});
			}
		});
	};

	const handleSelectContact = (contactId: String) => {
		// user will either select a filtered contact or paginated contact
		const contacts = filteredContacts.length
			? filteredContacts
			: contactData?.data;
		const foundContact = contacts?.find(({ id }) => id === contactId);

		if (foundContact) setSelectedContact(foundContact);
		return foundContact;
	};

	const handleContactActions = (
		actionType: 'view-details' | 'edit' | 'delete',
		contactId: String
	) => {
		handleSelectContact(contactId);
		switch (actionType) {
			case 'view-details':
				setShowContactDetailsSheet(true);
				break;
			case 'edit':
				setShowContactFormModal(true);
				break;
			case 'delete':
				setShowContactDeleteConfirmDialog(true);
				break;
		}
	};

	const handleCreateContactPerson = async (
		contactPersonBodyData: ContactPerson
	) => {
		try {
			const createdContactPerson = await createContactPerson({
				...contactPersonBodyData,
				contactId: selectedContact?.id as string,
			});
			if ('code' in createdContactPerson) {
				router.replace('/error/500');
			} else {
				const currentSelectedContact = structuredClone(
					selectedContact
				) as Contact;

				if (currentSelectedContact?.contactPersons) {
					currentSelectedContact?.contactPersons.push(createdContactPerson);
				} else {
					currentSelectedContact.contactPersons = [createdContactPerson];
				}

				setSelectedContact(currentSelectedContact);

				setContactData(
					(prev) =>
						({
							...prev,
							data: prev?.data.map((item) =>
								item.id === currentSelectedContact.id
									? currentSelectedContact
									: item
							),
						}) as PaginatedContactResponse
				);

				// user may be updating after filtering
				if (filteredContacts.length)
					setFilteredContacts((prev) => [
						...prev?.map((item) =>
							item.id === currentSelectedContact.id
								? currentSelectedContact
								: item
						),
					]);
			}
		} catch (error) {
			console.error(
				'📣 -> file: contacts.tsx:152 -> Contacts -> error:',
				error
			);
		}
	};

	const handleUpdateContactNote = async (note: string, contactId: string) => {
		try {
			// make optimistic update instead of waiting for server response
			const updatedContact = { ...selectedContact, note } as Contact;

			setSelectedContact(updatedContact);

			setContactData(
				(prev) =>
					({
						...prev,
						data: prev?.data.map((item) =>
							item.id === updatedContact.id ? updatedContact : item
						),
					}) as PaginatedContactResponse
			);

			// user may be updating after filtering
			if (filteredContacts.length)
				setFilteredContacts((prev) => [
					...prev?.map((item) =>
						item.id === updatedContact.id ? updatedContact : item
					),
				]);
			toast.success('Note updated Successfully');
			const updatedContactRes = await updateContactById(contactId, { note });
			if ('code' in updatedContactRes) {
				router.replace('/error/500');
			}
		} catch (error) {
			console.error(
				'📣 -> file: contacts.tsx:175 -> handleUpdateContactNote -> error:',
				error
			);
		}
	};

	const handleUpdateContact = async (
		contactBodyData: Contact,
		contactId: string
	) => {
		setLoadingStatus({
			isLoading: true,
			message: 'Updating Contact...',
		});
		const updatedContact = await updateContactById(contactId, contactBodyData);
		if ('code' in updatedContact) {
			router.replace('/error/500');
		} else {
			setSelectedContact(updatedContact);

			setContactData(
				(prev) =>
					({
						...prev,
						data: prev?.data.map((item) =>
							item.id === updatedContact.id ? updatedContact : item
						),
					}) as PaginatedContactResponse
			);

			// user may be updating after filtering
			if (filteredContacts.length)
				setFilteredContacts((prev) => [
					...prev?.map((item) =>
						item.id === updatedContact.id ? updatedContact : item
					),
				]);
			toast.success('Contact Updated Successfully');
		}
	};

	const handleCreateContact = async (contactBodyData: Contact) => {
		setLoadingStatus({
			isLoading: true,
			message: 'Creating Contact...',
		});
		const createdContact = await createContact({
			...contactBodyData,
			companyId,
		});
		if ('code' in createdContact) {
			router.replace('/error/500');
		} else {
			// best to remove any filters and remove pagination after creating a new contact
			setCurrentPageNumber(0);
			setContactFilter({
				partialName: '',
				entity: undefined,
				type: undefined,
			});

			// refetch the updated list with the new contact data
			const fetchedContactData = await listContactsByCompanyId(companyId);
			if ('code' in fetchedContactData) {
				router.replace('/error/500');
			} else {
				setContactData(fetchedContactData);
			}
			toast.success('Contact Created Successfully');
		}
	};

	const handleContactFormSubmit = async (
		contactBodyData: Contact,
		contactId?: string
	) => {
		try {
			setShowContactFormModal(false);
			// if contact is being updated
			if (contactId) await handleUpdateContact(contactBodyData, contactId);
			// if contact is being created
			else await handleCreateContact(contactBodyData);

			setLoadingStatus({
				isLoading: false,
				message: '',
			});
		} catch (error) {
			console.error(
				'📣 -> file: contacts.tsx:216 -> Contacts -> error:',
				error
			);
		}
	};

	const handleDeleteContact = async () => {
		try {
			setShowContactDeleteConfirmDialog(false);
			setShowContactDetailsSheet(false);

			setLoadingStatus({
				isLoading: true,
				message: 'Deleting Contact...',
			});

			if (selectedContact?.id) {
				const deletedContactResponse = await deleteContactById(
					selectedContact.id
				);
				if (
					typeof deletedContactResponse === 'object' &&
					'code' in deletedContactResponse
				) {
					router.replace('/error/500');
				} else {
					setCurrentPageNumber(0);
					setContactFilter({
						partialName: '',
						entity: undefined,
						type: undefined,
					});

					const fetchedContactData = await listContactsByCompanyId(companyId);
					if ('code' in fetchedContactData) {
						router.replace('/error/500');
					} else {
						setContactData(fetchedContactData);
					}

					setLoadingStatus({
						isLoading: false,
						message: '',
					});

					toast.success('Contact Deleted');
				}
			}
		} catch (error) {
			console.error(
				'📣 -> file: contacts.tsx:226 -> handleDeleteContact -> error:',
				error
			);
		}
	};

	useEffect(() => {
		const listContactsByCompanyIdAction = async () => {
			try {
				const fetchedContactData = await listContactsByCompanyId(companyId);
				if ('code' in fetchedContactData) {
					router.replace('/error/500');
				} else {
					setContactData(fetchedContactData);
					setLoadingStatus({
						isLoading: false,
					});
				}
			} catch (error) {
				console.error(
					'📣 -> file: contacts.tsx:36 -> listContactsByCompanyIdAction -> error:',
					error
				);
			}
		};

		startTransition(() => listContactsByCompanyIdAction());
	}, []);

	useEffect(() => {
		if (!isObjectTruthy(contactFilter)) {
			setFilteredContacts([]);
		} else {
			setLoadingStatus({ isLoading: true, message: 'Filtering contacts...' });
			startTransition(() =>
				filterContactsAccordingToCompanyId(companyId, contactFilter).then(
					(filteredContacts) => {
						setFilteredContacts(
							(filteredContacts as PaginatedContactResponse).data
						);
						setLoadingStatus({ isLoading: false, message: '' });
					}
				)
			);
		}
	}, [contactFilter]);

	useEffect(() => {
		if (
			!showContactFormModal &&
			!showContactDetailsSheet &&
			!showContactDeleteConfirmDialog
		)
			setSelectedContact(null);
	}, [
		showContactFormModal,
		showContactDetailsSheet,
		showContactDeleteConfirmDialog,
	]);

	if (isPending || loadingStatus.isLoading)
		return <Loader message={loadingStatus.message} />;

	return (
		<main className='min-h-screen bg-[#f8fafc]'>
			<div className='flex flex-col gap-6 w-full mx-auto p-6'>
				{contactData?.totalCount && contactData?.totalCount > 0 ? (
					<div>
						<BreadCrumbs />
						{/* HEADER----- */}
						<div className='flex justify-between items-center'>
							<h1 className='text-[32px] font-semibold'>Contacts</h1>
							<div>
								<Button
									disabled={isPending}
									onClick={() => setShowContactFormModal(true)}
									className='bg-[#2354e6] text-white h-[40px] px-12 xl:px-4 text-base'
								>
									+ New Contact
								</Button>
							</div>
						</div>
						<div className='w-full bg-white rounded-3xl px-4 my-6 shadow-lg border-2 border-[#e2e8f0]'>
							{/* TOP---BAR */}
							<ContactFilters
								contactFilter={contactFilter}
								setContactFilter={setContactFilter}
								contactPartialNameSearchInput={contactPartialNameSearchInput}
								setContactPartialNameSearchInput={
									setContactPartialNameSearchInput
								}
								handleDebouncedContactPartialNameFilter={
									handleDebouncedContactPartialNameFilter
								}
							/>
							{/* Table Content */}
							<ContactDataTable
								handleContactActions={handleContactActions}
								columns={contactTableColumns}
								data={
									isObjectTruthy(contactFilter)
										? filteredContacts
										: contactData?.data
								}
							/>
							{/* No need to show pagination on filtering */}
							{!isObjectTruthy(contactFilter) && (
								<Pagination
									handlePageChange={handlePageChange}
									isPending={isPending}
									canGoToPreviousPage={canGoToPreviousPage}
									canGoToNextPage={canGoToNextPage}
									currentPageNumber={currentPageNumber}
									totalPages={totalPages}
								/>
							)}
						</div>
					</div>
				) : (
					<EmptyContact
						isPending={isPending}
						setShowContactFormModal={setShowContactFormModal}
					/>
				)}
			</div>
			<ContactFormModal
				handleContactFormSubmit={handleContactFormSubmit}
				isOpen={showContactFormModal}
				onOpenChange={setShowContactFormModal}
				selectedContact={selectedContact || undefined}
			/>
			<ContactDetailsSheet
				isOpen={showContactDetailsSheet}
				onOpenChange={setShowContactDetailsSheet}
				selectedContact={selectedContact || undefined}
				handleContactActions={handleContactActions}
				handleUpdateContactNote={handleUpdateContactNote}
				handleCreateContactPerson={handleCreateContactPerson}
			/>
			<ConfirmDeleteModal
				isOpen={showContactDeleteConfirmDialog}
				onOpenChange={setShowContactDeleteConfirmDialog}
				handleDelete={handleDeleteContact}
				title='Delete Contact'
				description='Are you sure you want to delete this contact? This action cannot be undone.'
				confirmButtonText='Delete'
				cancelButtonText='Cancel'
			/>
		</main>
	);
}
