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
        // Sort by parsed date
        const [monthA, yearA] = a.name.split('/').map(Number);
        const [monthB, yearB] = b.name.split('/').map(Number);
        return new Date(yearA, monthA - 1).getTime() - new Date(yearB, monthB - 1).getTime();
      });
      console.log('Last 12 Months Data:', last12MonthsData);

    return (
      <ResponsiveContainer width="95%" height="100%">
        <LineChart
          data={last12MonthsData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
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
    );
  };
  
  export default RevenueChart;