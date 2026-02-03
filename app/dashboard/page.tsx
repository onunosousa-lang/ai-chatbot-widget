'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    assistants: 0,
    clients: 0,
    active: 0,
  });

  useEffect(() => {
    // Load stats
    Promise.all([
      fetch('/api/assistants').then((r) => r.json()),
      fetch('/api/clients').then((r) => r.json()),
    ]).then(([assistants, clients]) => {
      setStats({
        assistants: assistants.assistants?.length || 0,
        clients: clients.clients?.length || 0,
        active:
          clients.clients?.filter((c: any) => c.metadata?.status === 'active')
            .length || 0,
      });
    });
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-2">Total Assistants</div>
          <div className="text-3xl font-bold text-purple-600">
            {stats.assistants}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-2">Total Clients</div>
          <div className="text-3xl font-bold text-blue-600">
            {stats.clients}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-2">Active Clients</div>
          <div className="text-3xl font-bold text-green-600">
            {stats.active}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/dashboard/assistants/new"
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-4 rounded-lg font-semibold text-center transition-colors"
          >
            ➕ Create New Assistant
          </Link>
          <Link
            href="/dashboard/clients/new"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-lg font-semibold text-center transition-colors"
          >
            ➕ Create New Client
          </Link>
        </div>
      </div>
    </div>
  );
}
