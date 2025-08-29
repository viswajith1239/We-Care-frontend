import { GrMoney } from "react-icons/gr";
import { FaUser, FaUserDoctor, FaDownload } from "react-icons/fa6";
// import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import RevenueChart from "./RevenueChart";
import UserDoctorChart from "./UserDoctorChart";
import { getAdminDashboardData } from "../../service/adminService";
import * as XLSX from 'xlsx';

function AdminDashboard() {

  const [dashboardData, setDashboardData] = useState({
    totalRevenue: 0,
    totalUsers: 0,
    totalDoctors: 0,
    activeUsers: 0,
    adminRevenue: 0,
    doctorRevenue: 0,
    activeDoctors: 0,
    totalBookings: 0,
    userDoctorChartData: [],
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await getAdminDashboardData();
        console.log("nnnn", response);

        setDashboardData({
          totalRevenue: response.data.data.totalRevenue,
          totalUsers: response.data.data.totalUsers,
          totalDoctors: response.data.data.totalDoctors,
          activeUsers: response.data.data.activeUsers,
          adminRevenue: response.data.data.adminRevenue,
          doctorRevenue: response.data.data.doctorRevenue,
          activeDoctors: response.data.data.activeDoctors,
          userDoctorChartData: response.data.data.userDoctorChartData,
          totalBookings: response.data.data.totalBookings
        });

      } catch (error: any) {
        console.error("Error fetching dashboard data", error);
      }
    };

    fetchDashboardData();
  }, []);

  const downloadExcelReport = () => {
    // Prepare dashboard summary data
    const summaryData = [
      ["Dashboard Summary", ""],
      ["Total Revenue", `₹${dashboardData.totalRevenue}`],
      ["Total Patients", dashboardData.totalUsers],
      ["Active Patients", dashboardData.activeUsers],
      ["Total Doctors", dashboardData.totalDoctors],
      ["Active Doctors", dashboardData.activeDoctors],
      ["Total Bookings", dashboardData.totalBookings],
      ["Admin Revenue", `₹${dashboardData.adminRevenue}`],
      ["Doctor Revenue", `₹${dashboardData.doctorRevenue}`],
      ["", ""],
    ];

    // Prepare revenue table data
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    const oneYearAgo = new Date(currentYear, currentMonth - 12, 1);

    const last12MonthsData = (dashboardData.userDoctorChartData || [])
      .filter(
        (item: any) => item.doctorRevenue > 0 || item.adminRevenue > 0
      )
      .map((item: any) => ({
        name: `${item.month}/${item.year}`,
        doctorRevenue: item.doctorRevenue,
        adminRevenue: item.adminRevenue,
        totalRevenue: item.doctorRevenue + item.adminRevenue
      }))
      .filter((item: any) => {
        const [month, year] = item.name.split('/').map(Number);
        const itemDate = new Date(year, month - 1, 1);
        return itemDate >= oneYearAgo && itemDate <= today;
      })
      .sort((a: any, b: any) => {
        const [monthA, yearA] = a.name.split('/').map(Number);
        const [monthB, yearB] = b.name.split('/').map(Number);
        return new Date(yearA, monthA - 1).getTime() - new Date(yearB, monthB - 1).getTime();
      });

    const revenueTableData = [
      ["Monthly Revenue Report", "", "", ""],
      ["Month/Year", "Doctor Revenue", "Admin Revenue", "Total Revenue"],
      ...last12MonthsData.map((item: any) => [
        item.name,
        `₹${item.doctorRevenue.toFixed(2)}`,
        `₹${item.adminRevenue.toFixed(2)}`,
        `₹${item.totalRevenue.toFixed(2)}`
      ])
    ];

    // Combine all data
    const allData = [
      ...summaryData,
      ...revenueTableData
    ];

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(allData);

    // Set column widths
    ws['!cols'] = [
      { width: 20 },
      { width: 15 },
      { width: 15 },
      { width: 15 }
    ];

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, "Admin Dashboard Report");

    // Generate current date for filename
    const currentDate = new Date().toISOString().split('T')[0];
    const fileName = `Admin_Dashboard_Report_${currentDate}.xlsx`;

    // Save the file
    XLSX.writeFile(wb, fileName);
  };

  return (
    <div className="flex flex-col p-4 space-y-8 max-w-full overflow-x-hidden">
      <div className="w-full flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Welcome to Admin Dashboard</h1>
        <button
          onClick={downloadExcelReport}
          className="flex items-center space-x-2 bg-[#00897B] hover:bg-[#00695C] text-white px-4 py-2 rounded-lg shadow-md transition-colors duration-300"
        >
          <FaDownload size={16} />
          <span>Download XL Report</span>
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-7xl">
        <div className="bg-[#00897B] via-green-500 to-green-700 text-white rounded-lg shadow-md p-4 transform hover:scale-102 transition-transform duration-300">
          <div className="flex flex-col justify-center items-start">
            <GrMoney size={40} />
            <h1 className="text-lg font-medium mt-3">Total Revenue</h1>
            <h3 className="text-2xl font-bold mt-2">{dashboardData.totalRevenue}</h3>
          </div>
        </div>

        <div className="bg-black via-gray-600 to-gray-800 text-white rounded-lg shadow-md p-4 transform hover:scale-102 transition-transform duration-300">
          <div className="flex flex-col justify-center items-start">
            <FaUser size={40} />
            <h1 className="text-lg font-medium mt-3">Total Patients: {dashboardData.totalUsers}</h1>
            <h1 className="text-sm font-medium mt-1">Active Patients: {dashboardData.activeUsers}</h1>
          </div>
        </div>

        <div className="bg-[#00897B] via-blue-500 to-blue-700 text-white rounded-lg shadow-sm p-4 transform hover:scale-102 transition-transform duration-300">
          <div className="flex flex-col justify-center items-start">
            <FaUserDoctor size={40} />
            <h1 className="text-lg font-medium mt-3">Total Doctors: {dashboardData.totalDoctors}</h1>
            <h1 className="text-sm font-medium mt-1">Active Doctors: {dashboardData.activeDoctors}</h1>
          </div>
        </div>
      </div>

      <div className="w-full h-[450px] flex flex-col lg:flex-row gap-6 mt-8">
        <div className="w-full lg:w-1/2 bg-white pt-8 p-6 shadow-lg rounded-lg">
          <RevenueChart data={dashboardData.userDoctorChartData} />
        </div>
        <div className="w-full lg:w-1/2 bg-white pt-8 p-6 shadow-lg rounded-lg">
          <UserDoctorChart data={dashboardData.userDoctorChartData} />
        </div>
      </div>

      {/* Revenue Report Table - Full Width */}
      <div className="w-full bg-white p-6 shadow-lg rounded-lg mt-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Monthly Revenue Report</h2>
        <div className="w-full overflow-x-auto">
          <table className="w-full border-collapse rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-3 px-4 border bg-[#00897B] text-white">Month/Year</th>
                <th className="py-3 px-4 border bg-[#00897B] text-white">Doctor Revenue</th>
                <th className="py-3 px-4 border bg-[#00897B] text-white">Admin Revenue</th>
                <th className="py-3 px-4 border bg-[#00897B] text-white">Total Revenue</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.userDoctorChartData
                .filter((item: any) => item.doctorRevenue > 0 || item.adminRevenue > 0)
                .map((item: any, index: number) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="py-3 px-4 border text-center">{item.month}/{item.year}</td>
                    <td className="py-3 px-4 border text-center">₹{item.doctorRevenue.toFixed(2)}</td>
                    <td className="py-3 px-4 border text-center">₹{item.adminRevenue.toFixed(2)}</td>
                    <td className="py-3 px-4 border text-center font-semibold">
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
}

export default AdminDashboard;