export type JournalEntry = {
	id: string;
	date: string | Date;
	description: string;
	account: string;
	debit: number | string;
	credit: number | string;
	amount: number;
	icon?: ReactNode;
	type: string;
};