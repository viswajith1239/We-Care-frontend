import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaBars,
  FaChartPie,
  // FaListAlt,
  FaUsers,
  FaSignOutAlt,
} from "react-icons/fa";

function DoctorSideBar() {
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
              {/* Logo placeholder */}
              {/* Add logo here if needed */}
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
          {/* <Link
            to=""
            className="flex items-center px-4 py-2 text-gray-100 hover:bg-gray-400 hover:bg-opacity-25 rounded-2xl"
          >
            <FaListAlt size={22} />
            <span className={`ml-3 ${!isSidebarOpen && "hidden"}`}>Sessions</span>
          </Link> */}
          {/* <Link
            to=""
            className="flex items-center px-4 py-2 text-gray-100 hover:bg-gray-400 hover:bg-opacity-25 rounded-2xl"
          >
            <FaUsers size={22} />
            <span className={`ml-3 ${!isSidebarOpen && "hidden"}`}>Messages</span>
          </Link> */}
           <Link
            to="/doctor/scheduleappoinments"
            className="flex items-center p-3 text-gray-100 text-gray-100 hover:bg-gray-400 hover:bg-opacity-25 rounded-2xl "
          >
            <FaUsers size={22} />
            <span className={`ml-3 ${!isSidebarOpen && "hidden"}`}>Schedule Appoinment</span>
          </Link>
          <Link
            to="/doctor/login"
            className="flex items-center px-4 py-2 text-gray-100 hover:bg-gray-400 hover:bg-opacity-25 rounded-2xl"
          >
            <FaSignOutAlt size={22} />
            <span className={`ml-3 ${!isSidebarOpen && "hidden"}`}>Logout</span>
          </Link>
        </nav>
      </div>
    </div>
  );
}

export default DoctorSideBar;