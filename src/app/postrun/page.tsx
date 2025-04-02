// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
//   Cell,
// } from "recharts";

// export default function Home() {
//   const router = useRouter();
//   const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
//   const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);
//   const [isClient, setIsClient] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [showResults, setShowResults] = useState(false);
//   const [userEmail, setUserEmail] = useState("");

//   const questions = [
//     "How do you feel physically and mentally after completing your run?",
//     "Did you achieve the goals you set for today's run?",
//     "How do you think your sleep last night impacted your performance?",
//     "What did you eat after your run?",
//     "How did the weather conditions affect your run?",
//   ];

//   const [responses, setResponses] = useState<
//     { text: string; emotion?: string; score?: number }[]
//   >(questions.map(() => ({ text: "" })));

//   const chartData = responses
//     .filter(item => item.emotion)
//     .map((item, index) => ({
//       question: `Q${index + 1}`,
//       score: item.score || 0,
//       emotion: item.emotion || "",
//     }));

//   useEffect(() => {
//     const checkAuth = () => {
//       const authStatus = localStorage.getItem("isAuthenticated");
//       const email = localStorage.getItem("userEmail");

//       if (authStatus === "true") {
//         setIsAuthenticated(true);
//         if (email) setUserEmail(email);
//       } else {
//         router.push("/emailpage");
//       }
//       setIsCheckingAuth(false);
//     };

//     // Small delay to ensure localStorage is available
//     const timer = setTimeout(() => {
//       checkAuth();
//     }, 100);

//     return () => clearTimeout(timer);
//   }, [router]);

//   useEffect(() => {
//     setIsClient(true);
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem("isAuthenticated");
//     localStorage.removeItem("userEmail");
//     router.push("/signup");
//   };

//   const handleSubmit = async () => {
//     if (responses.some(response => !response.text.trim())) {
//       alert("Please answer all questions before submitting");
//       return;
//     }

//     setLoading(true);
//     try {
//       const updatedResponses = [...responses];

//       for (let i = 0; i < responses.length; i++) {
//         if (responses[i].text.trim() === "") continue;

//         const response = await fetch("http://127.0.0.1:8000/predict/", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             text: responses[i].text,
//             user_id: userEmail || "anonymous",
//           }),
//         });

//         if (!response.ok) {
//           throw new Error("Failed to analyze response");
//         }

//         const data = await response.json();

//         updatedResponses[i] = {
//           text: responses[i].text,
//           emotion: data.predicted_emotion,
//           score: data.score,
//         };
//       }

//       setResponses(updatedResponses);
//       setShowResults(true);
//     } catch (error) {
//       console.error("Error:", error);
//       alert("Failed to get results from backend. Please check your server connection.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleResponseChange = (index: number, value: string) => {
//     const newResponses = [...responses];
//     newResponses[index] = { text: value };
//     setResponses(newResponses);
//   };

//   if (isCheckingAuth) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-100">
//         <div className="text-xl font-semibold">Loading...</div>
//       </div>
//     );
//   }

//   if (!isAuthenticated) {
//     router.push("/signup");
//     return null;
//   }

//   return (
//     <div className="min-h-screen flex flex-col bg-gray-100 p-4">
//       <header className="bg-white shadow-sm p-4 flex justify-between items-center mb-6">
//         <h1 className="text-xl font-bold">Runner's Mood Tracker</h1>
//         <div className="flex items-center gap-4">
//           <span className="text-gray-600">{userEmail}</span>
//           <button
//             onClick={handleLogout}
//             className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
//           >
//             Logout
//           </button>
//         </div>
//       </header>

//       <main className="container mx-auto max-w-4xl bg-white rounded-lg shadow-md p-6">
//         {showResults ? (
//           <div className="space-y-8">
//             <div className="flex justify-between items-center">
//               <h2 className="text-2xl font-bold">Your Mood Analysis</h2>
//               <button
//                 onClick={() => {
//                   setShowResults(false);
//                   setResponses(questions.map(() => ({ text: "" })));
//                 }}
//                 className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//               >
//                 Start New Assessment
//               </button>
//             </div>

//             {chartData.length > 0 ? (
//               <>
//                 <div className="p-4 border rounded-lg">
//                   <h3 className="text-lg font-semibold mb-4">Emotional Score Chart</h3>
//                   <ResponsiveContainer width="100%" height={300}>
//                     <BarChart data={chartData}>
//                       <XAxis dataKey="question" />
//                       <YAxis domain={[1, 10]} ticks={[1,2,3,4,5,6,7,8,9,10]} />
//                       <Tooltip />
//                       <Legend />
//                       <Bar dataKey="score" name="Emotional Score">
//                         {chartData.map((entry, index) => (
//                           <Cell 
//                             key={`cell-${index}`} 
//                             fill={entry.score <= 4 ? "#FF5733" : "#36A2EB"} 
//                           />
//                         ))}
//                       </Bar>
//                     </BarChart>
//                   </ResponsiveContainer>
//                 </div>

//                 <div className="space-y-4">
//                   <h3 className="text-lg font-semibold">Your Responses</h3>
//                   {responses.map((response, index) => (
//                     <div key={index} className="border p-4 rounded-lg">
//                       <p className="font-medium">{questions[index]}</p>
//                       <p className="mt-2">{response.text}</p>
//                       {response.emotion && (
//                         <div className="mt-2 flex items-center gap-2">
//                           <span className="font-semibold">Emotion:</span>
//                           <span className={`px-3 py-1 rounded-full text-sm text-white bg-blue-600`}>
//                             {response.emotion} ({response.score}/100)
//                           </span>
//                         </div>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               </>
//             ) : (
//               <div className="py-8 text-center text-gray-500">
//                 No analysis results available. The backend API might not be responding.
//               </div>
//             )}
//           </div>
//         ) : (
//           <div className="space-y-6">
//             <h2 className="text-2xl font-bold">Post-Run Mood Assessment</h2>
//             <p className="text-gray-600">Answer these questions to track your mood.</p>
//             <button onClick={handleSubmit} className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700">
//               {loading ? "Analyzing..." : "Submit Responses"}
//             </button>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }


  "use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
} from "recharts";

