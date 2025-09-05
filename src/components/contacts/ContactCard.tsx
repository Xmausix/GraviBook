import React from 'react';
import { Contact } from '../../types/contact';
import { Mail, Phone, Edit, Trash2, Tag } from 'lucide-react';
import { formatDate } from '../../utils/helpers';

interface ContactCardProps {
  contact: Contact;
  onEdit: (contact: Contact) => void;
  onDelete: (id: string) => void;
}

const ContactCard: React.FC<ContactCardProps> = ({ contact, onEdit, onDelete }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 group">
      <div className="p-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <img
              src={contact.avatar}
              alt={`${contact.firstName} ${contact.lastName}`}
              className="w-16 h-16 rounded-full object-cover ring-4 ring-gray-100 dark:ring-gray-700"
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=200&h=200&fit=crop&crop=face';
              }}
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {contact.firstName} {contact.lastName}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Dodano {formatDate(contact.createdAt)}
                </p>
              </div>
              
              <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                  onClick={() => onEdit(contact)}
                  className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200"
                  aria-label="Edytuj kontakt"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(contact.id)}
                  className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
                  aria-label="Usuń kontakt"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="mt-4 space-y-2">
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="truncate">{contact.email}</span>
              </div>
              
              {contact.phone && (
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span>{contact.phone}</span>
                </div>
              )}
            </div>
            
            {contact.tags.length > 0 && (
              <div className="mt-4 flex items-center space-x-2">
                <Tag className="w-4 h-4 text-gray-400" />
                <div className="flex flex-wrap gap-1">
                  {contact.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactCard;