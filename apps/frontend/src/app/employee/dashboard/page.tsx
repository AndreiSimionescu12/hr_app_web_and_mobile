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

interface EmployeeProfile {
  id: string;
  firstName: string;
  lastName: string;
  position: string;
  department: string;
  hireDate: string;
  manager?: {
    id: string;
    firstName: string;
    lastName: string;
    position: string;
  };
}

interface Company {
  id: string;
  name: string;
}

interface TimeEntry {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  totalHours: number;
  status: string;
}

interface LeaveRequest {
  id: string;
  startDate: string;
  endDate: string;
  type: string;
  status: string;
  totalDays: number;
}

export default function EmployeeDashboardPage() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<EmployeeProfile | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (user?.role !== 'EMPLOYEE') {
      router.push('/unauthorized');
      return;
    }

    // Încărcarea datelor pentru dashboard
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        if (!user.employeeId) {
          setError('Nu există un profil de angajat asociat contului.');
          setLoading(false);
          return;
        }
        
        // Obține informații despre profil
        const profileResponse = await apiClient.get(`/employees/${user.employeeId}`);
        setProfile(profileResponse.data);
        
        // Obține informații despre companie
        if (user.companyId) {
          const companyResponse = await apiClient.get(`/companies/${user.companyId}`);
          setCompany(companyResponse.data);
        }
        
        // Obține pontările recente
        const timeEntriesResponse = await apiClient.get(`/employees/${user.employeeId}/time-entries?limit=5`);
        setTimeEntries(timeEntriesResponse.data);
        
        // Obține cererile de concediu recente
        const leaveRequestsResponse = await apiClient.get(`/employees/${user.employeeId}/leave-requests?limit=5`);
        setLeaveRequests(leaveRequestsResponse.data);
        
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
  const getWorkHoursThisMonth = () => {
    if (!timeEntries.length) return '0h';
    
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    
    const thisMonthEntries = timeEntries.filter(entry => 
      new Date(entry.date) >= firstDayOfMonth && new Date(entry.date) <= currentDate
    );
    
    const totalHours = thisMonthEntries.reduce((sum, entry) => sum + entry.totalHours, 0);
    return `${totalHours}h`;
  };

  const getLeaveBalance = () => {
    // Acest calcul ar trebui să vină de la backend
    return '15 zile';
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="h-12 w-12 mx-auto animate-spin rounded-full border-4 border-gray-300 border-t-primary"></div>
            <p className="mt-3 text-gray-600 dark:text-gray-400">Se încarcă datele...</p>
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
                Dashboard Angajat
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Bine ai venit, {profile?.firstName} {profile?.lastName}!
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

          {/* Informații profil */}
          <div className="bg-white dark:bg-dark-surface-hover shadow overflow-hidden sm:rounded-lg dark:border dark:border-dark-border mb-8">
            <div className="px-4 py-5 sm:px-6 flex flex-wrap justify-between items-center">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                  Informații angajat
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
                  {company?.name}
                </p>
              </div>
              <Link
                href="/employee/profile"
                className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-medium"
              >
                Editează profil
              </Link>
            </div>
            <div className="border-t border-gray-200 dark:border-dark-border">
              <dl>
                <div className="bg-gray-50 dark:bg-dark-surface px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Nume complet
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-gray-200 sm:mt-0 sm:col-span-2">
                    {profile?.firstName} {profile?.lastName}
                  </dd>
                </div>
                <div className="bg-white dark:bg-dark-surface-hover px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Funcție
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-gray-200 sm:mt-0 sm:col-span-2">
                    {profile?.position}
                  </dd>
                </div>
                <div className="bg-gray-50 dark:bg-dark-surface px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Departament
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-gray-200 sm:mt-0 sm:col-span-2">
                    {profile?.department}
                  </dd>
                </div>
                <div className="bg-white dark:bg-dark-surface-hover px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Manager
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-gray-200 sm:mt-0 sm:col-span-2">
                    {profile?.manager ? `${profile.manager.firstName} ${profile.manager.lastName} (${profile.manager.position})` : 'N/A'}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Cards Statistici */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
            <StatCard 
              title="Ore lucrate luna aceasta" 
              value={getWorkHoursThisMonth()} 
              icon={
                <svg className="h-6 w-6 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              } 
            />
            <StatCard 
              title="Concedii disponibile" 
              value={getLeaveBalance()} 
              icon={
                <svg className="h-6 w-6 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              } 
            />
            <StatCard 
              title="Data angajării" 
              value={profile?.hireDate ? new Date(profile.hireDate).toLocaleDateString('ro-RO') : 'N/A'} 
              icon={
                <svg className="h-6 w-6 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              } 
            />
          </div>

          {/* Acțiuni rapide */}
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Acțiuni rapide</h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
            <ActionCard 
              title="Înregistrare pontaj" 
              description="Înregistrează orele de lucru pentru ziua curentă" 
              linkText="Pontare" 
              linkHref="/employee/time-tracking"
              icon={
                <svg className="h-6 w-6 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            <ActionCard 
              title="Cerere concediu" 
              description="Solicită zile libere sau concediu" 
              linkText="Solicită concediu" 
              linkHref="/employee/leave-requests/new"
              icon={
                <svg className="h-6 w-6 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              }
            />
            <ActionCard 
              title="Vizualizare fișă de pontaj" 
              description="Vezi istoricul pontărilor și totalul orelor lucrate" 
              linkText="Vezi pontajul" 
              linkHref="/employee/time-tracking/history"
              icon={
                <svg className="h-6 w-6 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              }
            />
          </div>

          {/* Pontări recente */}
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Pontări recente</h2>
          <div className="bg-white dark:bg-dark-surface-hover shadow overflow-hidden sm:rounded-md dark:border dark:border-dark-border mb-8">
            <ul className="divide-y divide-gray-200 dark:divide-dark-border">
              {timeEntries.length > 0 ? (
                timeEntries.map((entry) => (
                  <li key={entry.id}>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-primary-600 dark:text-primary-400">
                          {new Date(entry.date).toLocaleDateString('ro-RO')}
                        </p>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                            {entry.status}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {entry.startTime} - {entry.endTime}
                          </p>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400 sm:mt-0">
                          <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <p>
                            Total: {entry.totalHours} ore
                          </p>
                        </div>
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <li className="px-4 py-5 text-center text-sm text-gray-500 dark:text-gray-400">
                  Nu există pontări recente.
                </li>
              )}
            </ul>
            {timeEntries.length > 0 && (
              <div className="bg-gray-50 dark:bg-dark-surface px-4 py-3 flex justify-center">
                <Link 
                  href="/employee/time-tracking/history" 
                  className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300"
                >
                  Vezi toate pontările
                </Link>
              </div>
            )}
          </div>

          {/* Cereri de concediu recente */}
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Cereri de concediu recente</h2>
          <div className="bg-white dark:bg-dark-surface-hover shadow overflow-hidden sm:rounded-md dark:border dark:border-dark-border mb-6">
            <ul className="divide-y divide-gray-200 dark:divide-dark-border">
              {leaveRequests.length > 0 ? (
                leaveRequests.map((request) => (
                  <li key={request.id}>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-primary-600 dark:text-primary-400">
                          {request.type}
                        </p>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${request.status === 'APPROVED' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 
                              request.status === 'REJECTED' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' : 
                              'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'}`}
                          >
                            {request.status}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {new Date(request.startDate).toLocaleDateString('ro-RO')} - {new Date(request.endDate).toLocaleDateString('ro-RO')}
                          </p>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400 sm:mt-0">
                          <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <p>
                            {request.totalDays} zile
                          </p>
                        </div>
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <li className="px-4 py-5 text-center text-sm text-gray-500 dark:text-gray-400">
                  Nu există cereri de concediu recente.
                </li>
              )}
            </ul>
            {leaveRequests.length > 0 && (
              <div className="bg-gray-50 dark:bg-dark-surface px-4 py-3 flex justify-center">
                <Link 
                  href="/employee/leave-requests" 
                  className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300"
                >
                  Vezi toate cererile
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