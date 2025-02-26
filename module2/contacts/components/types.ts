import type { PaginatedResponse } from '@/types/types';
import type { Contact } from '@/types/prisma-types';

export type PaginatedContactResponse = PaginatedResponse<Contact>;
