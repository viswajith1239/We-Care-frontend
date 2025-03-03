import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBars, FaChartPie, FaListAlt, FaCheckCircle, FaUsers, FaSignOutAlt } from "react-icons/fa";

function AdminSideBar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation(); // Get current route

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Define a function to check if a link is active
  const isActive = (path: string) => location.pathname === path ? "bg-gray-400 bg-opacity-50" : "hover:bg-gray-400 hover:bg-opacity-25";;

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
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col space-y-6">
          <Link
            to="/admin/dashboard"
            className={`flex items-center px-4 py-2 text-gray-100 rounded-2xl hover:bg-gray-400 hover:bg-opacity-25 ${isActive("/admin/dashboard")}`}
          >
            <FaChartPie size={22} />
            <span className={`ml-3 ${!isSidebarOpen && "hidden"}`}>Dashboard</span>
          </Link>

          <Link
            to="/admin/specialisations"
            className={`flex items-center px-4 py-2 text-gray-100 rounded-2xl hover:bg-gray-400 hover:bg-opacity-25 ${isActive("/admin/specialisations")}`}
          >
            <FaListAlt size={22} />
            <span className={`ml-3 ${!isSidebarOpen && "hidden"}`}>Specializations</span>
          </Link>

          <Link
            to="/admin/verification"
            className={`flex items-center px-4 py-2 text-gray-100 rounded-2xl hover:bg-gray-400 hover:bg-opacity-25 ${isActive("/admin/verification")}`}
          >
            <FaCheckCircle size={22} />
            <span className={`ml-3 ${!isSidebarOpen && "hidden"}`}>Verification</span>
          </Link>

          <Link
            to="/admin/user-listing"
            className={`flex items-center px-4 py-2 text-gray-100 rounded-2xl hover:bg-gray-400 hover:bg-opacity-25 ${isActive("/admin/user-listing")}`}
          >
            <FaUsers size={22} />
            <span className={`ml-3 ${!isSidebarOpen && "hidden"}`}>Users</span>
          </Link>

          <Link
            to="/admin/login"
            className={`flex items-center px-4 py-2 text-gray-100 rounded-2xl hover:bg-gray-400 hover:bg-opacity-25 ${isActive("/admin/login")}`}
          >
            <FaSignOutAlt size={22} />
            <span className={`ml-3 ${!isSidebarOpen && "hidden"}`}>Logout</span>
          </Link>
        </nav>
      </div>
    </div>
  );
}

export default AdminSideBar;
