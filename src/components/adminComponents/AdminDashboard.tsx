import { GrMoney } from "react-icons/gr";
import {  FaUser ,FaUserDoctor} from "react-icons/fa6";
// import { Link } from "react-router-dom";
import { useState,useEffect } from "react";
import adminAxiosInstance from "../../axios/adminAxiosInstance";
import RevenueChart from "./RevenueChart";
import UserDoctorChart from "./UserDoctorChart";
import API_URL from "../../axios/API_URL";



function AdminDashboard() {

  const [dashboardData, setDashboardData] = useState({
    totalRevenue: 0,
    totalUsers: 0,
    totalDoctors: 0,
    activeUsers: 0,
    adminRevenue: 0,
    doctorRevenue: 0,
    activeDoctors: 0,
    totalBookings:0,
    userDoctorChartData

: [],
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await adminAxiosInstance.get(`${API_URL}/admin/dashboardData`); 
        console.log("nnnn",response);
        

        setDashboardData({
          totalRevenue: response.data.data.totalRevenue,
          totalUsers: response.data.data.totalUsers,
          totalDoctors: response.data.data.totalDoctors,
          activeUsers: response.data.data.activeUsers,
          adminRevenue: response.data.data.adminRevenue,
          doctorRevenue: response.data.data.doctorRevenue,  
          activeDoctors: response.data.data.activeDoctors,
          userDoctorChartData: response.data.data.userDoctorChartData,
          totalBookings:response.data.data.totalBookings
        });
        
      } catch (error: any) {
        console.error("Error fetching dashboard data", error);
      }
    };

    fetchDashboardData();
  }, []);




  return (
  
    <div className="flex flex-col p-4  space-y-8">
        <div className="w-full flex justify-center">
    <h1 className="text-3xl font-bold text-gray-800">Welcome to Admin Dashboard</h1>
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


    <div className="w-[100%] h-[450px] flex space-x-10">
      <div className="w-[50%] bg-white p-10 shadow-lg rounded-lg">
        <RevenueChart data={dashboardData.userDoctorChartData} />
      </div>
      <div className="w-[50%] bg-white p-10 shadow-lg rounded-lg">
        <UserDoctorChart data={dashboardData.userDoctorChartData} />
      </div>
    </div>
  </div>
  );
}

export default AdminDashboard;