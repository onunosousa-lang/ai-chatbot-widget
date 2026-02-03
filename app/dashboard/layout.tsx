'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication
    fetch('/api/auth/session')
      .then((res) => res.json())
      .then((data) => {
        if (!data.authenticated) {
          router.push('/login');
        } else {
          setLoading(false);
        }
      })
      .catch(() => {
        router.push('/login');
      });
  }, [router]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  const isActive = (path: string) =>
    pathname === path ? 'bg-purple-700' : 'hover:bg-purple-700';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-gradient-to-b from-purple-600 to-blue-600 text-white">
        <div className="p-6">
          <h1 className="text-2xl font-bold">ChatMate</h1>
          <p className="text-sm opacity-75">Dashboard</p>
        </div>

        <nav className="mt-6">
          <Link
            href="/dashboard"
            className={`block px-6 py-3 ${isActive('/dashboard')}`}
          >
            🏠 Home
          </Link>
          <Link
            href="/dashboard/assistants"
            className={`block px-6 py-3 ${isActive('/dashboard/assistants')}`}
          >
            🤖 Assistants
          </Link>
          <Link
            href="/dashboard/clients"
            className={`block px-6 py-3 ${isActive('/dashboard/clients')}`}
          >
            👥 Clients
          </Link>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-6">
          <button
            onClick={handleLogout}
            className="w-full bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition-colors"
          >
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="ml-64 p-8">{children}</div>
    </div>
  );
}
