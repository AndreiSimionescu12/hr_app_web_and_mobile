'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { useAuth } from '@/lib/auth/AuthContext';
import apiClient from '@/lib/api/client';

// Interfața pentru tipul de date Employee
interface Phone {
  id: string;
  number: string;
  type: string;
}

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  position: string;
  department: string;
  hireDate: string;
  cnp?: string;
  address?: string;
  birthDate?: string;
  managerId?: string;
  manager?: {
    id: string;
    firstName: string;
    lastName: string;
    position: string;
  };
  phones: Phone[];
  _count?: {
    subordinates: number;
  };
}

// Extinde tipul de utilizator local pentru această componentă
interface ExtendedUser {
  id: string;
  email: string;
  role: string;
  companyId?: string;
  employeeId?: string;
}

export default function EmployeesPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [departments, setDepartments] = useState<string[]>([]);

  // Cast user pentru a folosi proprietatea extendedUser.employeeId
  const extendedUser = user as ExtendedUser | null;

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (user?.role !== 'SUPER_ADMIN' && user?.role !== 'COMPANY_ADMIN' && user?.role !== 'MANAGER') {
      router.push('/unauthorized');
      return;
    }

    loadEmployees();
  }, [isAuthenticated, user, router]);

  const loadEmployees = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await apiClient.get('/employees');
      const data = response.data;
      setEmployees(data);

      // Extrage departamentele unice pentru filtru
      const uniqueDepartments = Array.from(
        new Set(
          data
            .map((employee: Employee) => employee.department)
            .filter(Boolean)
        )
      ) as string[];
      setDepartments(uniqueDepartments);
    } catch (err: any) {
      console.error('Eroare la încărcarea angajaților:', err);
      setError(err?.response?.data?.message || 'Eroare la încărcarea angajaților');
    } finally {
      setLoading(false);
    }
  };

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = 
      employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (employee.department && employee.department.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesDepartment = !departmentFilter || employee.department === departmentFilter;
    
    return matchesSearch && matchesDepartment;
  });

  const handleAddEmployee = () => {
    router.push('/company/employees/add');
  };

  const handleViewEmployee = (id: string) => {
    router.push(`/company/employees/${id}`);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1 bg-gray-50 dark:bg-dark-surface">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="mb-8 md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:text-3xl">
                Angajați
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Gestionați angajații companiei dumneavoastră
              </p>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4">
              {(user?.role === 'SUPER_ADMIN' || user?.role === 'COMPANY_ADMIN' || 
                (user?.role === 'MANAGER' && extendedUser?.employeeId)) && (
                <button
                  type="button"
                  onClick={handleAddEmployee}
                  className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-dark-surface"
                >
                  <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Adaugă angajat
                </button>
              )}
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded-md bg-danger-50 dark:bg-danger-900/20 p-4 text-danger-700 dark:text-danger-400">
              {error}
            </div>
          )}

          <div className="bg-white dark:bg-dark-surface-hover shadow-sm rounded-lg dark:border dark:border-dark-border overflow-hidden mb-8">
            <div className="p-4 border-b border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-dark-surface">
              <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4">
                <div className="flex-1">
                  <label htmlFor="search" className="sr-only">Caută</label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400 dark:text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      name="search"
                      id="search"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="block w-full pl-10 sm:text-sm border-gray-300 dark:border-dark-border rounded-md dark:bg-dark-input dark:text-white focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Caută angajați după nume, funcție, etc."
                    />
                  </div>
                </div>

                <div className="w-full md:w-64">
                  <label htmlFor="department" className="sr-only">Departament</label>
                  <select
                    id="department"
                    name="department"
                    value={departmentFilter}
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                    className="block w-full sm:text-sm border-gray-300 dark:border-dark-border rounded-md dark:bg-dark-input dark:text-white focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">Toate departamentele</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="inline-flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary-600 dark:text-primary-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Se încarcă...
                  </div>
                </div>
              ) : filteredEmployees.length === 0 ? (
                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                  {searchTerm || departmentFilter ? 'Nu s-au găsit angajați care să corespundă criteriilor de căutare.' : 'Nu există angajați.'}
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200 dark:divide-dark-border">
                  <thead className="bg-gray-50 dark:bg-dark-surface">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Nume
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Funcție
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Departament
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Manager
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Data angajării
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Acțiuni</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-dark-surface-hover divide-y divide-gray-200 dark:divide-dark-border">
                    {filteredEmployees.map((employee) => (
                      <tr key={employee.id} className="hover:bg-gray-50 dark:hover:bg-dark-border transition-colors cursor-pointer" onClick={() => handleViewEmployee(employee.id)}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                              <span className="text-primary-600 dark:text-primary-400 font-medium text-sm">
                                {employee.firstName.charAt(0)}{employee.lastName.charAt(0)}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {employee.firstName} {employee.lastName}
                              </div>
                              {employee._count?.subordinates && employee._count.subordinates > 0 && (
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  {employee._count.subordinates} subordonat{employee._count.subordinates !== 1 ? 'i' : ''}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                          {employee.position || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                          {employee.department || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                          {employee.manager ? `${employee.manager.firstName} ${employee.manager.lastName}` : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                          {new Date(employee.hireDate).toLocaleDateString('ro-RO')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewEmployee(employee.id);
                            }}
                            className="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300"
                          >
                            Detalii
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
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