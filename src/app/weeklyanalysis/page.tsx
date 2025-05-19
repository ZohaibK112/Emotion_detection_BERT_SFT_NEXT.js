// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   ScatterChart,
//   Scatter,
//   CartesianGrid,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   Legend,
//   RadialBarChart,
//   RadialBar,
//   PolarAngleAxis,
// } from "recharts";

// // Data entry from API
// interface APIEntry {
//   timestamp: string;      // ISO timestamp
//   text: string;
//   emotion: string;
//   score: number;          // 0–10 scale
//   phase: "pre_run" | "post_run";
// }

// // API response shape
// interface WeeklyAnalysisResponse {
//   week_start: string;
//   week_end: string;
//   pre_run_data: Omit<APIEntry, "phase">[];
//   post_run_data: Omit<APIEntry, "phase">[];
// }

// // Framer Motion variants
// const listVariants = {
//   hidden: { opacity: 0 },
//   visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
// };
// const itemVariants = {
//   hidden: { opacity: 0, y: 10 },
//   visible: { opacity: 1, y: 0 }
// };

// export default function WeeklyAnalysis() {
//   const router = useRouter();
//   const [authChecking, setAuthChecking] = useState(true);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [userEmail, setUserEmail] = useState("");
//   const [entries, setEntries] = useState<APIEntry[]>([]);
//   const [weekStart, setWeekStart] = useState("");
//   const [weekEnd, setWeekEnd] = useState("");
//   const [phase, setPhase] = useState<"both" | "pre" | "post">("both");

//   // Authenticate user
//   useEffect(() => {
//     let cancelled = false;
//     (async () => {
//       try {
//         const res = await fetch("/api/user", { credentials: "include" });
//         if (!res.ok) throw new Error();
//         const user = await res.json();
//         if (!cancelled) setUserEmail(user.email);
//       } catch {
//         if (!cancelled) router.push("/emailpage");
//       } finally {
//         if (!cancelled) setAuthChecking(false);
//       }
//     })();
//     return () => { cancelled = true; };
//   }, [router]);

//   // Fetch weekly analysis data
//   useEffect(() => {
//     if (authChecking) return;
//     const controller = new AbortController();
//     (async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const res = await fetch("/api/weeklyanalysis", {
//           credentials: "include",
//           signal: controller.signal
//         });
//         if (res.status === 401) {
//           setError("Session expired. Redirecting…");
//           setTimeout(() => router.push("/emailpage"), 1500);
//           return;
//         }
//         if (!res.ok) throw new Error(`Status ${res.status}`);
//         const json: WeeklyAnalysisResponse = await res.json();
//         setWeekStart(json.week_start);
//         setWeekEnd(json.week_end);
//         const pre = json.pre_run_data.map(r => ({ ...r, phase: "pre_run" as const }));
//         const post = json.post_run_data.map(r => ({ ...r, phase: "post_run" as const }));
//         setEntries([...pre, ...post]);
//       } catch (e: any) {
//         if (e.name !== 'AbortError') {
//           console.error(e);
//           setError("Failed to load weekly data.");
//         }
//       } finally {
//         setLoading(false);
//       }
//     })();
//     return () => { controller.abort(); };
//   }, [authChecking, router]);

//   if (authChecking) {
//     return <div className="flex items-center justify-center h-screen">Verifying session…</div>;
//   }

//   // Separate phases and compute averages
//   const preEntries = entries.filter(e => e.phase === "pre_run");
//   const postEntries = entries.filter(e => e.phase === "post_run");
//   const avgPre = preEntries.length
//     ? parseFloat((preEntries.reduce((s, e) => s + e.score, 0) / preEntries.length).toFixed(1))
//     : 0;
//   const avgPost = postEntries.length
//     ? parseFloat((postEntries.reduce((s, e) => s + e.score, 0) / postEntries.length).toFixed(1))
//     : 0;

//   // Filter for plotting and listing
//   const filtered = entries.filter(e =>
//     phase === "both"
//       ? true
//       : phase === "pre"
//         ? e.phase === "pre_run"
//         : e.phase === "post_run"
//   );
//   const display = filtered.map(e => ({ ...e, time: new Date(e.timestamp).getTime() }));

//   // Tooltip for scatter
//   const CustomTooltip = ({ active, payload }: any) => {
//     if (!active || !payload?.length) return null;
//     const { timestamp, score, emotion, phase: ph } = payload[0].payload;
//     return (
//       <div className="bg-white p-2 border rounded shadow">
//         <p className="font-bold">{new Date(timestamp).toLocaleString()}</p>
//         <p>
//           <span className="font-medium">{ph === 'pre_run' ? 'Pre-Run' : 'Post-Run'}:</span> {score}/10 — <em>{emotion}</em>
//         </p>
//       </div>
//     );
//   };

