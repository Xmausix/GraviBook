import React from 'react';
import { BookOpen, Moon, Sun } from 'lucide-react';
import { useDarkMode } from '../../hooks/useDarkMode';

const Header: React.FC = () => {
  const { isDark, toggleDarkMode } = useDarkMode();

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">GraviBook</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Twoja książka adresowa</p>
            </div>
          </div>
          
          <button
            onClick={toggleDarkMode}
            className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
            aria-label="Przełącz tryb ciemny"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;