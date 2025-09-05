import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import Header from './components/layout/Header';
import ContactCard from './components/contacts/ContactCard';
import ContactForm from './components/contacts/ContactForm';
import ContactFilters from './components/contacts/ContactFilters';
import ExportImport from './components/contacts/ExportImport';
import { useContacts } from './hooks/useContacts';
import { Contact, ContactFormData } from './types/contact';

function App() {
  const {
    contacts,
    allContacts,
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
  } = useContacts();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddContact = () => {
    setEditingContact(undefined);
    setIsFormOpen(true);
  };

  const handleEditContact = (contact: Contact) => {
    setEditingContact(contact);
    setIsFormOpen(true);
  };

  const handleDeleteContact = (id: string) => {
    if (window.confirm('Czy na pewno chcesz usunąć ten kontakt?')) {
      deleteContact(id);
    }
  };

  const handleFormSubmit = async (data: ContactFormData) => {
    setIsLoading(true);
    try {
      if (editingContact) {
        await updateContact(editingContact.id, data);
      } else {
        await addContact(data);
      }
      setIsFormOpen(false);
      setEditingContact(undefined);
    } catch (error) {
      console.error('Error saving contact:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Zarządzaj swoimi kontaktami
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Dodawaj, edytuj i organizuj kontakty z automatycznymi awatarami
          </p>
          
          <button
            onClick={handleAddContact}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus className="w-5 h-5" />
            <span>Dodaj nowy kontakt</span>
          </button>
        </div>

        {/* Filters and controls */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <ContactFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedTags={selectedTags}
              onTagToggle={handleTagToggle}
              availableTags={allTags}
              sortBy={sortBy}
              onSortChange={setSortBy}
              contactCount={contacts.length}
            />
          </div>
          
          <div>
            <ExportImport
              contacts={allContacts}
              onImport={importContacts}
            />
          </div>
        </div>

        {/* Contacts grid */}
        {contacts.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <Plus className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
              {allContacts.length === 0 ? 'Brak kontaktów' : 'Brak wyników'}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {allContacts.length === 0 
                ? 'Dodaj pierwszy kontakt, aby rozpocząć' 
                : 'Spróbuj zmienić kryteria wyszukiwania'
              }
            </p>
            {allContacts.length === 0 && (
              <button
                onClick={handleAddContact}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Dodaj kontakt</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {contacts.map((contact) => (
              <ContactCard
                key={contact.id}
                contact={contact}
                onEdit={handleEditContact}
                onDelete={handleDeleteContact}
              />
            ))}
          </div>
        )}

        {/* Contact form modal */}
        <ContactForm
          contact={editingContact}
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setEditingContact(undefined);
          }}
          onSubmit={handleFormSubmit}
          isLoading={isLoading}
        />
      </main>
    </div>
  );
}

export default App;