//   return (
//     <div className="p-4 bg-gray-100 min-h-screen">
//       <header className="flex justify-between items-center bg-white p-4 rounded shadow mb-6">
//         <h1 className="text-xl font-bold">Weekly Mood Tracker</h1>
//         <div className="flex items-center gap-4">
//           <span className="text-gray-600">{userEmail}</span>
//           <button
//             className="px-4 py-2 bg-red-600 text-white rounded"
//             onClick={() => {
//               document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
//               router.push('/emailpage');
//             }}
//           >Logout</button>
//         </div>
//       </header>

//       <main className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
//         {error && <div className="p-4 mb-4 bg-red-50 text-red-600 rounded">{error}</div>}
//         {loading ? (
//           <div className="text-center py-8 text-gray-500">
//             <div className="animate-spin h-12 w-12 border-b-2 border-blue-500 rounded-full mx-auto mb-4" />
//             Loading…
//           </div>
//         ) : (
//           <>
//             {/* Controls */}
//             <div className="mb-4 flex items-center justify-between">
//               <select
//                 value={phase}
//                 onChange={e => setPhase(e.target.value as any)}
//                 className="border rounded px-2 py-1"
//               >
//                 <option value="both">Both</option>
//                 <option value="pre">Pre-Run</option>
//                 <option value="post">Post-Run</option>
//               </select>
//               <div className="text-sm text-gray-600">
//                 Week: {weekStart} – {weekEnd}
//               </div>
//             </div>

//             {/* Gauges */}
//             <section className="flex justify-around mb-8">
//               {(phase === 'both' || phase === 'pre') && (
//                 <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.6 }}>
//                   <div className="text-center mb-2 font-medium">Pre-Run Avg</div>
//                   <RadialBarChart width={140} height={140} cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" barSize={12} data={[{ name: 'pre', value: avgPre, fill: '#8884d8' }]} startAngle={180} endAngle={0}>
//                     <PolarAngleAxis type="number" domain={[0, 10]} angleAxisId={0} tick={false} />
//                     <RadialBar dataKey="value" cornerRadius={10} isAnimationActive animationDuration={1200} />
//                     <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="font-bold">
//                       {avgPre}/10
//                     </text>
//                   </RadialBarChart>
//                 </motion.div>
//               )}
//               {(phase === 'both' || phase === 'post') && (
//                 <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.6, delay: 0.2 }}>
//                   <div className="text-center mb-2 font-medium">Post-Run Avg</div>
//                   <RadialBarChart width={140} height={140} cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" barSize={12} data={[{ name: 'post', value: avgPost, fill: '#82ca9d' }]} startAngle={180} endAngle={0}>
//                     <PolarAngleAxis type="number" domain={[0, 10]} angleAxisId={0} tick={false} />
//                     <RadialBar dataKey="value" cornerRadius={10} isAnimationActive animationDuration={1200} />
//                     <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="font-bold">
//                       {avgPost}/10
//                     </text>
//                   </RadialBarChart>
//                 </motion.div>
//               )}
//             </section>

//             {/* Scatter Chart */}
//             <AnimatePresence mode="wait">
//               <motion.div key={phase} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.5 }} className="mb-8">
//                 <h2 className="text-2xl mb-4 text-center">Mood Over Time</h2>
//                 {display.length === 0 ? (
//                   <div className="text-center py-8 text-gray-700">No entries.</div>
//                 ) : (
//                   <ResponsiveContainer width="100%" height={300}>
//                     <ScatterChart margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
//                       <CartesianGrid strokeDasharray="3 3" />
//                       <XAxis dataKey="time" type="number" domain={["dataMin", "dataMax"]} scale="time" tickFormatter={u => new Date(u).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} />
//                       <YAxis dataKey="score" domain={[0, 10]} ticks={[0,2,4,6,8,10]} />
//                       <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
//                       <Legend verticalAlign="top" height={36} />
//                       <Scatter data={display} fill={phase === 'post' ? '#82ca9d' : '#8884d8'} isAnimationActive animationBegin={200} animationDuration={800} animationEasing="ease-out" />
//                     </ScatterChart>
//                   </ResponsiveContainer>
//                 )}
//               </motion.div>
//             </AnimatePresence>

