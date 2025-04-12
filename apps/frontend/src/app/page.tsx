import Link from 'next/link';
import { Header } from '../components/Header';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1 bg-gray-50 dark:bg-dark-surface">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
              <span className="block">Sistem de management HR</span>
              <span className="block text-primary-600 dark:text-primary-400 mt-2">pentru companiile moderne</span>
            </h1>
            <p className="mt-4 max-w-xl mx-auto text-lg text-gray-500 dark:text-gray-400">
              Administrare facilă a angajaților, pontajului și concediilor într-o singură platformă
            </p>
          </div>

          <div className="mt-12">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {/* Feature 1 */}
              <div className="bg-white dark:bg-dark-surface-hover rounded-xl shadow-card p-6 transition-all hover:shadow-lg dark:border dark:border-dark-border">
                <div className="w-12 h-12 rounded-md bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Gestiune angajați</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Administrarea datelor personale și profesionale ale angajaților într-un mod structurat și securizat.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white dark:bg-dark-surface-hover rounded-xl shadow-card p-6 transition-all hover:shadow-lg dark:border dark:border-dark-border">
                <div className="w-12 h-12 rounded-md bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Pontaj și prezență</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Înregistrare simplă a orelor de muncă cu rapoarte detaliate pentru monitorizarea timpului lucrat.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white dark:bg-dark-surface-hover rounded-xl shadow-card p-6 transition-all hover:shadow-lg dark:border dark:border-dark-border">
                <div className="w-12 h-12 rounded-md bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Management concedii</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Gestionarea eficientă a cererilor de concediu cu aprobări și evidența zilelor disponibile.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 flex justify-center space-x-4">
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600"
            >
              Autentificare
            </Link>
            <Link
              href="/admin/create-company"
              className="inline-flex items-center justify-center px-5 py-3 border border-gray-300 dark:border-dark-border text-base font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-dark-surface-hover hover:bg-gray-50 dark:hover:bg-dark-border"
            >
              SuperAdmin: Creare Companie
            </Link>
          </div>
        </div>
      </main>

      <footer className="bg-white dark:bg-dark-surface border-t border-gray-200 dark:border-dark-border py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} Sistem Management HR. Toate drepturile rezervate.
          </p>
        </div>
      </footer>
    </div>
  );
} 