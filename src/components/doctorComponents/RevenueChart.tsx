import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Bar, BarChart, } from "recharts";
import { useState } from "react";

interface RevenueChartProps {
  data: {
    year: number;
    month: number;
    doctorRevenue: number;
    week?: number;
  }[];
  doctorid: string;
}

const RevenueChart: React.FC<RevenueChartProps> = ({ data }) => {
  const [filter, setFilter] = useState<"monthly" | "yearly">("monthly");

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const oneYearAgo = new Date(currentYear, currentMonth - 11, 1);

  const monthlyData = data
    .map((item) => ({
      name: `${String(item.month).padStart(2, "0")}/${item.year}`,
      doctorRevenue: item.doctorRevenue,
      year: item.year,
      month: item.month,
    }))
    .filter((item) => {
      const itemDate = new Date(item.year, item.month - 1, 1);
      return itemDate >= oneYearAgo && itemDate <= today;
    })
    .sort((a, b) => new Date(a.year, a.month - 1).getTime() - new Date(b.year, b.month - 1).getTime());

  const yearlyData = Object.values(
    data.reduce((acc, curr) => {
      if (!acc[curr.year]) {
        acc[curr.year] = { name: `${curr.year}`, doctorRevenue: 0 };
      }
      acc[curr.year].doctorRevenue += curr.doctorRevenue;
      return acc;
    }, {} as Record<number, { name: string; doctorRevenue: number }>)
  ).sort((a, b) => Number(a.name) - Number(b.name));

  const chartData = filter === "monthly" ? monthlyData : yearlyData;

  return (
    <div className="w-full">
      <div className="flex justify-end mb-4 gap-2">
        <button
          className={`px-3 py-1 rounded ${filter === "monthly" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setFilter("monthly")}
        >
          Monthly
        </button>
        <button
          className={`px-3 py-1 rounded ${filter === "yearly" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setFilter("yearly")}
        >
          Yearly
        </button>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="doctorRevenue" fill="#00897B" barSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueChart;
