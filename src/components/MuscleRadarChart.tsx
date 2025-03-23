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
  const chartData = data.map((item) => ({
    muscle: item.name,
    score: item.rating,
    fullMark: 10, // The maximum possible value
  }));

  return (
    <div className="w-full h-[400px] mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart outerRadius="70%" data={chartData}>
          <PolarGrid strokeDasharray="3 3" />
          <PolarAngleAxis
            dataKey="muscle"
            tick={{ fill: "#666", fontSize: 12 }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 10]}
            tick={{ fill: "#666" }}
          />
          <Radar
            name="Muscle Development"
            dataKey="score"
            stroke="#4f46e5"
            fill="#4f46e5"
            fillOpacity={0.6}
          />
          <Tooltip />
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MuscleRadarChart;
