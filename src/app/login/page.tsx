// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';

// export default function LoginPage() {
//   const router = useRouter();
//   const [email, setEmail]       = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError]       = useState<string | null>(null);
//   const [loading, setLoading]   = useState(false);

//   const isValidEmail = (e: string) => /\S+@\S+\.\S+/.test(e);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError(null);

//     if (!isValidEmail(email)) {
//       setError('Please enter a valid email.');
//       return;
//     }
//     if (!password) {
//       setError('Password is required.');
//       return;
//     }

//     setLoading(true);
//     try {
//       const res = await fetch('/api/auth/login', {
//         method: 'POST',
//         credentials: 'include',      // include cookies
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, password }),
//       });
//       const data = await res.json();

//       if (res.ok && data.success) {
//         // instead of Buttons, always go through email verification
//         router.replace('/emailpage');
//       } else {
//         setError(data.error || 'Login failed. Please try again.');
//       }
//     } catch (err) {
//       console.error('Login error:', err);
//       setError('Network error. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
//       <form
//         onSubmit={handleSubmit}
//         className="w-full max-w-md bg-white p-8 rounded-lg shadow"
//       >
//         <h1 className="text-2xl font-bold text-center mb-6">Log In</h1>

//         {error && (
//           <div className="mb-4 text-red-600 text-center">{error}</div>
//         )}

//         <label className="block mb-4">
//           <span className="text-sm font-medium">Email</span>
//           <input
//             type="email"
//             value={email}
//             onChange={e => setEmail(e.target.value)}
//             className="mt-1 block w-full px-3 py-2 border rounded focus:outline-none focus:ring"
//             disabled={loading}
//             required
//           />
//         </label>

//         <label className="block mb-6">
//           <span className="text-sm font-medium">Password</span>
//           <input
//             type="password"
//             value={password}
//             onChange={e => setPassword(e.target.value)}
//             className="mt-1 block w-full px-3 py-2 border rounded focus:outline-none focus:ring"
//             disabled={loading}
//             required
//           />
//         </label>

//         <button
//           type="submit"
//           disabled={loading}
//           className={`w-full py-2 rounded text-white transition ${
//             loading ? 'bg-green-300' : 'bg-green-600 hover:bg-green-700'
//           }`}
//         >
//           {loading ? 'Logging In…' : 'Log In'}
//         </button>

//         <p className="mt-4 text-center text-sm text-gray-600">
//           Don’t have an account?{' '}
//           <a href="/signup" className="text-blue-600 hover:underline">
//             Sign up
//           </a>
//         </p>
//       </form>
//     </div>
//   );
// }


'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState<string | null>(null);
  const [loading, setLoading]   = useState(false);

  const isValidEmail = (e: string) => /\S+@\S+\.\S+/.test(e);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isValidEmail(email)) {
      setError('Please enter a valid email.');
      return;
    }
    if (!password) {
      setError('Password is required.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_LOGIN_URL}`, {
        method: 'POST',
        credentials: 'include',      // include cookies
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        // instead of Buttons, always go through email verification
        router.replace('/emailpage');
      } else {
        setError(data.error || 'Login failed. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-8 rounded-lg shadow"
      >
        <h1 className="text-2xl font-bold text-center mb-6">Log In</h1>

        {error && (
          <div className="mb-4 text-red-600 text-center">{error}</div>
        )}

        <label className="block mb-4">
          <span className="text-sm font-medium">Email</span>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="mt-1 block w-full px-3 py-2 border rounded focus:outline-none focus:ring"
            disabled={loading}
            required
          />
        </label>

        <label className="block mb-6">
          <span className="text-sm font-medium">Password</span>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="mt-1 block w-full px-3 py-2 border rounded focus:outline-none focus:ring"
            disabled={loading}
            required
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded text-white transition ${
            loading ? 'bg-green-300' : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {loading ? 'Logging In…' : 'Log In'}
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don’t have an account?{' '}
          <a href="/signup" className="text-blue-600 hover:underline">
            Sign up
          </a>
        </p>
      </form>
    </div>
  );
}
