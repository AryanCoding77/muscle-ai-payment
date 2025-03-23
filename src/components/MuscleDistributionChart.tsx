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

  // Custom render label with percentage
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
    name,
  }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = 25 + innerRadius + (outerRadius - innerRadius);
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill={distributionData[index].color}
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontWeight="500"
        fontSize="13"
      >
        {`${name}: ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="w-full h-[350px] mt-4">
      <h3 className="text-center text-gray-700 font-medium mb-2">
        Muscle Distribution
      </h3>
      <ResponsiveContainer width="100%" height="90%">
        <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <Pie
            data={distributionData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={90}
            innerRadius={40}
            fill="#8884d8"
            dataKey="value"
            paddingAngle={2}
            cornerRadius={5}
          >
            {distributionData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color}
                stroke="#fff"
                strokeWidth={2}
              />
            ))}
            <Label
              value={`${data.length} Muscles`}
              position="center"
              fill="#333"
              style={{ fontSize: "16px", fontWeight: "bold" }}
            />
          </Pie>
          <Tooltip
            formatter={(value) => [`${value} muscles`, "Count"]}
            contentStyle={{
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              borderRadius: "8px",
              border: "1px solid #ddd",
            }}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            iconSize={10}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MuscleDistributionChart;
