"use client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { MuscleData } from "@/types/muscle";

interface MuscleBarChartProps {
  data: MuscleData[];
}

const MuscleBarChart = ({ data }: MuscleBarChartProps) => {
  // Sort data by rating in ascending order to show weakest muscles first
  const sortedData = [...data].sort((a, b) => a.rating - b.rating);

  // Color based on rating
  const getBarColor = (rating: number) => {
    if (rating <= 3) return "#ef4444"; // red
    if (rating <= 6) return "#eab308"; // yellow
    return "#22c55e"; // green
  };

  return (
    <div className="w-full h-[500px] mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={sortedData}
          layout="vertical"
          margin={{ top: 20, right: 30, left: 120, bottom: 5 }}
          barGap={8}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" domain={[0, 10]} />
          <YAxis
            dataKey="name"
            type="category"
            tick={{ fill: "#666", fontSize: 12 }}
            width={120}
            tickMargin={10}
          />
          <Tooltip
            formatter={(value: number) => [`${value}/10`, "Score"]}
            cursor={{ fill: "rgba(0,0,0,0.05)" }}
          />
          <Legend />
          <Bar
            dataKey="rating"
            name="Muscle Development"
            minPointSize={3}
            barSize={24}
            label={{ position: "right", fill: "#666", fontSize: 12 }}
          >
            {sortedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry.rating)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MuscleBarChart;
