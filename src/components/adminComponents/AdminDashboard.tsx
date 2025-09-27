import { GrMoney } from "react-icons/gr";
import { FaUser, FaUserDoctor, FaDownload, FaCalendar } from "react-icons/fa6";
import { useState, useEffect } from "react";
import RevenueChart from "./RevenueChart";
import UserDoctorChart from "./UserDoctorChart";
import { getAdminDashboardData } from "../../service/adminService";
import * as XLSX from 'xlsx';

interface ChartDataItem {
  month: number;
  year: number;
  doctorRevenue: number;
  adminRevenue: number;
  users:number;
  doctor:number

}

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
    userDoctorChartData: [] as ChartDataItem[],
    dateFilter: {
      startDate: null,
      endDate: null,
      isFiltered: false
    }
  });

  const [dateFilter, setDateFilter] = useState({
    startDate: '',
    endDate: ''
  });

  const [loading, setLoading] = useState(false);

  const fetchDashboardData = async (startDate?: string, endDate?: string) => {
    setLoading(true);
    try {
      const response = await getAdminDashboardData(startDate, endDate);
      console.log("Dashboard data:", response);

   setDashboardData({
  totalRevenue: response.data?.totalRevenue,
  totalUsers: response.data?.totalUsers,
  totalDoctors: response.data?.totalDoctors,
  activeUsers: response.data?.activeUsers,
  adminRevenue: response.data?.adminRevenue,
  doctorRevenue: response.data?.doctorRevenue,
  activeDoctors: response.data?.activeDoctors,
  userDoctorChartData: response.data?.userDoctorChartData || [], // fallback to []
  totalBookings: response.data?.totalBookings,
  dateFilter: response.data?.dateFilter || {
    startDate: null,
    endDate: null,
    isFiltered: false
  }
});


    } catch (error) {
      console.error("Error fetching dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

    type DateFilterField = "startDate" | "endDate" | "isFiltered";
  const handleDateFilterChange = (field: DateFilterField, value: string | boolean | null)=> {
    setDateFilter(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const applyDateFilter = () => {
    if (dateFilter.startDate && dateFilter.endDate && 
        new Date(dateFilter.startDate) > new Date(dateFilter.endDate)) {
      alert("Start date cannot be later than end date");
      return;
    }
    
    fetchDashboardData(
      dateFilter.startDate || undefined, 
      dateFilter.endDate || undefined
    );
  };

  const clearDateFilter = () => {
    setDateFilter({
      startDate: '',
      endDate: ''
    });
    fetchDashboardData();
  };

  const downloadExcelReport = () => {
    // Add filter info to summary
    const filterInfo = dashboardData.dateFilter.isFiltered 
      ? [
          ["Filter Applied", ""],
          ["Start Date", dashboardData.dateFilter.startDate || "Not specified"],
          ["End Date", dashboardData.dateFilter.endDate || "Not specified"],
          ["", ""]
        ]
      : [["No Date Filter Applied", ""], ["", ""]];

    // Prepare dashboard summary data
    const summaryData = [
      ["Dashboard Summary", ""],
      ...filterInfo,
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
    const revenueData = (dashboardData.userDoctorChartData as ChartDataItem[] || [])
      .filter((item) => item.doctorRevenue > 0 || item.adminRevenue > 0)
      .map((item) => ({
        name: `${item.month}/${item.year}`,
        doctorRevenue: item.doctorRevenue,
        adminRevenue: item.adminRevenue,
        totalRevenue: item.doctorRevenue + item.adminRevenue
      }))
      .sort((a, b) => {
        const [monthA, yearA] = a.name.split('/').map(Number);
        const [monthB, yearB] = b.name.split('/').map(Number);
        return new Date(yearA, monthA - 1).getTime() - new Date(yearB, monthB - 1).getTime();
      });

    const revenueTableData = [
      ["Monthly Revenue Report", "", "", ""],
      ["Month/Year", "Doctor Revenue", "Admin Revenue", "Total Revenue"],
      ...revenueData.map((item) => [
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
    const filterSuffix = dashboardData.dateFilter.isFiltered ? "_Filtered" : "";
    const fileName = `Admin_Dashboard_Report${filterSuffix}_${currentDate}.xlsx`;

    // Save the file
    XLSX.writeFile(wb, fileName);
  };

  return (
    <div className="flex flex-col p-4 space-y-8 max-w-full overflow-x-hidden">
      <div className="w-full flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Welcome to Admin Dashboard</h1>
        <button
          onClick={downloadExcelReport}
          disabled={loading}
          className="flex items-center space-x-2 bg-[#00897B] hover:bg-[#00695C] text-white px-4 py-2 rounded-lg shadow-md transition-colors duration-300 disabled:opacity-50"
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
            <h3 className="text-2xl font-bold mt-2">₹{dashboardData.totalRevenue}</h3>
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

      {/* Revenue Report Table with Integrated Filter - Full Width */}
      <div className="w-full bg-white p-6 shadow-lg rounded-lg mt-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Monthly Revenue Report</h2>
          {dashboardData.dateFilter.isFiltered && (
            <span className="text-sm text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
              Filtered Results
            </span>
          )}
        </div>

        {/* Date Filter Section - Now inside the table section */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <FaCalendar className="mr-2 text-[#00897B]" />
            Filter by Date Range
          </h3>
          
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={dateFilter.startDate}
                onChange={(e) => handleDateFilterChange('startDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00897B] focus:border-transparent"
              />
            </div>
            
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={dateFilter.endDate}
                onChange={(e) => handleDateFilterChange('endDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00897B] focus:border-transparent"
                min={dateFilter.startDate}
              />
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={applyDateFilter}
                disabled={loading}
                className="px-4 py-2 bg-[#00897B] text-white rounded-lg hover:bg-[#00695C] transition-colors disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'Apply Filter'}
              </button>
              
              <button
                onClick={clearDateFilter}
                disabled={loading}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Filter Status Display */}
          {dashboardData.dateFilter.isFiltered && (
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800 text-sm">
                <strong>Filter Applied:</strong> 
                {dashboardData.dateFilter.startDate && ` From ${dashboardData.dateFilter.startDate}`}
                {dashboardData.dateFilter.endDate && ` To ${dashboardData.dateFilter.endDate}`}
              </p>
            </div>
          )}
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00897B]"></div>
            <span className="ml-2">Loading...</span>
          </div>
        ) : (
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
                  .filter((item) => item.doctorRevenue > 0 || item.adminRevenue > 0)
                  .map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="py-3 px-4 border text-center">{item.month}/{item.year}</td>
                      <td className="py-3 px-4 border text-center">₹{item.doctorRevenue.toFixed(2)}</td>
                      <td className="py-3 px-4 border text-center">₹{item.adminRevenue.toFixed(2)}</td>
                      <td className="py-3 px-4 border text-center font-semibold">
                        ₹{(item.doctorRevenue + item.adminRevenue).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                {dashboardData.userDoctorChartData
                  .filter((item) => item.doctorRevenue > 0 || item.adminRevenue > 0).length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-gray-500">
                      No revenue data found for the selected period.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;