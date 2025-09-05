import { Contact } from '../types/contact';
import { generateId } from './helpers';

export const exportToCSV = (contacts: Contact[]): string => {
  const headers = ['firstName', 'lastName', 'email', 'phone', 'tags', 'createdAt'];
  const csvContent = [
    headers.join(','),
    ...contacts.map(contact => [
      `"${contact.firstName}"`,
      `"${contact.lastName}"`,
      `"${contact.email}"`,
      `"${contact.phone}"`,
      `"${contact.tags.join(';')}"`,
      `"${contact.createdAt.toISOString()}"`,
    ].join(','))
  ].join('\n');
  
  return csvContent;
};

export const exportToJSON = (contacts: Contact[]): string => {
  return JSON.stringify(contacts, null, 2);
};

export const downloadFile = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const parseCSV = (csvContent: string): Contact[] => {
  const lines = csvContent.trim().split('\n');
  if (lines.length < 2) return [];
  
  const headers = lines[0].split(',').map(h => h.replace(/"/g, ''));
  const contacts: Contact[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].match(/(".*?"|[^,]*)/g)?.map(v => v.replace(/^"|"$/g, ''));
    if (!values || values.length < headers.length) continue;
    
    const contact: Contact = {
      id: generateId(),
      firstName: values[0] || '',
      lastName: values[1] || '',
      email: values[2] || '',
      phone: values[3] || '',
      tags: values[4] ? values[4].split(';').filter(Boolean) : [],
      createdAt: values[5] ? new Date(values[5]) : new Date(),
      updatedAt: new Date(),
    };
    
    // Basic validation
    if (contact.firstName && contact.lastName && contact.email) {
      contacts.push(contact);
    }
  }
  
  return contacts;
};