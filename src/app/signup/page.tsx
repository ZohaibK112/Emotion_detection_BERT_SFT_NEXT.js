// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';

// export default function SignupPage() {
//   const router = useRouter();
//   const [name, setName]             = useState('');
//   const [email, setEmail]           = useState('');
//   const [password, setPassword]     = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [error, setError]           = useState<string | null>(null);
//   const [loading, setLoading]       = useState(false);

//   const isValidEmail = (e: string) => /\S+@\S+\.\S+/.test(e);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError(null);

//     if (!name.trim()) {
//       setError('Name is required');
//       return;
//     }
//     if (!isValidEmail(email)) {
//       setError('Please enter a valid email');
//       return;
//     }
//     if (password.length < 6) {
//       setError('Password must be at least 6 characters');
//       return;
//     }
//     if (password !== confirmPassword) {
//       setError("Passwords don't match");
//       return;
//     }

//     setLoading(true);
//     try {
//       const res = await fetch('/api/auth/signup', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ name, email, password }),
//       });
//       const data = await res.json();

//       if (res.ok && data.success) {
//         router.push('/emailpage');
//       } else {
//         setError(data.error || data.message || 'Signup failed');
//       }
//     } catch (err) {
//       console.error('Signup error:', err);
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
//         <h1 className="text-2xl font-bold text-center mb-6">Create Account</h1>

//         {error && (
//           <div className="mb-4 text-red-600 text-center">{error}</div>
//         )}

//         <label className="block mb-4">
//           <span className="text-sm font-medium">Name</span>
//           <input
//             type="text"
//             value={name}
//             onChange={e => setName(e.target.value)}
//             className="mt-1 block w-full px-3 py-2 border rounded focus:outline-none focus:ring"
//             disabled={loading}
//           />
//         </label>

//         <label className="block mb-4">
//           <span className="text-sm font-medium">Email</span>
//           <input
//             type="email"
//             value={email}
//             onChange={e => setEmail(e.target.value)}
//             className="mt-1 block w-full px-3 py-2 border rounded focus:outline-none focus:ring"
//             disabled={loading}
//           />
//         </label>

//         <label className="block mb-4">
//           <span className="text-sm font-medium">Password</span>
//           <input
//             type="password"
//             value={password}
//             onChange={e => setPassword(e.target.value)}
//             className="mt-1 block w-full px-3 py-2 border rounded focus:outline-none focus:ring"
//             disabled={loading}
//           />
//         </label>

//         <label className="block mb-6">
//           <span className="text-sm font-medium">Confirm Password</span>
//           <input
//             type="password"
//             value={confirmPassword}
//             onChange={e => setConfirmPassword(e.target.value)}
//             className="mt-1 block w-full px-3 py-2 border rounded focus:outline-none focus:ring"
//             disabled={loading}
//           />
//         </label>

//         <button
//           type="submit"
//           disabled={loading}
//           className={`w-full py-2 rounded text-white transition ${
//             loading ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'
//           }`}
//         >
//           {loading ? 'Signing Up…' : 'Sign Up'}
//         </button>

//         <p className="mt-4 text-center text-sm text-gray-600">
//           Already have an account?{' '}
//           <a href="/login" className="text-blue-600 hover:underline">
//             Log in
//           </a>
//         </p>
//       </form>
//     </div>
//   );
// }


'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName]                         = useState('');
  const [email, setEmail]                       = useState('');
  const [password, setPassword]                 = useState('');
  const [confirmPassword, setConfirmPassword]   = useState('');
  const [error, setError]                       = useState<string | null>(null);
  const [loading, setLoading]                   = useState(false);

  const isValidEmail = (e: string) => /\S+@\S+\.\S+/.test(e);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Name is required');
      return;
    }
    if (!isValidEmail(email)) {
      setError('Please enter a valid email');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        router.push('/emailpage');
      } else {
        setError(data.error || data.message || 'Signup failed');
      }
    } catch (err) {
      console.error('Signup error:', err);
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
        <h1 className="text-2xl font-bold text-center mb-6">Create Account</h1>

        {error && (
          <div className="mb-4 text-red-600 text-center">{error}</div>
        )}

        <label className="block mb-4">
          <span className="text-sm font-medium">Name</span>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Your full name"
            className="mt-1 block w-full px-3 py-2 border rounded focus:outline-none focus:ring"
            disabled={loading}
          />
        </label>

        <label className="block mb-4">
          <span className="text-sm font-medium">Email</span>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="mt-1 block w-full px-3 py-2 border rounded focus:outline-none focus:ring"
            disabled={loading}
          />
        </label>

        <label className="block mb-4">
          <span className="text-sm font-medium">Password</span>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="At least 6 characters"
            className="mt-1 block w-full px-3 py-2 border rounded focus:outline-none focus:ring"
            disabled={loading}
          />
        </label>

        <label className="block mb-6">
          <span className="text-sm font-medium">Confirm Password</span>
          <input
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            placeholder="Re-enter your password"
            className="mt-1 block w-full px-3 py-2 border rounded focus:outline-none focus:ring"
            disabled={loading}
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded text-white transition ${
            loading ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Signing Up…' : 'Sign Up'}
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <a href="/login" className="text-blue-600 hover:underline">
            Log in
          </a>
        </p>
      </form>
    </div>
  );
}
