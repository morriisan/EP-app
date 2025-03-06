'use client';

import { useState } from 'react';
import UserList from '@/components/UserList';
import UserForm from '@/components/UserForm';

export default function Home() {
  // State to trigger user list refresh
  const [refreshKey, setRefreshKey] = useState(0);

  // Function to refresh the user list
  const handleUserAdded = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Next.js with Prisma and PostgreSQL</h1>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* User Form */}
            <div className="md:col-span-1">
              <UserForm onUserAdded={handleUserAdded} />
            </div>
            
            {/* User List */}
            <div className="md:col-span-2">
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">User List</h2>
                <UserList key={refreshKey} />
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-white shadow mt-8 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            Next.js + Prisma + PostgreSQL Demo Application
          </p>
        </div>
      </footer>
    </div>
  );
}
