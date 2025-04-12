'use client';

import { Header } from '@/components/Header';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/AuthContext';

export default function UnauthorizedPage() {
  const { logout } = useAuth();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <div className="flex flex-1 flex-col items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8 rounded-lg bg-white dark:bg-dark-surface p-8 shadow-md">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-red-600 dark:text-red-500">
              Acces interzis
            </h1>
            <div className="mt-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mx-auto h-24 w-24 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Nu aveți permisiunea necesară pentru a accesa această resursă.
            </p>
          </div>

          <div className="mt-8 space-y-4">
            <Link
              href="/"
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none"
            >
              Înapoi la pagina principală
            </Link>
            
            <button
              onClick={logout}
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-gray-500 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 focus:outline-none"
            >
              Deconectare
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 