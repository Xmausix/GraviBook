import React from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { SortOption } from '../../types/contact';

interface ContactFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
  availableTags: string[];
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  contactCount: number;
}

const ContactFilters: React.FC<ContactFiltersProps> = ({
  searchTerm,
  onSearchChange,
  selectedTags,
  onTagToggle,
  availableTags,
  sortBy,
  onSortChange,
  contactCount,
}) => {
  const sortOptions = [
    { value: 'name-asc' as SortOption, label: 'A-Z' },
    { value: 'name-desc' as SortOption, label: 'Z-A' },
    { value: 'created-desc' as SortOption, label: 'Najnowsze' },
    { value: 'created-asc' as SortOption, label: 'Najstarsze' },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Szukaj po imieniu, nazwisku lub emailu..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
        />
        {searchTerm && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filters row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
        {/* Sort */}
        <div className="flex items-center space-x-2">
          <SlidersHorizontal className="w-4 h-4 text-gray-400" />
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Results count */}
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Wyników: {contactCount}
        </div>
      </div>

      {/* Tag filters */}
      {availableTags.length > 0 && (
        <div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Filtruj po tagach:</p>
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => (
              <button
                key={tag}
                onClick={() => onTagToggle(tag)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  selectedTags.includes(tag)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
          {selectedTags.length > 0 && (
            <button
              onClick={() => {
                selectedTags.forEach(tag => onTagToggle(tag));
              }}
              className="mt-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
            >
              Wyczyść filtry
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ContactFilters;