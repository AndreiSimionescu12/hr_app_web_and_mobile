'use client';

import { useState } from 'react';
import Link from 'next/link';
import apiClient from '@/lib/api/client';
import { Header } from '@/components/Header';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function CreateCompanyPage() {
  const [formData, setFormData] = useState({
    name: '',
    cui: '',
    adminEmail: '',
    adminPassword: '',
    address: '',
    phone: '',
    email: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // În aplicația reală, vom trimite datele către backend
      const response = await apiClient.post('/admin/create-company', formData);
      
      setSuccess('Compania a fost creată cu succes!');
      
      // Resetăm formularul
      setFormData({
        name: '',
        cui: '',
        adminEmail: '',
        adminPassword: '',
        address: '',
        phone: '',
        email: '',
      });
    } catch (err: any) {
      console.error('Eroare creare companie:', err);
      setError(err?.response?.data?.message || 'A apărut o eroare la crearea companiei.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
      <div className="flex min-h-screen flex-col">
        <Header />
        
        <div className="flex-1 p-4">
          <div className="mx-auto w-full max-w-2xl">
            <div className="mb-8 flex items-center justify-between">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-text">Creare companie nouă</h1>
              <Link
                href="/"
                className="rounded-md bg-gray-200 dark:bg-gray-700 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                Înapoi
              </Link>
            </div>

            {error && (
              <div className="mb-4 rounded-md bg-red-50 dark:bg-red-900/20 p-4 text-red-700 dark:text-red-400">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 rounded-md bg-green-50 dark:bg-green-900/20 p-4 text-green-700 dark:text-green-400">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 rounded-lg bg-white dark:bg-dark-surface p-6 shadow-md">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Nume companie *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 dark:border-dark-border px-3 py-2 shadow-sm focus:border-primary focus:outline-none dark:bg-dark-surface dark:text-dark-text"
                  />
                </div>

                <div>
                  <label htmlFor="cui" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    CUI *
                  </label>
                  <input
                    type="text"
                    id="cui"
                    name="cui"
                    required
                    value={formData.cui}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 dark:border-dark-border px-3 py-2 shadow-sm focus:border-primary focus:outline-none dark:bg-dark-surface dark:text-dark-text"
                  />
                </div>

                <div>
                  <label htmlFor="adminEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email administrator *
                  </label>
                  <input
                    type="email"
                    id="adminEmail"
                    name="adminEmail"
                    required
                    value={formData.adminEmail}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 dark:border-dark-border px-3 py-2 shadow-sm focus:border-primary focus:outline-none dark:bg-dark-surface dark:text-dark-text"
                  />
                </div>

                <div>
                  <label htmlFor="adminPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Parolă administrator *
                  </label>
                  <input
                    type="password"
                    id="adminPassword"
                    name="adminPassword"
                    required
                    value={formData.adminPassword}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 dark:border-dark-border px-3 py-2 shadow-sm focus:border-primary focus:outline-none dark:bg-dark-surface dark:text-dark-text"
                  />
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Adresă
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 dark:border-dark-border px-3 py-2 shadow-sm focus:border-primary focus:outline-none dark:bg-dark-surface dark:text-dark-text"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Telefon
                  </label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 dark:border-dark-border px-3 py-2 shadow-sm focus:border-primary focus:outline-none dark:bg-dark-surface dark:text-dark-text"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email companie
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 dark:border-dark-border px-3 py-2 shadow-sm focus:border-primary focus:outline-none dark:bg-dark-surface dark:text-dark-text"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-md bg-primary px-4 py-2 text-white hover:bg-blue-700 focus:outline-none disabled:bg-gray-400"
                >
                  {loading ? 'Se procesează...' : 'Creează companie'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 