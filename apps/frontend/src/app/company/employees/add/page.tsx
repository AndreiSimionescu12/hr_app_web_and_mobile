'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { useAuth } from '@/lib/auth/AuthContext';
import apiClient from '@/lib/api/client';

// Definim tipul de manager pentru dropdown
interface Manager {
  id: string;
  firstName: string;
  lastName: string;
  position: string;
}

// Definim tipul pentru departamente (va fi inițial un array gol, dar se populează din backend)
type Department = string;

// Interfață pentru datele de telefon
interface PhoneInput {
  id: string;
  number: string;
  type: string;
}

// Extinde tipul de utilizator local pentru această componentă
interface ExtendedUser {
  id: string;
  email: string;
  role: string;
  companyId?: string;
  employeeId?: string;
}

export default function AddEmployeePage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [managers, setManagers] = useState<Manager[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);

  // Cast user pentru a folosi proprietatea extendedUser.employeeId
  const extendedUser = user as ExtendedUser | null;

  // State pentru datele formularului
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    cnp: '',
    address: '',
    birthDate: '',
    hireDate: new Date().toISOString().substring(0, 10), // Data curentă ca default
    position: '',
    department: '',
    managerId: '',
    phones: [] as PhoneInput[],
  });

  // Stare pentru un număr de telefon nou
  const [newPhone, setNewPhone] = useState({
    number: '',
    type: 'personal', // Default value
  });

  // Verificăm autentificarea și permisiunile
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (user?.role !== 'SUPER_ADMIN' && user?.role !== 'COMPANY_ADMIN' && user?.role !== 'MANAGER') {
      router.push('/unauthorized');
      return;
    }

    // Încărcăm managerii și departamentele disponibile
    loadManagers();
    loadDepartments();
  }, [isAuthenticated, user, router]);

  // Încărcăm managerii disponibili din backend
  const loadManagers = async () => {
    try {
      const response = await apiClient.get('/employees?role=manager');
      setManagers(response.data);
    } catch (err) {
      console.error('Eroare la încărcarea managerilor:', err);
    }
  };

  // Încărcăm departamentele disponibile
  const loadDepartments = async () => {
    try {
      // Simulăm un array de departamente - în producție, acesta ar veni de la backend
      setDepartments(['IT', 'HR', 'Finance', 'Marketing', 'Operations', 'Sales']);
    } catch (err) {
      console.error('Eroare la încărcarea departamentelor:', err);
    }
  };

  // Funcție pentru actualizarea datelor formularului
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Funcție pentru actualizarea telefonului nou
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewPhone({
      ...newPhone,
      [name]: value,
    });
  };

  // Funcție pentru adăugarea unui telefon nou
  const handleAddPhone = () => {
    if (newPhone.number.trim() === '') return;

    setFormData({
      ...formData,
      phones: [
        ...formData.phones,
        {
          id: Date.now().toString(), // ID temporar pentru frontend
          ...newPhone,
        },
      ],
    });

    // Resetăm starea telefonului nou
    setNewPhone({
      number: '',
      type: 'personal',
    });
  };

  // Funcție pentru ștergerea unui telefon
  const handleRemovePhone = (id: string) => {
    setFormData({
      ...formData,
      phones: formData.phones.filter(phone => phone.id !== id),
    });
  };

  // Funcție pentru trimiterea datelor la backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Formăm payload-ul pentru API
      const payload = {
        ...formData,
        // Dacă userul este Manager și nu s-a selectat alt manager, setăm managerul ca fiind utilizatorul curent
        managerId: formData.managerId || (user?.role === 'MANAGER' ? extendedUser?.employeeId : undefined),
      };

      // Facem request la API
      await apiClient.post('/employees', payload);

      setSuccess(true);
      // Resetăm formularul după succes
      setFormData({
        firstName: '',
        lastName: '',
        cnp: '',
        address: '',
        birthDate: '',
        hireDate: new Date().toISOString().substring(0, 10),
        position: '',
        department: '',
        managerId: '',
        phones: [],
      });

      // După 2 secunde, redirecționăm la lista de angajați
      setTimeout(() => {
        router.push('/company/employees');
      }, 2000);
    } catch (err: any) {
      console.error('Eroare la adăugarea angajatului:', err);
      setError(err?.response?.data?.message || 'A apărut o eroare la adăugarea angajatului.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1 bg-gray-50 dark:bg-dark-surface">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:text-3xl">
                Adaugă Angajat Nou
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Completați informațiile pentru noul angajat
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Link
                href="/company/employees"
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-dark-border rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-dark-surface-hover hover:bg-gray-50 dark:hover:bg-dark-border focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-dark-surface"
              >
                <svg className="-ml-1 mr-2 h-5 w-5 text-gray-500 dark:text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Înapoi la angajați
              </Link>
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded-md bg-danger-50 dark:bg-danger-900/20 p-4 text-danger-700 dark:text-danger-400">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 rounded-md bg-success-50 dark:bg-success-900/20 p-4 text-success-700 dark:text-success-400">
              Angajat adăugat cu succes! Veți fi redirecționat la lista de angajați...
            </div>
          )}

          <div className="bg-white dark:bg-dark-surface-hover shadow-sm rounded-lg dark:border dark:border-dark-border overflow-hidden">
            <form onSubmit={handleSubmit} className="divide-y divide-gray-200 dark:divide-dark-border">
              {/* Secțiunea informații personale */}
              <div className="p-6 space-y-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                  Informații personale
                </h3>
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Prenume
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="firstName"
                        id="firstName"
                        required
                        value={formData.firstName}
                        onChange={handleChange}
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 dark:border-dark-border rounded-md dark:bg-dark-input dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Nume
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="lastName"
                        id="lastName"
                        required
                        value={formData.lastName}
                        onChange={handleChange}
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 dark:border-dark-border rounded-md dark:bg-dark-input dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="cnp" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      CNP
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="cnp"
                        id="cnp"
                        value={formData.cnp}
                        onChange={handleChange}
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 dark:border-dark-border rounded-md dark:bg-dark-input dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Data nașterii
                    </label>
                    <div className="mt-1">
                      <input
                        type="date"
                        name="birthDate"
                        id="birthDate"
                        value={formData.birthDate}
                        onChange={handleChange}
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 dark:border-dark-border rounded-md dark:bg-dark-input dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-6">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Adresa
                    </label>
                    <div className="mt-1">
                      <textarea
                        name="address"
                        id="address"
                        rows={3}
                        value={formData.address}
                        onChange={handleChange}
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 dark:border-dark-border rounded-md dark:bg-dark-input dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Numere de telefon */}
                  <div className="sm:col-span-6">
                    <div className="flex justify-between items-center">
                      <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Numere de telefon
                      </label>
                    </div>
                    
                    <div className="mt-2 grid grid-cols-1 gap-y-2">
                      {formData.phones.map((phone) => (
                        <div key={phone.id} className="flex items-center space-x-2">
                          <div className="flex-1 bg-gray-50 dark:bg-dark-surface p-2 rounded-md text-sm text-gray-700 dark:text-gray-300">
                            <span className="font-semibold">{phone.type === 'personal' ? 'Personal' : 'Serviciu'}:</span> {phone.number}
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemovePhone(phone.id)}
                            className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-danger-600 hover:bg-danger-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-danger-500"
                          >
                            <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="mt-3 flex space-x-2">
                      <div className="w-1/3">
                        <select
                          name="type"
                          value={newPhone.type}
                          onChange={handlePhoneChange}
                          className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 dark:border-dark-border rounded-md dark:bg-dark-input dark:text-white"
                        >
                          <option value="personal">Personal</option>
                          <option value="work">Serviciu</option>
                        </select>
                      </div>
                      <div className="flex-1">
                        <input
                          type="text"
                          name="number"
                          placeholder="Adaugă un număr de telefon"
                          value={newPhone.number}
                          onChange={handlePhoneChange}
                          className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 dark:border-dark-border rounded-md dark:bg-dark-input dark:text-white"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleAddPhone}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        Adaugă
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Secțiunea informații profesionale */}
              <div className="p-6 space-y-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                  Informații profesionale
                </h3>
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label htmlFor="position" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Funcție
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="position"
                        id="position"
                        required
                        value={formData.position}
                        onChange={handleChange}
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 dark:border-dark-border rounded-md dark:bg-dark-input dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="department" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Departament
                    </label>
                    <div className="mt-1">
                      <select
                        id="department"
                        name="department"
                        required
                        value={formData.department}
                        onChange={handleChange}
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 dark:border-dark-border rounded-md dark:bg-dark-input dark:text-white"
                      >
                        <option value="">Selectați un departament</option>
                        {departments.map((department) => (
                          <option key={department} value={department}>
                            {department}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="hireDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Data angajării
                    </label>
                    <div className="mt-1">
                      <input
                        type="date"
                        name="hireDate"
                        id="hireDate"
                        required
                        value={formData.hireDate}
                        onChange={handleChange}
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 dark:border-dark-border rounded-md dark:bg-dark-input dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="managerId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Manager direct
                    </label>
                    <div className="mt-1">
                      <select
                        id="managerId"
                        name="managerId"
                        value={formData.managerId}
                        onChange={handleChange}
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 dark:border-dark-border rounded-md dark:bg-dark-input dark:text-white"
                      >
                        <option value="">Fără manager direct</option>
                        {managers.map((manager) => (
                          <option key={manager.id} value={manager.id}>
                            {manager.firstName} {manager.lastName} ({manager.position})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Buton Submit */}
              <div className="px-6 py-4 bg-gray-50 dark:bg-dark-surface flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-primary-700 dark:hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Se procesează...
                    </span>
                  ) : 'Adaugă angajat'}
                </button>
              </div>
            </form>
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