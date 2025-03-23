"use client";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import type { MuscleData } from "@/types/muscle";

interface MuscleDistributionChartProps {
  data: MuscleData[];
}

const MuscleDistributionChart = ({ data }: MuscleDistributionChartProps) => {
  // Calculate muscle distribution by strength categories
  const weakMuscles = data.filter((m) => m.rating <= 3).length;
  const moderateMuscles = data.filter(
    (m) => m.rating > 3 && m.rating <= 6
  ).length;
  const strongMuscles = data.filter((m) => m.rating > 6).length;

  const distributionData = [
    { name: "Weak (1-3)", value: weakMuscles, color: "#ef4444" },
    { name: "Moderate (4-6)", value: moderateMuscles, color: "#eab308" },
    { name: "Strong (7-10)", value: strongMuscles, color: "#22c55e" },
  ].filter((item) => item.value > 0); // Only include categories that have muscles

  return (
    <div className="w-full h-[300px] mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={distributionData}
            cx="50%"
            cy="50%"
            labelLine={true}
            label={({ name, percent }) =>
              `${name}: ${(percent * 100).toFixed(0)}%`
            }
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {distributionData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`${value} muscles`, "Count"]} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MuscleDistributionChart;
