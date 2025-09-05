import React, { useRef, useState } from 'react';
import { Download, Upload, FileText, Code } from 'lucide-react';
import { Contact } from '../../types/contact';
import { exportToCSV, exportToJSON, downloadFile, parseCSV } from '../../utils/exportImport';

interface ExportImportProps {
  contacts: Contact[];
  onImport: (contacts: Contact[]) => void;
}

const ExportImport: React.FC<ExportImportProps> = ({ contacts, onImport }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importError, setImportError] = useState<string>('');
  const [importSuccess, setImportSuccess] = useState<string>('');

  const handleExportCSV = () => {
    const csv = exportToCSV(contacts);
    downloadFile(csv, `gravibook-kontakty-${new Date().toISOString().split('T')[0]}.csv`, 'text/csv');
  };

  const handleExportJSON = () => {
    const json = exportToJSON(contacts);
    downloadFile(json, `gravibook-kontakty-${new Date().toISOString().split('T')[0]}.json`, 'application/json');
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImportError('');
    setImportSuccess('');

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        
        if (file.name.endsWith('.csv')) {
          const importedContacts = parseCSV(content);
          if (importedContacts.length === 0) {
            setImportError('Nie znaleziono prawidłowych kontaktów w pliku CSV.');
            return;
          }
          onImport(importedContacts);
          setImportSuccess(`Zaimportowano ${importedContacts.length} kontaktów z pliku CSV.`);
        } else if (file.name.endsWith('.json')) {
          const importedContacts = JSON.parse(content) as Contact[];
          onImport(importedContacts);
          setImportSuccess(`Zaimportowano ${importedContacts.length} kontaktów z pliku JSON.`);
        } else {
          setImportError('Nieobsługiwany format pliku. Użyj plików CSV lub JSON.');
        }
      } catch (error) {
        setImportError('Błąd podczas importu pliku. Sprawdź format i spróbuj ponownie.');
      }
    };

    reader.readAsText(file);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Eksport i Import
      </h3>
      
      {/* Export section */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Eksportuj kontakty:
        </h4>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          <button
            onClick={handleExportCSV}
            disabled={contacts.length === 0}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <FileText className="w-4 h-4" />
            <span>Eksport CSV</span>
          </button>
          
          <button
            onClick={handleExportJSON}
            disabled={contacts.length === 0}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Code className="w-4 h-4" />
            <span>Eksport JSON</span>
          </button>
        </div>
        
        {contacts.length === 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Brak kontaktów do eksportu
          </p>
        )}
      </div>

      {/* Import section */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Importuj kontakty:
        </h4>
        
        <div className="space-y-3">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.json"
            onChange={handleImport}
            className="hidden"
          />
          
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Upload className="w-4 h-4" />
            <span>Wybierz plik (CSV lub JSON)</span>
          </button>
          
          {importError && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{importError}</p>
            </div>
          )}
          
          {importSuccess && (
            <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-sm text-green-600 dark:text-green-400">{importSuccess}</p>
            </div>
          )}
          
          <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
            <p>• Format CSV: firstName, lastName, email, phone, tags, createdAt</p>
            <p>• Tagi oddziel średnikiem (;)</p>
            <p>• JSON powinien zawierać tablicę obiektów Contact</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportImport;