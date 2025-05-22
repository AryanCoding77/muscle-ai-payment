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
import { useEffect, useState } from "react";

interface MuscleRadarChartProps {
  data: MuscleData[];
}

const MuscleRadarChart = ({ data }: MuscleRadarChartProps) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  // Transform data for radar chart (radar expects a specific format)
  // Limit to top 8 muscles for better visualization (too many makes the chart cluttered)
  const topMuscles = [...data].sort((a, b) => b.rating - a.rating).slice(0, 8);

  const chartData = topMuscles.map((item) => ({
    muscle: item.name,
    score: item.rating,
    fullMark: 10, // The maximum possible value
  }));

  return (
    <div className="w-full h-full flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart
          outerRadius={isMobile ? "60%" : "68%"}
          data={chartData}
          margin={{ top: -10, right: 30, bottom: 5, left: 30 }}
        >
          <PolarGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <PolarAngleAxis
            dataKey="muscle"
            tick={{ fill: "#555", fontSize: isMobile ? 9 : 11, fontWeight: 500 }}
            tickSize={3}
            stroke="#ddd"
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 10]}
            tick={{ fill: "#888", fontSize: isMobile ? 8 : 10 }}
            axisLine={{ stroke: "#ddd" }}
            tickCount={isMobile ? 3 : 5}
            stroke="#e0e0e0"
          />
          <Radar
            name="Muscle Development"
            dataKey="score"
            stroke="rgba(79, 70, 229, 0.8)"
            fill="rgba(79, 70, 229, 0.6)"
            fillOpacity={0.7}
            dot={{ stroke: "#4338ca", strokeWidth: 2, fill: "#fff", r: isMobile ? 2 : 3 }}
            activeDot={{ r: isMobile ? 4 : 5, stroke: "#312e81", strokeWidth: 2 }}
          />
          <Tooltip
            formatter={(value) => [`${value}/10`, "Rating"]}
            contentStyle={{
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              borderRadius: "8px",
              border: "1px solid #ddd",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
            labelStyle={{ fontWeight: 600, color: "#333" }}
          />
          <Legend
            wrapperStyle={{ paddingTop: isMobile ? "5px" : "10px" }}
            iconType="circle"
            iconSize={isMobile ? 6 : 8}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MuscleRadarChart;
