'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '@/lib/auth/AuthContext';

export function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white dark:bg-dark-surface shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex-shrink-0">
          <Link 
            href="/"
            className="text-xl font-bold text-primary dark:text-dark-primary"
          >
            HR Management
          </Link>
        </div>
        
        <div className="hidden md:flex items-center space-x-4">
          <ThemeToggle />
          
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 dark:text-gray-300">
                {user?.email}
              </span>
              <button
                onClick={logout}
                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
              >
                Deconectare
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 rounded-md bg-primary text-white hover:bg-blue-700"
            >
              Autentificare
            </Link>
          )}
        </div>
        
        {/* Mobile menu button */}
        <div className="md:hidden flex items-center space-x-2">
          <ThemeToggle />
          <button
            onClick={toggleMenu}
            className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-4 bg-white dark:bg-dark-surface border-t dark:border-gray-800">
          {isAuthenticated ? (
            <div className="flex flex-col space-y-2">
              <span className="text-gray-700 dark:text-gray-300 py-2">
                {user?.email}
              </span>
              <button
                onClick={() => {
                  logout();
                  setIsMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
              >
                Deconectare
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              onClick={() => setIsMenuOpen(false)}
              className="block px-4 py-2 rounded-md bg-primary text-white hover:bg-blue-700"
            >
              Autentificare
            </Link>
          )}
        </div>
      )}
    </header>
  );
} 