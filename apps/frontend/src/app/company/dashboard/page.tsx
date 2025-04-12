'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { useAuth } from '@/lib/auth/AuthContext';
import apiClient from '@/lib/api/client';

// Componenta pentru card de statistici
const StatCard = ({ title, value, icon }: { title: string; value: string | number; icon: React.ReactNode }) => (
  <div className="bg-white dark:bg-dark-surface-hover rounded-lg shadow-md p-6 flex items-center dark:border dark:border-dark-border">
    <div className="flex-shrink-0 rounded-md bg-primary-100 dark:bg-primary-900/30 p-3 mr-4">
      {icon}
    </div>
    <div>
      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
    </div>
  </div>
);

// Componenta pentru card de acțiune
const ActionCard = ({ title, description, linkText, linkHref, icon }: { 
  title: string; 
  description: string; 
  linkText: string; 
  linkHref: string;
  icon: React.ReactNode;
}) => (
  <div className="bg-white dark:bg-dark-surface-hover rounded-lg shadow-md p-6 dark:border dark:border-dark-border">
    <div className="rounded-md bg-primary-100 dark:bg-primary-900/30 p-3 w-12 h-12 flex items-center justify-center mb-4">
      {icon}
    </div>
    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{title}</h3>
    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{description}</p>
    <Link
      href={linkHref}
      className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium flex items-center text-sm"
    >
      {linkText}
      <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
      </svg>
    </Link>
  </div>
);

interface Company {
  id: string;
  name: string;
  address: string;
  createdAt: string;
}

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  position: string;
  department: string;
  hireDate: string;
  managerId?: string;
}

export default function CompanyDashboardPage() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [company, setCompany] = useState<Company | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [recentEmployees, setRecentEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (user?.role !== 'COMPANY_ADMIN' && user?.role !== 'MANAGER') {
      router.push('/unauthorized');
      return;
    }

    // Încărcarea datelor pentru dashboard
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        if (!user?.companyId) {
          setError('Nu aveți o companie asociată contului.');
          setLoading(false);
          return;
        }
        
        // Obține informații despre companie
        const companyResponse = await apiClient.get(`/companies/${user.companyId}`);
        setCompany(companyResponse.data);
        
        // Obține angajații companiei
        const employeesResponse = await apiClient.get(`/companies/${user.companyId}/employees`);
        setEmployees(employeesResponse.data);
        
        // Sortăm angajații după data angajării pentru a afișa cei mai recenți
        const sortedEmployees = [...employeesResponse.data].sort((a, b) => 
          new Date(b.hireDate).getTime() - new Date(a.hireDate).getTime()
        );
        setRecentEmployees(sortedEmployees.slice(0, 5));
        
      } catch (err) {
        console.error('Eroare la încărcarea datelor pentru dashboard:', err);
        setError('Nu s-au putut încărca datele pentru dashboard.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [isAuthenticated, user, router]);

  // Calculăm date pentru statistici
  const getDepartmentsCount = () => {
    if (!employees.length) return 0;
    const departments = new Set(employees.map(emp => emp.department));
    return departments.size;
  };

  const getManagersCount = () => {
    if (!employees.length) return 0;
    return employees.filter(emp => emp.position.toLowerCase().includes('manager')).length;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="h-12 w-12 mx-auto animate-spin rounded-full border-4 border-gray-300 border-t-primary"></div>
            <p className="mt-3 text-gray-600 dark:text-gray-400">Se încarcă datele companiei...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1 bg-gray-50 dark:bg-dark-surface">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:text-3xl">
                Dashboard {company?.name}
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Bine ai venit, {user?.email}!
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <button
                onClick={logout}
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-dark-border rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-dark-surface-hover hover:bg-gray-50 dark:hover:bg-dark-border focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-dark-surface"
              >
                <svg className="-ml-1 mr-2 h-5 w-5 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Deconectare
              </button>
            </div>
          </div>
          
          {error && (
            <div className="mb-4 rounded-md bg-danger-50 dark:bg-danger-900/20 p-4 text-danger-700 dark:text-danger-400">
              {error}
            </div>
          )}

          {/* Cards Statistici */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
            <StatCard 
              title="Angajați" 
              value={employees.length} 
              icon={
                <svg className="h-6 w-6 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              } 
            />
            <StatCard 
              title="Departamente" 
              value={getDepartmentsCount()} 
              icon={
                <svg className="h-6 w-6 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              } 
            />
            <StatCard 
              title="Manageri" 
              value={getManagersCount()} 
              icon={
                <svg className="h-6 w-6 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              } 
            />
          </div>

          {/* Acțiuni rapide */}
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Acțiuni rapide</h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
            <ActionCard 
              title="Adaugă un angajat nou" 
              description="Înregistrează un nou angajat în companie" 
              linkText="Adăugare angajat" 
              linkHref="/company/employees/add"
              icon={
                <svg className="h-6 w-6 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              }
            />
            <ActionCard 
              title="Gestionare angajați" 
              description="Vezi și administrează toți angajații" 
              linkText="Vizualizare angajați" 
              linkHref="/company/employees"
              icon={
                <svg className="h-6 w-6 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              }
            />
            <ActionCard 
              title="Rapoarte și statistici" 
              description="Vezi rapoarte detaliate despre companie" 
              linkText="Vizualizare rapoarte" 
              linkHref="/company/reports"
              icon={
                <svg className="h-6 w-6 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              }
            />
          </div>

          {/* Angajați recenți */}
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Angajați recenți</h2>
          <div className="bg-white dark:bg-dark-surface-hover shadow overflow-hidden sm:rounded-md dark:border dark:border-dark-border mb-6">
            <ul className="divide-y divide-gray-200 dark:divide-dark-border">
              {recentEmployees.length > 0 ? (
                recentEmployees.map((employee) => (
                  <li key={employee.id}>
                    <Link href={`/company/employees/${employee.id}`} className="block hover:bg-gray-50 dark:hover:bg-dark-border">
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-primary-600 dark:text-primary-400 truncate">
                            {employee.firstName} {employee.lastName}
                          </p>
                          <div className="ml-2 flex-shrink-0 flex">
                            <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                              {employee.position}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 flex justify-between">
                          <div className="sm:flex">
                            <p className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                              <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              {employee.department}
                            </p>
                          </div>
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>
                              {new Date(employee.hireDate).toLocaleDateString('ro-RO')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))
              ) : (
                <li className="px-4 py-5 text-center text-sm text-gray-500 dark:text-gray-400">
                  Nu există angajați înregistrați.
                </li>
              )}
            </ul>
            {employees.length > 5 && (
              <div className="bg-gray-50 dark:bg-dark-surface px-4 py-3 flex justify-center">
                <Link 
                  href="/company/employees" 
                  className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300"
                >
                  Vezi toți angajații
                </Link>
              </div>
            )}
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