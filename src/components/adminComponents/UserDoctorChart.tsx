import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
  } from 'recharts';
  
  interface UserDoctorChartProps {
    data: {
      year: number;
      month: number;
      users: number;
      doctor: number;
    }[];
  }
  
  const UserDoctorChart: React.FC<UserDoctorChartProps> = ({ data }) => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();
  
    const last12MonthsData = (data || [])
      .filter((item) => {
        const monthsDiff =
          (currentYear - item.year) * 12 + (currentMonth - item.month);
        return monthsDiff >= 0 && monthsDiff < 12; 
      })
      .map((item) => ({
        ...item,
        name: `${item.month}/${item.year}`, 
      }))
      .sort(
        (a, b) =>
          new Date(a.year, a.month - 1).getTime() -
          new Date(b.year, b.month - 1).getTime()
      );
  
    return (
      <ResponsiveContainer width="95%" height="100%">
        <BarChart
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
          <Bar dataKey="users" fill="#8884d8" name="Users Registered" />
          <Bar dataKey="doctor" fill="#82ca9d" name="Doctor Registered" />
        </BarChart>
      </ResponsiveContainer>
    );
  };
  
  export default UserDoctorChart;