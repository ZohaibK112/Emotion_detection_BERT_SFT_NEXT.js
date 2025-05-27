// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import LogoutButton from '@/components/LogoutButton';

// import {
//   BarChart,
//   Bar,
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
//   Cell,
// } from 'recharts';

// const BACKEND = 'http://localhost:8000';

// type ResponseItem = {
//   text: string;
//   emotion?: string;
//   score?: number;
// };

// export default function HomePage() {
//   const router = useRouter();
//   const [loading, setLoading]         = useState(true);
//   const [userEmail, setUserEmail]     = useState<string | null>(null);
//   const [showResults, setShowResults] = useState(false);
//   const [responses, setResponses]     = useState<ResponseItem[]>(
//     Array(5).fill({ text: '', emotion: undefined, score: undefined })
//   );

//   const questions = [
//     'How are you feeling before the run?',
//     'What is your energy level right now?',
//     'Are you motivated to complete your run?',
//     'How well did you sleep last night?',
//     'Do you feel any muscle soreness before running?',
//   ];

//   // Build chart data from completed responses
//   const chartData = responses
//     .filter(r => r.emotion)
//     .map((r, i) => ({
//       question: `Q${i + 1}`,
//       score: r.score || 0,
//       emotion: r.emotion!,
//       date: new Date().toISOString().split('T')[0],
//     }));

//   // 1) Check auth & get email
//   useEffect(() => {
//     async function verifyUser() {
//       try {
//         const res = await fetch(`${BACKEND}/user/profile`, {
//           credentials: 'include',
//         });
//         if (res.status === 401) {
//           router.replace('/login');
//           return;
//         }
//         const user = await res.json();
//         setUserEmail(user.email);
//       } catch {
//         router.replace('/login');
//       } finally {
//         setLoading(false);
//       }
//     }
//     verifyUser();
//   }, [router]);

//   // 2) Submit to FastAPI /predict
//   const handleSubmit = async () => {
//     if (responses.some(r => !r.text.trim())) {
//       alert('Please answer all questions');
//       return;
//     }
//     setLoading(true);
//     try {
//       const updated = [...responses];
//       for (let i = 0; i < questions.length; i++) {
//         const r = updated[i];
//         const res = await fetch(`${BACKEND}/predict`, {
//           method: 'POST',
//           credentials: 'include',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ text: r.text, phase: 'pre_run' }),
//         });
//         if (!res.ok) throw new Error('Predict failed');
//         const json = await res.json();
//         updated[i] = { text: r.text, emotion: json.emotion, score: json.score };
//       }
//       setResponses(updated);
//       setShowResults(true);
//     } catch (err) {
//       console.error(err);
//       alert('Failed to get results.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = (idx: number, text: string) => {
//     const copy = [...responses];
//     copy[idx] = { ...copy[idx], text };
//     setResponses(copy);
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-100">
//         <div className="text-xl">Loading…</div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen flex flex-col bg-gray-100 p-4">
//       <header className="bg-white shadow p-4 flex justify-between items-center mb-6">
//         <h1 className="text-xl font-bold">The Runner&apos;s Mood Tracker</h1>
//         <div className="flex items-center gap-4">
//           {userEmail && <span className="text-gray-600">{userEmail}</span>}
//           <LogoutButton />
//         </div>
//       </header>

//       <main className="mx-auto max-w-4xl bg-white rounded shadow p-6">
//         {showResults ? (
//           <div className="space-y-8">
//             <div className="flex justify-between items-center">
//               <h2 className="text-2xl font-bold">Your Mood Analysis</h2>
//               <button
//                 onClick={() => {
//                   setShowResults(false);
//                   setResponses(questions.map(() => ({ text: '' })));
//                 }}
//                 className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//               >
//                 Start New Assessment
//               </button>
//             </div>

