import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface RevenueChartProps {
  data: {
    year: number;
    month: number;
    doctorRevenue: number;
    adminRevenue: number;
  }[];
}

const RevenueChart: React.FC<RevenueChartProps> = ({ data }) => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const oneYearAgo = new Date(currentYear, currentMonth - 12, 1);

  const last12MonthsData = (data || [])
   .filter(
    (item) => item.doctorRevenue > 0 || item.adminRevenue > 0 
  )
    .map((item) => ({
      name: `${item.month}/${item.year}`,
      doctorRevenue: item.doctorRevenue,
      adminRevenue: item.adminRevenue,
    }))
    .filter((item) => {
      const [month, year] = item.name.split('/').map(Number);
      const itemDate = new Date(year, month - 1, 1);
      return itemDate >= oneYearAgo && itemDate <= today;
    })
    .sort((a, b) => {
      const [monthA, yearA] = a.name.split('/').map(Number);
      const [monthB, yearB] = b.name.split('/').map(Number);
      return new Date(yearA, monthA - 1).getTime() - new Date(yearB, monthB - 1).getTime();
    });

  return (
    <div className="flex flex-col items-center w-full">
      {/* Chart */}
      <div className="w-full h-96">
        <ResponsiveContainer width="95%" height="100%">
          <LineChart
            data={last12MonthsData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tickCount={12} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="doctorRevenue" stroke="#8884d8" />
            <Line type="monotone" dataKey="adminRevenue" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Report Table */}
      <div className="w-full mt-8">
  <div className="w-full overflow-x-auto">
    <table className="w-full border-collapse rounded-lg overflow-hidden">
      <thead>
        <tr className="bg-gray-100">
          <th className="py-2 px-4 border bg-[#00897B] text-white min-w-[200px]">Month/Year</th>
          <th className="py-2 px-4 border bg-[#00897B] text-white min-w-[200px]">Doctor Revenue</th>
          <th className="py-2 px-4 border bg-[#00897B] text-white min-w-[200px]">Admin Revenue</th>
          <th className="py-2 px-4 border bg-[#00897B] text-white min-w-[200px]">Total Revenue</th>
        </tr>
      </thead>
      <tbody>
        {last12MonthsData.map((item, index) => (
          <tr key={index} className="hover:bg-gray-50">
            <td className="py-2 px-4 border">{item.name}</td>
            <td className="py-2 px-4 border">₹{item.doctorRevenue.toFixed(2)}</td>
            <td className="py-2 px-4 border">₹{item.adminRevenue.toFixed(2)}</td>
            <td className="py-2 px-4 border">
              ₹{(item.doctorRevenue + item.adminRevenue).toFixed(2)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

    </div>
  );
};

export default RevenueChart;