export default function Home() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const questions = [
    "How do you feel physically and mentally after completing your run?",
    "Did you achieve the goals you set for today's run?",
    "How do you think your sleep last night impacted your performance?",
    "What did you eat after your run?",
    "How did the weather conditions affect your run?",
  ];

  const [responses, setResponses] = useState<
    { text: string; emotion?: string; score?: number }[]
  >(questions.map(() => ({ text: "" })));

  const chartData = responses
    .filter(item => item.emotion)
    .map((item, index) => ({
      question: `Q${index + 1}`,
      score: item.score || 0,
      emotion: item.emotion || "",
      date: new Date().toISOString().split("T")[0],
    }));

  useEffect(() => {
    const checkAuth = () => {
      const authStatus = localStorage.getItem("isAuthenticated");
      const email = localStorage.getItem("userEmail");
      
      if (authStatus === "true") {
        setIsAuthenticated(true);
        if (email) setUserEmail(email);
      } else {
        router.push("/emailpage");
      }
      setIsCheckingAuth(false);
    };

    // Small delay to ensure localStorage is available
    const timer = setTimeout(() => {
      checkAuth();
    }, 100);

    return () => clearTimeout(timer);
  }, [router]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userEmail");
    router.push("/emailpage");
  };

  const handleSubmit = async () => {
    // Validate that all questions have responses
    if (responses.some(response => !response.text.trim())) {
      alert("Please answer all questions before submitting");
      return;
    }

    setLoading(true);
    try {
      const updatedResponses = [...responses];

      for (let i = 0; i < responses.length; i++) {
        if (responses[i].text.trim() === "") continue;

        const response = await fetch("https://zohaibk112-the-runners-bert-emotions.hf.space/predict/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: responses[i].text,
            user_id: userEmail || "anonymous", // Use email as user ID
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to analyze response");
        }

        const data = await response.json();

        updatedResponses[i] = {
          text: responses[i].text,
          emotion: data.predicted_emotion,
          score: data.score,
        };
      }

      setResponses(updatedResponses);
      setShowResults(true);
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to get results from backend. Please check your server connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleResponseChange = (index: number, value: string) => {
    const newResponses = [...responses];
    newResponses[index] = { text: value };
    setResponses(newResponses);
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 p-4">
      <header className="bg-white shadow-sm p-4 flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">The Runner's Mood Tracker</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-600">{userEmail}</span>
          <button 
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="container mx-auto max-w-4xl bg-white rounded-lg shadow-md p-6">
        {showResults ? (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Your Mood Analysis</h2>
              <button
                onClick={() => {
                  setShowResults(false);
                  setResponses(questions.map(() => ({ text: "" })));
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Start New Assessment
              </button>
            </div>

            {chartData.length > 0 ? (
              <>
                {/* Bar Chart */}
                <div className="p-4 border rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Emotional Score Chart (Bar)</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                    <XAxis 
                      dataKey={(entry) => `${entry.emotion} (${entry.date || "N/A"})`} 
                      tickFormatter={(value) => value.length > 15 ? value.slice(0, 15) + "..." : value} 
                        />
                      <YAxis domain={[1, 10]} ticks={[1,2,3,4,5,6,7,8,9,10]} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="score" name="Emotional Score">
                        {chartData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.score <= 4 ? "#FF5733" : "#36A2EB"} 
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Line Chart */}
                 <div className="p-4 border rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Emotional Score Trend (Line)</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                    <XAxis 
                      dataKey={(entry) => `${entry.emotion} (${entry.date || "N/A"})`} 
                      tickFormatter={(value) => value.length > 15 ? value.slice(0, 15) + "..." : value} 
                        />
                      <YAxis domain={[1, 10]} ticks={[1,2,3,4,5,6,7,8,9,10]} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="score" stroke="#36A2EB" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>


                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Your Responses</h3>
                  {responses.map((response, index) => (
                    <div key={index} className="border p-4 rounded-lg">
                      <p className="font-medium">{questions[index]}</p>
                      <p className="mt-2">{response.text}</p>
                      {response.emotion && (
                        <div className="mt-2 flex items-center gap-2">
                          <span className="font-semibold">Emotion:</span>
                          <span className={`px-3 py-1 rounded-full text-sm text-white bg-blue-600`}>
                            {response.emotion} ({response.score}/10)
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="py-8 text-center text-gray-500">
                No analysis results available. The backend API might not be responding.
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Post-Run Emotions</h2>
            <p className="text-gray-600">
              Answer these questions to help track your mood before running.
            </p>

            <div className="space-y-4">
              {questions.map((question, index) => (
                <div key={index} className="border p-4 rounded-lg">
                  <label className="block text-lg font-medium mb-2">{question}</label>
                  <textarea
                    value={responses[index].text}
                    onChange={(e) => handleResponseChange(index, e.target.value)}
                    className="w-full p-3 border rounded-md"
                    rows={2}
                    placeholder="Your answer..."
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Analyzing..." : "Submit Responses"}
              </button>

              
            </div>
            {/* Back Button */}
            <div className="flex justify-center">
            <button
        onClick={() => router.back()} // Goes to the previous page
        className="mt-6 px-6 py-3 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 transition"
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
