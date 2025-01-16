import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { BsBell } from "react-icons/bs";
import { Outlet, useNavigate } from "react-router-dom";
import DoctorSideBar from "./DoctorSideBar";
// import { FaQuoteLeft, FaQuoteRight } from "react-icons/fa";
// import img from "../../assets/cartoon dashboard.png"


const DoctorLayout: React.FC = () => {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const navigate = useNavigate();

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const toggleNotificationDropdown = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };

  return (
    <div className="h-screen flex bg-slate-100">
      {/* Sidebar */}
      <DoctorSideBar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="bg-gradient-to-r from-[#5cbba8] to-[#5cbba8] text-white shadow-md py-4 px-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Doctor Dashboard</h1>

          <div className="flex items-center space-x-6">
            {/* Notifications */}
            <div className="relative">
              <BsBell
                className="h-6 w-6 cursor-pointer"
                onClick={toggleNotificationDropdown}
              />
              <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-600 rounded-full">
                3
              </span>
              {isNotificationOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white text-gray-800 shadow-lg rounded-lg z-10">
                  <div className="p-4">
                    <h3 className="text-lg font-semibold border-b pb-2">
                      Notifications
                    </h3>
                    <ul className="space-y-2 mt-2 max-h-40 overflow-y-auto">
                      <li className="text-sm">Notification 1</li>
                      <li className="text-sm">Notification 2</li>
                      <li className="text-sm">Notification 3</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="relative">
              <FaUserCircle
                className="text-2xl cursor-pointer"
                onClick={toggleProfileDropdown}
              />
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 shadow-lg rounded-lg z-10">
                  <ul className="py-1">
                    <li
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => navigate("/doctor/profile")}
                    >
                      My Profile
                    </li>
                    {/* <li
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => navigate("/doctor/login")}
                    >
                      Logout
                    </li> */}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </header>
        <section className="flex justify-center items-center bg-gradient-to-r from-[#5cbba8] via-white to-[#5cbba8]">
  
</section>




        {/* Content Area */}
        <div className="flex-1 p-6 bg-slate-100 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DoctorLayout;