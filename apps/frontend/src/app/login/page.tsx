'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await login(email, password);
      // Redirecționarea se face în AuthContext
    } catch (err) {
      setError('Credențiale invalide. Vă rugăm să încercați din nou.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white dark:bg-dark-surface p-8 shadow-md">
        <div>
          <h1 className="text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-dark-text">
            Autentificare
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Introduceți datele de autentificare
          </p>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="-space-y-px rounded-md shadow-sm">
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 dark:border-dark-border px-3 py-2 text-gray-900 dark:text-dark-text dark:bg-dark-surface placeholder-gray-500 dark:placeholder-gray-400 focus:z-10 focus:border-primary focus:outline-none"
                placeholder="Email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Parolă
              </label>
              <input
                id="password"
                type="password"
                required
                className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 dark:border-dark-border px-3 py-2 text-gray-900 dark:text-dark-text dark:bg-dark-surface placeholder-gray-500 dark:placeholder-gray-400 focus:z-10 focus:border-primary focus:outline-none"
                placeholder="Parolă"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none disabled:bg-blue-400"
            >
              {loading ? 'Se procesează...' : 'Autentificare'}
            </button>
          </div>
        </form>

        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Utilizatori de test disponibili:</h3>
          <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
            <li><strong>Super Admin:</strong> admin@test.com / admin123</li>
            <li><strong>Admin Companie:</strong> company@test.com / company123</li>
            <li><strong>Manager:</strong> manager@test.com / manager123</li>
            <li><strong>Angajat:</strong> employee@test.com / employee123</li>
          </ul>
        </div>

        <div className="mt-4 text-center">
          <a
            className="text-sm text-primary dark:text-dark-primary hover:text-blue-700 dark:hover:text-blue-400"
            href="/"
          >
            Înapoi la pagina principală
          </a>
        </div>
      </div>
    </div>
  );
} 