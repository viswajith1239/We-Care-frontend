// import React from 'react';

function DoctorDashboard() {
  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col">

      {/* Header Section */}
      <div className="bg-[#572c52] p-4 text-white flex items-center justify-between rounded-t-lg">
        <h1 className="text-2xl font-bold">Doctor Dashboard</h1>
        <div className="flex items-center gap-4">
          <span>Welcome, Doctor</span>
          <button className="bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-600 transition">Logout</button>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="flex flex-col md:flex-row gap-6 mt-6">

        {/* Sidebar */}
        <div className="bg-white shadow-lg rounded-lg p-4 w-full md:w-1/4">
          <ul className="space-y-4">
            <li>
              <a href="/doctor-dashboard" className="text-gray-700 hover:text-[#572c52]">Dashboard</a>
            </li>
            <li>
              <a href="/trainer-profile" className="text-gray-700 hover:text-[#572c52]">My Profile</a>
            </li>
            <li>
              <a href="/doctor-kyc" className="text-gray-700 hover:text-[#572c52]">KYC Verification</a>
            </li>
            <li>
              <a href="/trainer-courses" className="text-gray-700 hover:text-[#572c52]">Courses</a>
            </li>
            <li>
              <a href="/trainer-stats" className="text-gray-700 hover:text-[#572c52]">Statistics</a>
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-white shadow-lg rounded-lg p-6 space-y-6">
          
          {/* Trainer Overview */}
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold text-[#572c52]">Overview</h3>
              <p className="text-gray-600">Welcome back! Here's your activity and KYC status.</p>
            </div>
            <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition">Update Profile</button>
          </div>

          {/* KYC Status Card */}
          <div className="bg-gray-50 p-4 rounded-lg shadow-md">
            <h4 className="text-lg font-semibold text-[#572c52]">KYC Status</h4>
            <div className="flex justify-between items-center mt-4">
              <span className="text-gray-600">Status: <strong>Pending</strong></span>
              <button className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition">Check KYC</button>
            </div>
          </div>

          {/* Upcoming Courses */}
          <div className="bg-gray-50 p-4 rounded-lg shadow-md">
            <h4 className="text-lg font-semibold text-[#572c52]">Upcoming Courses</h4>
            <ul className="mt-4">
              <li className="flex justify-between items-center py-2">
                <span className="text-gray-700">Course 1</span>
                <span className="text-gray-500">01/01/2024</span>
              </li>
              <li className="flex justify-between items-center py-2">
                <span className="text-gray-700">Course 2</span>
                <span className="text-gray-500">10/01/2024</span>
              </li>
              <li className="flex justify-between items-center py-2">
                <span className="text-gray-700">Course 3</span>
                <span className="text-gray-500">20/01/2024</span>
              </li>
            </ul>
          </div>

          {/* Activity Stats */}
          <div className="bg-gray-50 p-4 rounded-lg shadow-md">
            <h4 className="text-lg font-semibold text-[#572c52]">Activity Statistics</h4>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="text-center">
                <h5 className="font-medium text-gray-600">Total Students</h5>
                <p className="text-2xl font-bold text-[#572c52]">150</p>
              </div>
              <div className="text-center">
                <h5 className="font-medium text-gray-600">Total Courses</h5>
                <p className="text-2xl font-bold text-[#572c52]">12</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorDashboard;