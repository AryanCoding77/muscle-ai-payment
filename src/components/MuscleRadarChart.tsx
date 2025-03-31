"use client";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import type { MuscleData } from "@/types/muscle";

interface MuscleRadarChartProps {
  data: MuscleData[];
}

const MuscleRadarChart = ({ data }: MuscleRadarChartProps) => {
  // Transform data for radar chart (radar expects a specific format)
  // Limit to top 8 muscles for better visualization (too many makes the chart cluttered)
  const topMuscles = [...data].sort((a, b) => b.rating - a.rating).slice(0, 8);

  const chartData = topMuscles.map((item) => ({
    muscle: item.name,
    score: item.rating,
    fullMark: 10, // The maximum possible value
  }));

  return (
    <div className="w-full h-[450px] mt-4">
      <h3 className="text-center text-gray-700 font-medium mb-2">
        Top 8 Muscle Groups
      </h3>
      <ResponsiveContainer width="100%" height="90%">
        <RadarChart
          outerRadius="75%"
          data={chartData}
          margin={{ top: 10, right: 30, bottom: 10, left: 30 }}
        >
          <PolarGrid strokeDasharray="3 3" />
          <PolarAngleAxis
            dataKey="muscle"
            tick={{ fill: "#555", fontSize: 12 }}
            tickSize={4}
            style={{ fontWeight: 500 }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 10]}
            tick={{ fill: "#666" }}
            axisLine={{ stroke: "#ddd" }}
            tickCount={5}
          />
          <Radar
            name="Muscle Development"
            dataKey="score"
            stroke="#4f46e5"
            fill="#4f46e5"
            fillOpacity={0.6}
            dot={{ stroke: "#4338ca", strokeWidth: 2, fill: "#fff", r: 3 }}
            activeDot={{ r: 5, stroke: "#312e81", strokeWidth: 2 }}
          />
          <Tooltip
            formatter={(value) => [`${value}/10`, "Rating"]}
            contentStyle={{
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              borderRadius: "8px",
              border: "1px solid #ddd",
            }}
          />
          <Legend wrapperStyle={{ paddingTop: "15px" }} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MuscleRadarChart;
