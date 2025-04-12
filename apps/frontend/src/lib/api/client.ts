'use client';

import axios from 'axios';

// Configurare variabilă în funcție de mediu (web vs. mobile)
const getBaseUrl = () => {
  // Platformă mobilă sau dev sau production
  const environment = process.env.NODE_ENV;
  const isCapacitor = typeof window !== 'undefined' && 
                      typeof (window as any)?.Capacitor !== 'undefined';

  if (isCapacitor) {
    // Pentru aplicația mobilă, folosim URL-ul complet al serverului
    return 'http://192.168.1.100:3001'; // Înlocuiește cu IP-ul serverului tău
  }

  if (environment === 'development') {
    // În dezvoltare, folosim proxy-ul din Next.js
    return '/api';
  }

  // În producție, folosim URL-ul complet
  return 'https://api.yourdomain.com';
};

const apiClient = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Adaugăm interceptor pentru a include token-ul de autentificare
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient; 