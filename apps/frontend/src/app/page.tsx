import Link from 'next/link';
import { Header } from '../components/Header';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <div className="flex flex-1 flex-col items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8 rounded-lg bg-white dark:bg-dark-surface p-8 shadow-md">
          <div>
            <h1 className="text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-dark-text">
              Sistem HR Management
            </h1>
            <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
              Administrare companii, angajați, pontaj și concedii
            </p>
          </div>

          <div className="mt-8 space-y-4">
            <Link
              href="/login"
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none"
            >
              Autentificare
            </Link>
            
            <Link
              href="/admin/create-company"
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-secondary px-4 py-2 text-sm font-medium text-white hover:bg-slate-600 focus:outline-none"
            >
              SuperAdmin: Creare Companie
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 