//             {chartData.length > 0 && (
//               <>
//                 {/* Bar Chart */}
//                 <div className="p-4 border rounded-lg">
//                   <h3 className="text-lg font-semibold mb-4">
//                     Emotional Score Chart (Bar)
//                   </h3>
//                   <ResponsiveContainer width="100%" height={300}>
//                     <BarChart data={chartData}>
//                       <XAxis
//                         dataKey="question"
//                         tickFormatter={v => v}
//                       />
//                       <YAxis domain={[0, 1]} />
//                       <Tooltip />
//                       <Legend />
//                       <Bar dataKey="score" name="Score">
//                         {chartData.map((entry, idx) => (
//                           <Cell
//                             key={idx}
//                             fill={entry.score! <= 0.5 ? '#FF5733' : '#36A2EB'}
//                           />
//                         ))}
//                       </Bar>
//                     </BarChart>
//                   </ResponsiveContainer>
//                 </div>

//                 {/* Line Chart */}
//                 <div className="p-4 border rounded-lg">
//                   <h3 className="text-lg font-semibold mb-4">
//                     Emotional Score Trend (Line)
//                   </h3>
//                   <ResponsiveContainer width="100%" height={300}>
//                     <LineChart data={chartData}>
//                       <XAxis dataKey="question" />
//                       <YAxis domain={[0, 1]} />
//                       <Tooltip />
//                       <Legend />
//                       <Line
//                         type="monotone"
//                         dataKey="score"
//                         stroke="#36A2EB"
//                         strokeWidth={3}
//                       />
//                     </LineChart>
//                   </ResponsiveContainer>
//                 </div>
//               </>
//             )}

//             <div className="space-y-4">
//               <h3 className="text-lg font-semibold">Your Responses</h3>
//               {responses.map((resp, idx) => (
//                 <div key={idx} className="border p-4 rounded-lg">
//                   <p className="font-medium">{questions[idx]}</p>
//                   <p className="mt-2">{resp.text}</p>
//                   {resp.emotion && (
//                     <div className="mt-2 flex items-center gap-2">
//                       <span className="font-semibold">Emotion:</span>
//                       <span className="px-3 py-1 rounded-full text-white bg-blue-600">
//                         {resp.emotion} ({(resp.score! * 10).toFixed(1)})
//                       </span>
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>
//         ) : (
//           <div className="space-y-6">
//             <h2 className="text-2xl font-bold">Pre-Run Emotions</h2>
//             <p className="text-gray-600">
//               Answer these questions to help track your mood before running.
//             </p>

//             <div className="space-y-4">
//               {questions.map((q, idx) => (
//                 <div key={idx} className="border p-4 rounded-lg">
//                   <label className="block font-medium mb-2">{q}</label>
//                   <textarea
//                     rows={2}
//                     className="w-full p-2 border rounded"
//                     value={responses[idx].text}
//                     onChange={e => handleChange(idx, e.target.value)}
//                     placeholder="Your answer…"
//                   />
//                 </div>
//               ))}
//             </div>

//             <div className="flex justify-center space-x-4">
//               <button
//                 onClick={handleSubmit}
//                 disabled={loading}
//                 className={`px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ${
//                   loading ? 'opacity-50' : ''
//                 }`}
//               >
//                 {loading ? 'Analyzing…' : 'Submit Responses'}
//               </button>
//               <button
//                 onClick={() => router.back()}
//                 className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
//               >
//                 Back
//               </button>
//             </div>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }


'use client';

import { useState, useEffect } from 'react';
import { useRouter }            from 'next/navigation';
import LogoutButton             from '@/components/LogoutButton';

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';

