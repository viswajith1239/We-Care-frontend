import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBars, FaChartPie, FaListAlt, FaCheckCircle, FaUsers, FaSignOutAlt, FaCalendarCheck, FaCalendarAlt, FaEnvelope } from "react-icons/fa";

function UserProfileSidebar() {
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
        <nav className="flex flex-col space-y-10">
          <Link
            to="/admin/dashboard"
            className={`flex items-center px-4 py-2 text-gray-100 rounded-2xl hover:bg-gray-400 hover:bg-opacity-25 ${isActive("")}`}
          >
            <FaChartPie size={22} />
            <span className={`ml-3 ${!isSidebarOpen && "hidden"}`}>Dashboard</span>
          </Link>

          <Link
            to="/profile"
            className={`flex items-center px-4 py-2 text-gray-100 rounded-2xl hover:bg-gray-400 hover:bg-opacity-25 ${isActive("/profile")} `}
          >
            <FaUsers size={22} />
            <span className={`ml-3 ${!isSidebarOpen && "hidden"}`}>Profile</span>
          </Link>

          <Link
            to="bookings"
            className={`flex items-center px-4 py-2 text-gray-100 rounded-2xl hover:bg-gray-400 hover:bg-opacity-25 ${isActive("/profile/bookings")}`}
          >
            <FaCalendarCheck size={22} />
            <span className={`ml-3 ${!isSidebarOpen && "hidden"}`}>Bookings</span>
          </Link>

          <Link
            to=""
            className={`flex items-center px-4 py-2 text-gray-100 rounded-2xl hover:bg-gray-400 hover:bg-opacity-25 ${isActive("")}`}
          >
            <FaCalendarAlt  size={22} />
            <span className={`ml-3 ${!isSidebarOpen && "hidden"}`}>Appoinments</span>
          </Link>

          <Link
            to=""
            className={`flex items-center px-4 py-2 text-gray-100 rounded-2xl hover:bg-gray-400 hover:bg-opacity-25 ${isActive("")}`}
          >
            <FaEnvelope  size={22} />
            <span className={`ml-3 ${!isSidebarOpen && "hidden"}`}>Message</span>
          </Link>

          
        </nav>
      </div>
    </div>
  );
}

export default UserProfileSidebar;