//             {/* Entries List */}
//             <section>
//               <h2 className="text-2xl mb-4 text-center">Entries</h2>
//               {filtered.length === 0 ? (
//                 <div className="text-center py-8 text-gray-700">No entries.</div>
//               ) : (
//                 <AnimatePresence>
//                   <motion.div className="space-y-4" variants={listVariants} initial="hidden" animate="visible" exit="hidden">
//                     {filtered.map((e, i) => (
//                       <motion.div key={`${e.timestamp}-${i}`} className="border p-4 rounded bg-white" variants={itemVariants}>
//                         <p className="font-medium">{new Date(e.timestamp).toLocaleString()}: <strong>{e.emotion}</strong> ({e.score}/10)</p>
//                         <p className="text-sm text-gray-600 mt-1">{e.text}</p>
//                       </motion.div>
//                     ))}
//                   </motion.div>
//                 </AnimatePresence>
//               )}
//             </section>
//           </>
//         )}
//       </main>
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ScatterChart,
  Scatter,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
} from "recharts";

// Data entry from API
interface APIEntry {
  timestamp: string;      // ISO timestamp
  text: string;
  emotion: string;
  score: number;          // 0–10 scale
  phase: "pre_run" | "post_run";
}

// API response shape
interface WeeklyAnalysisResponse {
  week_start: string;       // YYYY-MM-DD
  week_end: string;
  pre_run_data: Omit<APIEntry, "phase">[];
  post_run_data: Omit<APIEntry, "phase">[];
}

// Framer Motion variants for the entries list
const listVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

