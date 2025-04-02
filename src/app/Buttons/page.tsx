import Link from 'next/link';

export default function ButtonsPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Select Run Phase</h1>
      <div className="space-x-4">
        <Link href="/home">
          <button className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition">
            Pre Run
          </button>
        </Link>
        <Link href="/postrun">
          <button className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition">
            Post Run
          </button>
        </Link>
      </div>
    </div>
  );
}
