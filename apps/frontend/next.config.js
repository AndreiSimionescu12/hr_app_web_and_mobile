/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
});

const isDevelopment = process.env.NODE_ENV === 'development';

const nextConfig = withPWA({
  reactStrictMode: true,
  // Folosim output: export doar în producție, nu în dezvoltare
  ...(isDevelopment ? {} : { output: 'export' }),
  images: {
    unoptimized: true, // Necesar pentru output: 'export'
  },
  // Proxy-ul API nu funcționează în modul export static, vom folosi URL complet în apelurile fetch
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3001/:path*', // Proxy către backend
      },
    ];
  },
});

module.exports = nextConfig; 