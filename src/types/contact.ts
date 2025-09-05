export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  tags: string[];
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  tags: string[];
}

export type SortOption = 'name-asc' | 'name-desc' | 'created-desc' | 'created-asc';