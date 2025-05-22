"use client";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  Label,
} from "recharts";
import type { MuscleData } from "@/types/muscle";
import { useEffect, useState } from "react";

interface MuscleDistributionChartProps {
  data: MuscleData[];
}

const MuscleDistributionChart = ({ data }: MuscleDistributionChartProps) => {
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

  // Calculate muscle distribution by strength categories
  const weakMuscles = data.filter((m) => m.rating <= 3).length;
  const moderateMuscles = data.filter(
    (m) => m.rating > 3 && m.rating <= 6
  ).length;
  const strongMuscles = data.filter((m) => m.rating > 6).length;

  // More detailed categorization for better visualization
  const distributionData = [
    { name: "Weak (1-3)", value: weakMuscles, color: "#ef4444" },
    { name: "Moderate (4-6)", value: moderateMuscles, color: "#f59e0b" },
    { name: "Strong (7-10)", value: strongMuscles, color: "#10b981" },
  ].filter((item) => item.value > 0); // Only include categories that have muscles

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-md border border-gray-200">
          <p className="font-medium text-gray-900">{payload[0].name}</p>
          <div className="flex items-center gap-1.5 mt-1">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: payload[0].payload.color }}
            ></div>
            <p className="text-sm">
              <span className="font-semibold">{payload[0].value}</span>{" "}
              {payload[0].value === 1 ? "muscle" : "muscles"} (
              {Math.round((payload[0].value / data.length) * 100)}%)
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  // For small screens, use a simpler card-based display
  if (isMobile) {
    return (
      <div className="w-full h-full flex flex-col">
        <div className="text-center mb-2 text-sm text-gray-500">Total: {data.length} muscles</div>
        <div className="flex-1 grid grid-cols-3 gap-2">
          {distributionData.map((category, index) => (
            <div 
              key={index} 
              className="flex flex-col items-center justify-center rounded-lg p-2 border"
              style={{ 
                backgroundColor: `${category.color}15`,
                borderColor: `${category.color}40` 
              }}
            >
              <div className="text-2xl font-bold mb-1" style={{ color: category.color }}>
                {category.value}
              </div>
              <div className="text-xs text-center" style={{ color: category.color }}>
                {category.name}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {Math.round((category.value / data.length) * 100)}%
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // For larger screens, use the pie chart
  return (
    <div className="w-full h-full flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%" minHeight={250}>
        <PieChart margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
          <Pie
            data={distributionData}
            cx="50%"
            cy="45%"
            labelLine={false}
            outerRadius={90}
            innerRadius={60}
            paddingAngle={2}
            dataKey="value"
            cornerRadius={3}
            stroke="#fff"
            strokeWidth={2}
          >
            {distributionData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color}
                className="drop-shadow-sm"
              />
            ))}
            <Label
              value={`${data.length}`}
              position="center"
              className="text-2xl font-bold"
              fill="#333"
              dy={-10}
            />
            <Label
              value="Total Muscles"
              position="centerBottom"
              className="text-xs"
              fill="#666"
              dy={10}
            />
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{ paddingTop: "20px" }}
            iconType="circle"
            iconSize={10}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MuscleDistributionChart;