export default function WeeklyAnalysis() {
  const router = useRouter();

  // State
  const [authChecking, setAuthChecking] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState("");
  const [entries, setEntries] = useState<APIEntry[]>([]);
  const [weekStart, setWeekStart] = useState("");
  const [phase, setPhase] = useState<"both" | "pre" | "post">("both");
  const [selectedDate, setSelectedDate] = useState<string>("");

  // Authentication check
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/user", { credentials: "include" });
        if (!res.ok) throw new Error();
        const user = await res.json();
        if (!cancelled) setUserEmail(user.email);
      } catch {
        if (!cancelled) router.push("/emailpage");
      } finally {
        if (!cancelled) setAuthChecking(false);
      }
    })();
    return () => { cancelled = true; };
  }, [router]);

  // Fetch weekly data
  useEffect(() => {
    if (authChecking) return;
    const controller = new AbortController();
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/weeklyanalysis", {
          credentials: "include",
          signal: controller.signal,
        });
        if (res.status === 401) {
          setError("Session expired. Redirecting…");
          setTimeout(() => router.push("/emailpage"), 1500);
          return;
        }
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const json: WeeklyAnalysisResponse = await res.json();
        setWeekStart(json.week_start);
        setSelectedDate(json.week_start);
        const pre = json.pre_run_data.map(r => ({ ...r, phase: "pre_run" as const }));
        const post = json.post_run_data.map(r => ({ ...r, phase: "post_run" as const }));
        setEntries([...pre, ...post]);
      } catch (e: any) {
        if (e.name !== 'AbortError') {
          console.error(e);
          setError("Failed to load weekly data.");
        }
      } finally {
        setLoading(false);
      }
    })();
    return () => { controller.abort(); };
  }, [authChecking, router]);

  if (authChecking) {
    return <div className="flex items-center justify-center h-screen">Verifying session…</div>;
  }

  // Build date dropdown options
  const dateOptions: string[] = [];
  if (weekStart) {
    const start = new Date(weekStart);
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      dateOptions.push(d.toISOString().slice(0, 10));
    }
  }

  // Compute daily averages for selectedDate
  const preEntries = entries.filter(
    e => e.phase === "pre_run" && e.timestamp.startsWith(selectedDate)
  );
  const postEntries = entries.filter(
    e => e.phase === "post_run" && e.timestamp.startsWith(selectedDate)
  );
  const avgPre = preEntries.length
    ? parseFloat((preEntries.reduce((s, e) => s + e.score, 0) / preEntries.length).toFixed(1))
    : 0;
  const avgPost = postEntries.length
    ? parseFloat((postEntries.reduce((s, e) => s + e.score, 0) / postEntries.length).toFixed(1))
    : 0;

  // Filter for chart & list by phase AND date
  const filtered = entries.filter(e =>
    e.timestamp.startsWith(selectedDate) &&
    (phase === "both"
      ? true
      : phase === "pre"
        ? e.phase === "pre_run"
        : e.phase === "post_run")
  );
  const display = filtered.map(e => ({ ...e, time: new Date(e.timestamp).getTime() }));

  // Chart tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    const { timestamp, score, emotion, phase: ph } = payload[0].payload;
    return (
      <div className="bg-white p-2 border rounded shadow">
        <p className="font-bold">{new Date(timestamp).toLocaleString()}</p>
        <p>
          <span className="font-medium">{ph === 'pre_run' ? 'Pre-Run' : 'Post-Run'}:</span> {score}/10 — <em>{emotion}</em>
        </p>
      </div>
    );
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <header className="flex justify-between items-center bg-white p-4 rounded shadow mb-6">
        <button
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
          onClick={() => router.back()}
        >
          &larr; Back
        </button>
        <h1 className="text-xl font-bold">Weekly Mood Tracker</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-600">{userEmail}</span>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            onClick={() => {
              document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
              router.push('/emailpage');
            }}
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
        {error && <div className="p-4 mb-4 bg-red-50 text-red-600 rounded">{error}</div>}
        {loading ? (
          <div className="text-center py-8 text-gray-500">
            <div className="animate-spin h-12 w-12 border-b-2 border-blue-500 rounded-full mx-auto mb-4" />
            Loading your weekly analysis…
          </div>
        ) : (
          <>
            {/* Controls */}
            <div className="mb-4 flex items-center gap-4">
              <select
                value={phase}
                onChange={e => setPhase(e.target.value as any)}
                className="border rounded px-2 py-1"
              >
                <option value="both">Both</option>
                <option value="pre">Pre-Run</option>
                <option value="post">Post-Run</option>
              </select>
              <select
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
                className="border rounded px-2 py-1"
              >
                {dateOptions.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Daily Gauges */}
            <section className="flex justify-around mb-8">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.6 }}>
                <div className="text-center mb-2 font-medium">Pre-Run Avg ({selectedDate})</div>
                <RadialBarChart
                  width={140}
                  height={140}
                  cx="50%"
                  cy="50%"
                  innerRadius="70%"
                  outerRadius="100%"
                  barSize={12}
                  data={[{ name: 'pre', value: avgPre, fill: '#8884d8' }]}
                  startAngle={180}
                  endAngle={0}
                >
                  <PolarAngleAxis type="number" domain={[0, 10]} angleAxisId={0} tick={false} />
                  <RadialBar dataKey="value" cornerRadius={10} isAnimationActive animationDuration={1200} />
                  <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="font-bold">{avgPre}/10</text>
                </RadialBarChart>
              </motion.div>
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.6, delay: 0.2 }}>
                <div className="text-center mb-2 font-medium">Post-Run Avg ({selectedDate})</div>
                <RadialBarChart
                  width={140}
                  height={140}
                  cx="50%"
                  cy="50%"
                  innerRadius="70%"
                  outerRadius="100%"
                  barSize={12}
                  data={[{ name: 'post', value: avgPost, fill: '#82ca9d' }]}
                  startAngle={180}
                  endAngle={0}
                >
                  <PolarAngleAxis type="number" domain={[0, 10]} angleAxisId={0} tick={false} />
                  <RadialBar dataKey="value" cornerRadius={10} isAnimationActive animationDuration={1200} />
                  <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="font-bold">{avgPost}/10</text>
                </RadialBarChart>
              </motion.div>
            </section>

            {/* Mood Over Time Chart */}
            <AnimatePresence mode="wait">
              <motion.div
                key={phase + selectedDate}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
              >
                <h2 className="text-2xl mb-4 text-center">Mood Over Time</h2>
                {display.length === 0 ? (
                  <div className="text-center py-8 text-gray-700">No entries for this day.</div>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <ScatterChart margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="time"
                        type="number"
                        domain={["dataMin", "dataMax"]}
                        scale="time"
                        tickFormatter={u => new Date(u).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      />
                      <YAxis dataKey="score" domain={[0, 10]} ticks={[0,2,4,6,8,10]} />
                      <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
                      <Legend verticalAlign="top" height={36} />
                      <Scatter data={display} fill={phase === 'post' ? '#82ca9d' : '#8884d8'} isAnimationActive animationBegin={200} animationDuration={800} animationEasing="ease-out" />
                    </ScatterChart>
                  </ResponsiveContainer>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Entries List */}
            <section>
              <h2 className="text-2xl mb-4 text-center">Entries</h2>
              {filtered.length === 0 ? (
                <div className="text-center py-8 text-gray-700">No entries for this day.</div>
              ) : (
                <AnimatePresence>
                  <motion.div className="space-y-4" variants={listVariants} initial="hidden" animate="visible" exit="hidden">
                    {filtered.map((e, i) => (
                      <motion.div key={`${e.timestamp}-${i}`} className="border p-4 rounded bg-white" variants={itemVariants}>
                        <p className="font-medium">{new Date(e.timestamp).toLocaleString()}: <strong>{e.emotion}</strong> ({e.score}/10)</p>
                        <p className="text-sm text-gray-600 mt-1">{e.text}</p>
                      </motion.div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}




