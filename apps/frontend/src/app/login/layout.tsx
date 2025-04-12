'use client';

import { Header } from '@/components/Header';

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
} 