type ResponseItem = {
  text: string;
  emotion?: string;
  score?: number;
};

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading]         = useState(true);
  const [userEmail, setUserEmail]     = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [responses, setResponses]     = useState<ResponseItem[]>(
    Array(5).fill({ text: '', emotion: undefined, score: undefined })
  );

  const questions = [
    'How are you feeling before the run?',
    'What is your energy level right now?',
    'Are you motivated to complete your run?',
    'How well did you sleep last night?',
    'Do you feel any muscle soreness before running?',
  ];

  // Build chart data from completed responses
  const chartData = responses
    .filter(r => r.emotion)
    .map((r, i) => ({
      question: `Q${i + 1}`,
      score: r.score || 0,
      emotion: r.emotion!,
      date: new Date().toISOString().split('T')[0],
    }));

  // 1) Check auth & get email
  useEffect(() => {
    async function verifyUser() {
      try {
        const res = await fetch('/api/user', {
          method: 'GET',
          credentials: 'include',
        });
        if (res.status === 401) {
          router.replace('/login');
          return;
        }
        const user = await res.json();
        setUserEmail(user.email);
      } catch {
        router.replace('/login');
      } finally {
        setLoading(false);
      }
    }
    verifyUser();
  }, [router]);

  // 2) Submit to /api/predict
  const handleSubmit = async () => {
    if (responses.some(r => !r.text.trim())) {
      alert('Please answer all questions');
      return;
    }
    setLoading(true);
    try {
      const updated = [...responses];
      for (let i = 0; i < questions.length; i++) {
        const r = updated[i];
        const res = await fetch('/api/predict', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: r.text, phase: 'pre_run' }),
        });
        if (!res.ok) throw new Error('Predict failed');
        const json = await res.json();
        updated[i] = { text: r.text, emotion: json.emotion, score: json.score };
      }
      setResponses(updated);
      setShowResults(true);
    } catch (err) {
      console.error(err);
      alert('Failed to get results.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (idx: number, text: string) => {
    const copy = [...responses];
    copy[idx] = { ...copy[idx], text };
    setResponses(copy);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl">Loading…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 p-4">
      <header className="bg-white shadow p-4 flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">The Runner&apos;s Mood Tracker</h1>
        <div className="flex items-center gap-4">
          {userEmail && <span className="text-gray-600">{userEmail}</span>}
          <LogoutButton />
        </div>
      </header>

      <main className="mx-auto max-w-4xl bg-white rounded shadow p-6">
        {showResults ? (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Your Mood Analysis</h2>
              <button
                onClick={() => {
                  setShowResults(false);
                  setResponses(questions.map(() => ({ text: '' })));
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Start New Assessment
              </button>
            </div>

            {chartData.length > 0 && (
              <>
                {/* Bar Chart */}
                <div className="p-4 border rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">
                    Emotional Score Chart (Bar)
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                      <XAxis dataKey="question" />
                      <YAxis domain={[0, 1]} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="score" name="Score">
                        {chartData.map((entry, idx) => (
                          <Cell
                            key={idx}
                            fill={entry.score! <= 0.5 ? '#FF5733' : '#36A2EB'}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Line Chart */}
                <div className="p-4 border rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">
                    Emotional Score Trend (Line)
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                      <XAxis dataKey="question" />
                      <YAxis domain={[0, 1]} />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="score"
                        stroke="#36A2EB"
                        strokeWidth={3}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </>
            )}

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Your Responses</h3>
              {responses.map((resp, idx) => (
                <div key={idx} className="border p-4 rounded-lg">
                  <p className="font-medium">{questions[idx]}</p>
                  <p className="mt-2">{resp.text}</p>
                  {resp.emotion && (
                    <div className="mt-2 flex items-center gap-2">
                      <span className="font-semibold">Emotion:</span>
                      <span className="px-3 py-1 rounded-full text-white bg-blue-600">
                        {resp.emotion} ({(resp.score! * 10).toFixed(1)})
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Pre-Run Emotions</h2>
            <p className="text-gray-600">
              Answer these questions to help track your mood before running.
            </p>

            <div className="space-y-4">
              {questions.map((q, idx) => (
                <div key={idx} className="border p-4 rounded-lg">
                  <label className="block font-medium mb-2">{q}</label>
                  <textarea
                    rows={2}
                    className="w-full p-2 border rounded"
                    value={responses[idx].text}
                    onChange={e => handleChange(idx, e.target.value)}
                    placeholder="Your answer…"
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-center space-x-4">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ${
                  loading ? 'opacity-50' : ''
                }`}
              >
                {loading ? 'Analyzing…' : 'Submit Responses'}
              </button>
              <button
                onClick={() => router.back()}
                className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Back
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
