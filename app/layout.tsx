import './globals.css';
import Link from 'next/link';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'auto.ua',
  description: 'Простий CRUD для брендів та авто',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="uk">
      <body className="min-h-screen bg-[#f5f7fa] text-[#2c3e50] overflow-x-hidden">
        <header className="border-b border-gray-200 bg-white shadow-sm">
          <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
            <Link
              href="/"
              className="text-2xl font-bold text-[#1e88e5] hover:text-[#1565c0] transition-colors"
            >
              auto.ua
            </Link>
            <nav className="flex gap-6 text-sm">
              <Link
                href="/"
                className="text-[#2c3e50] hover:text-[#1565c0] transition-colors"
              >
                Авто
              </Link>
              <Link
                href="/cars/new"
                className="text-[#2c3e50] hover:text-[#1565c0] transition-colors"
              >
                Додати авто
              </Link>
              <Link
                href="/brands"
                className="text-[#2c3e50] hover:text-[#1565c0] transition-colors"
              >
                Бренди
              </Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-4xl px-6 py-10 mt-8 bg-white rounded-lg shadow-md">
          {children}
        </main>
      </body>
    </html>
  );
}
