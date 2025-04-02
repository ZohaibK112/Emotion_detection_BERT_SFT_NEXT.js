"use client";

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid, 
  Cell 
} from "recharts";

interface BarChartComponentProps {
  data: { emotion: string; score: number }[];
}

// 🎨 Array of unique colors for each bar
const colors = ["#FF5733", "#36A2EB", "#FFCE56", "#2ECC71", "#9B59B6"];

export default function BarChartComponent({ data }: BarChartComponentProps) {
  return (
    <div className="w-full max-w-2xl bg-white p-6 rounded-xl shadow-lg mt-6">
      <h2 className="text-xl font-semibold text-gray-800 text-center mb-4">Emotional Score Chart</h2>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
          <XAxis dataKey="emotion" tick={{ fill: "#333" }} />

          {/* ✅ Force Y-axis to show all numbers from 1 to 10 */}
          <YAxis 
            domain={[2, 10]} 
            ticks={[1,2,3,4,5,6,7,8,9,10]} 
            allowDecimals={false} 
            tick={{ fill: "#333" }} 
          />

          {/* Custom Tooltip */}
          <Tooltip 
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-white p-2 shadow-md rounded-md border">
                    <p className="text-gray-700 font-semibold">{payload[0].payload.emotion}</p>
                    <p className="text-blue-600 font-bold">Score: {payload[0].value}</p>
                  </div>
                );
              }
              return null;
            }}
          />

          {/* Bars with multiple colors */}
          <Bar 
            dataKey="score" 
            barSize={50} 
            radius={[10, 10, 0, 0]} 
            animationDuration={1000} 
            animationEasing="ease-out"
            label={{ position: "top", fill: "#444", fontSize: 14 }}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
