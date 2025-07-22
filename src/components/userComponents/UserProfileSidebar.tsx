import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBars, FaChartPie, FaUsers, FaCalendarCheck, FaEnvelope, FaFileMedical, FaFileUpload, FaWallet } from "react-icons/fa";

function UserProfileSidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };


  const isActive = (path: string) => location.pathname === path ? "bg-gray-400 bg-opacity-50" : "hover:bg-gray-400 hover:bg-opacity-25";;

  return (
    <div className="flex h-full bg-gray-100">


      <div
        className={`${isSidebarOpen ? "w-64" : "w-20"
          } bg-[#00897B] text-white flex flex-col p-5 transition-all duration-300 rounded-2xl`}
      >


        <div className="flex justify-between items-center mb-6">
          <button onClick={toggleSidebar} className="text-white">
            <FaBars size={24} />
          </button>
        </div>


        <nav className="flex flex-col space-y-5">
          <Link
            to=""
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
            to="message"
            className={`flex items-center px-4 py-2 text-gray-100 rounded-2xl hover:bg-gray-400 hover:bg-opacity-25 ${isActive("/profile/message")}`}
          >
            <FaEnvelope size={22} />
            <span className={`ml-3 ${!isSidebarOpen && "hidden"}`}>Message</span>
          </Link>

          <Link
            to="wallet"
            className={`flex items-center px-4 py-2 text-gray-100 rounded-2xl hover:bg-gray-400 hover:bg-opacity-25 ${isActive("/profile/wallet")}`}
          >
            <FaWallet size={22} />
            <span className={`ml-3 ${!isSidebarOpen && "hidden"}`}>Wallet</span>
          </Link>




          <Link
            to="reports"
            className={`flex items-center px-4 py-2 text-gray-100 rounded-2xl hover:bg-gray-400 hover:bg-opacity-25 ${isActive("/profile/reports")}`}
          >
            <FaFileUpload size={22} />
            <span className={`ml-3 ${!isSidebarOpen && "hidden"}`}>Add Medical Reports</span>
          </Link>

          <Link
            to="prescriptions"
            className={`flex items-center px-4 py-2 text-gray-100 rounded-2xl hover:bg-gray-400 hover:bg-opacity-25 ${isActive("/profile/prescriptions")}`}
          >
            <FaFileMedical size={22} />
            <span className={`ml-3 ${!isSidebarOpen && "hidden"}`}>Precriptions</span>
          </Link>


        </nav>
      </div>
    </div>
  );
}

export default UserProfileSidebar;
