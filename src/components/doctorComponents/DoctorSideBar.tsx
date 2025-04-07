import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaBars,
  FaChartPie,
  FaUsers,
  FaSignOutAlt,
  FaEnvelope,
  FaCalendarCheck,
  FaWallet,
  FaFileMedical
} from "react-icons/fa";

function DoctorSideBar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const isActive = (path: string) =>
    location.pathname === path
      ? "bg-gray-400 bg-opacity-50"
      : "hover:bg-gray-400 hover:bg-opacity-25";

  return (
    <div className="flex h-screen bg-gray-100">
      <div
        className={`${
          isSidebarOpen ? "w-64" : "w-20"
        } bg-[#00897B] text-white flex flex-col p-5 transition-all duration-300 rounded-2xl`}
      >
        <div className="flex justify-between items-center mb-6">
          <button onClick={toggleSidebar} className="text-white">
            <FaBars size={24} />
          </button>
        </div>

        <nav className="flex flex-col space-y-6">
          <Link
            to=""
            className={`flex items-center px-4 py-2 text-gray-100 rounded-2xl ${isActive("")}`}
          >
            <FaChartPie size={22} />
            <span className={`ml-3 ${!isSidebarOpen && "hidden"}`}>Dashboard</span>
          </Link>

          <Link
            to="/doctor/scheduleappoinments"
            className={`flex items-center p-3 text-gray-100 rounded-2xl ${isActive("/doctor/scheduleappoinments")}`}
          >
            <FaUsers size={22} />
            <span className={`ml-3 text-sm ${!isSidebarOpen && "hidden"}`}>Schedule Appointment</span>
          </Link>

          <Link
            to="/doctor/bookings"
            className={`flex items-center px-4 py-2 text-gray-100 rounded-2xl ${isActive("/doctor/bookings")}`}
          >
            <FaCalendarCheck size={22} />
            <span className={`ml-3 ${!isSidebarOpen && "hidden"}`}>Appoinments</span>
          </Link>

          <Link
            to="/doctor/messages"
            className={`flex items-center px-4 py-2 text-gray-100 rounded-2xl ${isActive("/doctor/messages")}`}
          >
            <FaEnvelope size={22} />
            <span className={`ml-3 ${!isSidebarOpen && "hidden"}`}>Messages</span>
          </Link>

          <Link
            to="/doctor/wallet"
            className={`flex items-center px-4 py-2 text-gray-100 rounded-2xl ${isActive("/doctor/wallet")}`}
          >
            <FaWallet size={22} />
            <span className={`ml-3 ${!isSidebarOpen && "hidden"}`}>Wallet</span>
          </Link>
          <Link
            to="/doctor/prescriptions"
            className={`flex items-center px-4 py-2 text-gray-100 rounded-2xl ${isActive("/doctor/prescriptions")}`}
          >
            <FaFileMedical size={22} />
            <span className={`ml-3 ${!isSidebarOpen && "hidden"}`}>Precriptions</span>
          </Link>

          <Link
            to="/doctor/login"
            className={`flex items-center px-4 py-2 text-gray-100 rounded-2xl ${isActive("/doctor/login")}`}
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