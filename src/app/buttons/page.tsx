'use client';
import { useState, useEffect } from 'react';
import { useRouter }            from 'next/navigation';
import Link                     from 'next/link';

type User = { id: string; name?: string; email: string };

export default function ButtonsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser]       = useState<User | null>(null);

  useEffect(() => {
    fetch('/api/user', { credentials: 'include' })
      .then(res => {
        if (res.status === 401) throw new Error('Unauthorized');
        if (!res.ok) throw new Error(`Status ${res.status}`);
        return res.json();
      })
      .then((data: User) => setUser(data))
      .catch(() => router.replace('/login'))
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return <p className="text-gray-600">Loading…</p>;
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-4">
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
