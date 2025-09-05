import { useState, useEffect, useMemo } from 'react';
import { Contact, ContactFormData, SortOption } from '../types/contact';
import { generateId } from '../utils/helpers';
import { getGravatarUrl, getRandomUserAvatar } from '../services/avatarService';

const STORAGE_KEY = 'gravibook-contacts';

export const useContacts = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('name-asc');

  // Load contacts from localStorage on mount
  useEffect(() => {
    const savedContacts = localStorage.getItem(STORAGE_KEY);
    if (savedContacts) {
      try {
        const parsed = JSON.parse(savedContacts).map((contact: any) => ({
          ...contact,
          createdAt: new Date(contact.createdAt),
          updatedAt: new Date(contact.updatedAt),
        }));
        setContacts(parsed);
      } catch (error) {
        console.error('Error loading contacts:', error);
      }
    }
  }, []);

  // Save contacts to localStorage whenever contacts change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
  }, [contacts]);

  const addContact = async (contactData: ContactFormData): Promise<Contact> => {
    const now = new Date();
    
    // Try to get avatar from Gravatar first, then fallback to RandomUser
    let avatar = await getGravatarUrl(contactData.email);
    if (!avatar) {
      avatar = await getRandomUserAvatar();
    }

    const newContact: Contact = {
      id: generateId(),
      ...contactData,
      avatar,
      createdAt: now,
      updatedAt: now,
    };

    setContacts(prev => [...prev, newContact]);
    return newContact;
  };

  const updateContact = async (id: string, contactData: ContactFormData): Promise<Contact | null> => {
    const contactIndex = contacts.findIndex(c => c.id === id);
    if (contactIndex === -1) return null;

    const existingContact = contacts[contactIndex];
    let avatar = existingContact.avatar;

    // Update avatar if email changed
    if (existingContact.email !== contactData.email) {
      avatar = await getGravatarUrl(contactData.email);
      if (!avatar) {
        avatar = await getRandomUserAvatar();
      }
    }

    const updatedContact: Contact = {
      ...existingContact,
      ...contactData,
      avatar,
      updatedAt: new Date(),
    };

    setContacts(prev => prev.map(c => c.id === id ? updatedContact : c));
    return updatedContact;
  };

  const deleteContact = (id: string): boolean => {
    const exists = contacts.some(c => c.id === id);
    if (exists) {
      setContacts(prev => prev.filter(c => c.id !== id));
    }
    return exists;
  };

  const getContact = (id: string): Contact | undefined => {
    return contacts.find(c => c.id === id);
  };

  // Get all unique tags
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    contacts.forEach(contact => {
      contact.tags.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [contacts]);

  // Filter and sort contacts
  const filteredContacts = useMemo(() => {
    let filtered = contacts.filter(contact => {
      const matchesSearch = searchTerm === '' || 
        contact.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesTags = selectedTags.length === 0 ||
        selectedTags.some(tag => contact.tags.includes(tag));

      return matchesSearch && matchesTags;
    });

    // Sort contacts
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
        case 'name-desc':
          return `${b.firstName} ${b.lastName}`.localeCompare(`${a.firstName} ${a.lastName}`);
        case 'created-desc':
          return b.createdAt.getTime() - a.createdAt.getTime();
        case 'created-asc':
          return a.createdAt.getTime() - b.createdAt.getTime();
        default:
          return 0;
      }
    });

    return filtered;
  }, [contacts, searchTerm, selectedTags, sortBy]);

  const importContacts = (importedContacts: Contact[]) => {
    setContacts(prev => [...prev, ...importedContacts]);
  };

  return {
    contacts: filteredContacts,
    allContacts: contacts,
    searchTerm,
    setSearchTerm,
    selectedTags,
    setSelectedTags,
    sortBy,
    setSortBy,
    allTags,
    addContact,
    updateContact,
    deleteContact,
    getContact,
    importContacts,
  };
};