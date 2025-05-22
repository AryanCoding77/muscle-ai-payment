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
import { useEffect, useState } from "react";

interface MuscleBarChartProps {
  data: MuscleData[];
}

const MuscleBarChart = ({ data }: MuscleBarChartProps) => {
  // Sort data by rating in ascending order to show weakest muscles first
  const sortedData = [...data].sort((a, b) => a.rating - b.rating);
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

  // Color based on rating
  const getBarColor = (rating: number) => {
    if (rating <= 3) return "#f87171"; // red-400
    if (rating <= 6) return "#fbbf24"; // amber-400
    return "#34d399"; // emerald-400
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-md border border-gray-200">
          <p className="font-medium text-gray-900">{payload[0].payload.name}</p>
          <p className="text-sm mt-1">
            <span className="font-semibold">Rating:</span>{" "}
            <span className="font-semibold" style={{ color: payload[0].fill }}>
              {payload[0].value}/10
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={sortedData}
          layout="vertical"
          margin={isMobile 
            ? { top: 5, right: 25, left: 10, bottom: 5 }
            : { top: 5, right: 32, left: 30, bottom: 5 }
          }
          barGap={4}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" horizontal={true} vertical={false} />
          <XAxis 
            type="number" 
            domain={[0, 10]} 
            tick={{ fill: "#666", fontSize: isMobile ? 10 : 11 }}
            tickLine={{ stroke: "#ccc" }}
            axisLine={{ stroke: "#ccc" }}
            tickCount={isMobile ? 6 : 11}
          />
          <YAxis
            dataKey="name"
            type="category"
            tick={{ fill: "#555", fontSize: isMobile ? 9 : 11 }}
            width={isMobile ? 60 : 90}
            tickMargin={isMobile ? 4 : 8}
            axisLine={{ stroke: "#ccc" }}
            tickFormatter={(value) => isMobile && value.length > 7 ? value.substring(0, 7) + '...' : value}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="rating"
            name="Muscle Development"
            minPointSize={3}
            barSize={isMobile ? 12 : 16}
            radius={[0, 4, 4, 0]}
            animationDuration={1500}
          >
            {sortedData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={getBarColor(entry.rating)} 
                className="drop-shadow-sm" 
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MuscleBarChart;
