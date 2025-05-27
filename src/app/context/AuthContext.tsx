'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { useRouter, usePathname } from 'next/navigation';

type User = { id: string; email: string; name?: string; role?: string } | null;
type AuthContextType = {
  user: User;
  loading: boolean;
  logout: () => Promise<void>;
  refreshUserData: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: async () => {},
  refreshUserData: async () => {},
});

export const useAuth = () => useContext(AuthContext);

// pages that don’t require auth
const PUBLIC_PAGES = ['/login', '/signup', '/emailpage'];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]       = useState<User>(null);
  const [loading, setLoading] = useState(true);
  const router                = useRouter();
  const rawPath               = usePathname();
  const pathname              = rawPath ?? "";

  const refreshUserData = async () => {
    setLoading(true);

    // If we’re on a public page, don’t redirect on 401
    if (PUBLIC_PAGES.includes(pathname)) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/user', { credentials: 'include' });

      if (res.status === 401) {
        // only redirect to login if we're on a protected page
        router.replace('/login');
        setUser(null);
        return;
      }

      if (!res.ok) {
        console.error('Unexpected /api/user status:', res.status);
        setUser(null);
        return;
      }

      const data: User = await res.json();
      setUser(data);
    } catch (err) {
      console.error('refreshUserData failed:', err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      router.replace('/login');
    }
  };

  useEffect(() => {
    refreshUserData();
  }, [pathname]); // re-run if route changes

  return (
    <AuthContext.Provider
      value={{ user, loading, logout, refreshUserData }}
    >
      {children}
    </AuthContext.Provider>
  );
}
