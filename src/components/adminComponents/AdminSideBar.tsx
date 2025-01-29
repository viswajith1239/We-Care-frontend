import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaChartPie, FaListAlt, FaCheckCircle, FaUsers, FaSignOutAlt } from "react-icons/fa";
// import LOGO from "./path/to/logo";

function AdminSideBar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    
    <div className="flex h-screen bg-gray-100">
      
      {/* Sidebar */}
      <div
  className={`${
    isSidebarOpen ? "w-64" : "w-20"
  } bg-[#00897B] text-white flex flex-col p-5 transition-all duration-300 rounded-2xl`}
>
        
        {/* Sidebar Header */}
        <div className="flex justify-between items-center mb-6">
          <button onClick={toggleSidebar} className="text-white">
            <FaBars size={24} />
          </button>
          {isSidebarOpen && (
            <div className="flex items-center justify-center">
              {/* <img className="w-12 h-12 rounded-full" src={LOGO} alt="Logo" /> */}
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col space-y-6">
          <Link
            to=""
            className="flex items-center px-4 py-2 text-gray-100 hover:bg-gray-400 hover:bg-opacity-25 rounded-2xl"
          >
            <FaChartPie size={22} />
            <span className={`ml-3 ${!isSidebarOpen && "hidden"}`}>Dashboard</span>
          </Link>
          <Link
            to="/admin/specialisations"
            className="flex items-center px-4 py-2 text-gray-100 hover:bg-gray-400 hover:bg-opacity-25 rounded-2xl"
          >
            <FaListAlt size={22} />
            <span className={`ml-3 ${!isSidebarOpen && "hidden"}`}>Specializations</span>
          </Link>
          <Link
            to="/admin/verification"
            className="flex items-center px-4 py-2 text-gray-100 hover:bg-gray-400 hover:bg-opacity-25 rounded-2xl"
          >
            <FaCheckCircle size={22} />
            <span className={`ml-3 ${!isSidebarOpen && "hidden"}`}>Verification</span>
          </Link>
          {/* <Link
            to=""
            className="flex items-center px-4 py-2 text-gray-100 hover:bg-gray-400 hover:bg-opacity-25 rounded-2xl"
          >
            <FaUsers size={22} />
            <span className={`ml-3 ${!isSidebarOpen && "hidden"}`}>Trainers</span>
          </Link> */}
          <Link
            to="/admin/user-listing"
            className="flex items-center px-4 py-2 text-gray-100 hover:bg-gray-400 hover:bg-opacity-25 rounded-2xl"
          >
            <FaUsers size={22} />
            <span className={`ml-3 ${!isSidebarOpen && "hidden"}`}>Users</span>
          </Link>
          <Link
            to="/admin/login"
            className="flex items-center px-4 py-2 text-gray-100 hover:bg-gray-400 hover:bg-opacity-25 rounded-2xl"
          >
            <FaSignOutAlt size={22} />
            <span className={`ml-3 ${!isSidebarOpen && "hidden"}`}>Logout</span>
          </Link>
        </nav>
        
      </div>
      {/* <div className="p-4">
            <h1 className="text-2xl font-bold">Welcome to Admin dashboard!</h1>

        </div> */}
    </div>
  );
}

export default AdminSideBar;
