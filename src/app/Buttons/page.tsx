'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type User = { id: string; name?: string; email: string };

export default function ButtonsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser]       = useState<User | null>(null);

  useEffect(() => {
    async function loadUser() {
      try {
        // 1) Try fetch /api/user with cookie
        const res = await fetch('https://zohaibk112-the-runners-bert-emotions.hf.space/api/user', { credentials: 'include' });
        if (res.status === 401) {
          // Not logged in – go to login
          router.replace('/login');
          return;
        }
        if (!res.ok) {
          throw new Error(`Unexpected status ${res.status}`);
        }
        const data: User = await res.json();
        setUser(data);
      } catch (err) {
        console.error('Auth check failed on ButtonsPage:', err);
        router.replace('/login');
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, [router]);

  if (loading) {
    return (
      <main className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Loading…</p>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-2">
        Welcome{user?.name ? `, ${user.name}` : ''}!
      </h1>
      <p className="text-gray-700 mb-6">Select your run phase:</p>

      <div className="flex flex-col space-y-4 w-full max-w-xs">
        <Link href="/home">
          <button className="w-full py-3 bg-blue-500 text-white rounded hover:bg-blue-600">
            Pre Run
          </button>
        </Link>
        <Link href="/postrun">
          <button className="w-full py-3 bg-green-500 text-white rounded hover:bg-green-600">
            Post Run
          </button>
        </Link>
        <Link href="/weeklyanalysis">
          <button className="w-full py-3 bg-purple-500 text-white rounded hover:bg-purple-600">
            Weekly Analysis
          </button>
        </Link>
      </div>
    </main>
  );
}
