import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaBars,
  FaChartPie,
  FaUsers,
  FaSignOutAlt,
  FaEnvelope,
  FaCalendarCheck,
  FaWallet,
  FaFileMedical,
  FaFileAlt,
  FaTimes
} from "react-icons/fa";
import logo_img from "../../assets/wmremove-transformed.png"
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import { logoutDoctor } from "../../action/doctorActions";

function DoctorSideBar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

 
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsSidebarOpen(false);
      } else {
        setIsMobileMenuOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
      setIsMobileMenuOpen(!isMobileMenuOpen);
    } else {
      setIsSidebarOpen(!isSidebarOpen);
    }
  };

  const closeMobileMenu = () => {
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  };

  const isActive = (path: string) =>
    location.pathname === path
      ? "bg-gray-400 bg-opacity-50"
      : "hover:bg-gray-400 hover:bg-opacity-25";

  const handleLogout = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); 
    dispatch(logoutDoctor());
    navigate("/doctor/login");
  };


  const MobileOverlay = () => (
    isMobile && isMobileMenuOpen && (
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
        onClick={closeMobileMenu}
      />
    )
  );


  const getSidebarClasses = () => {
    if (isMobile) {
      return `fixed left-0 top-0 h-full z-50 transform transition-transform duration-300 ease-in-out ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      } w-64 bg-[#00897B] text-white flex flex-col rounded-r-2xl md:rounded-2xl overflow-hidden`;
    } else {
      return `${
        isSidebarOpen ? "w-64" : "w-20"
      } bg-[#00897B] text-white flex flex-col transition-all duration-300 rounded-2xl overflow-hidden min-h-0`;
    }
  };

  const shouldShowText = isMobile ? true : isSidebarOpen;

  return (
    <>

      {isMobile && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 p-2 bg-[#00897B] text-white rounded-lg shadow-lg md:hidden"
        >
          <FaBars size={20} />
        </button>
      )}

      <MobileOverlay />

      <div className="flex h-screen bg-gray-100">
        <div className={getSidebarClasses()}>

          <div className="flex justify-between items-center p-5 pb-3 flex-shrink-0">
            <button onClick={toggleSidebar} className="text-white">
              {isMobile && isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
            {shouldShowText && (
              <img
                src={logo_img}
                alt="WeCare Logo"
                className="w-28 h-12 rounded-full object-cover mr-14"
              />
            )}
          </div>

          <div className="flex-1 overflow-y-auto px-5 pb-5">
            <nav className="flex flex-col space-y-3">
            <Link
              to=""
              onClick={closeMobileMenu}
              className={`flex items-center px-4 py-2 text-gray-100 rounded-2xl ${isActive("")}`}
            >
              <FaChartPie size={22} />
              <span className={`ml-3 ${!shouldShowText && "hidden"}`}>Dashboard</span>
            </Link>

            <Link
              to="/doctor/scheduleappoinments"
              onClick={closeMobileMenu}
              className={`flex items-center p-3 text-gray-100 rounded-2xl ${isActive("/doctor/scheduleappoinments")}`}
            >
              <FaUsers size={22} />
              <span className={`ml-3 text-sm ${!shouldShowText && "hidden"}`}>Schedule Appointment</span>
            </Link>

            <Link
              to="/doctor/bookings"
              onClick={closeMobileMenu}
              className={`flex items-center px-4 py-2 text-gray-100 rounded-2xl ${isActive("/doctor/bookings")}`}
            >
              <FaCalendarCheck size={22} />
              <span className={`ml-3 ${!shouldShowText && "hidden"}`}>Appointments</span>
            </Link>

            <Link
              to="/doctor/messages"
              onClick={closeMobileMenu}
              className={`flex items-center px-4 py-2 text-gray-100 rounded-2xl ${isActive("/doctor/messages")}`}
            >
              <FaEnvelope size={22} />
              <span className={`ml-3 ${!shouldShowText && "hidden"}`}>Messages</span>
            </Link>

            <Link
              to="/doctor/wallet"
              onClick={closeMobileMenu}
              className={`flex items-center px-4 py-2 text-gray-100 rounded-2xl ${isActive("/doctor/wallet")}`}
            >
              <FaWallet size={22} />
              <span className={`ml-3 ${!shouldShowText && "hidden"}`}>Wallet</span>
            </Link>

            <Link
              to="/doctor/prescriptions"
              onClick={closeMobileMenu}
              className={`flex items-center px-4 py-2 text-gray-100 rounded-2xl ${isActive("/doctor/prescriptions")}`}
            >
              <FaFileMedical size={22} />
              <span className={`ml-3 ${!shouldShowText && "hidden"}`}>Medication history</span>
            </Link>

            <Link
              to="/doctor/reports"
              onClick={closeMobileMenu}
              className={`flex items-center px-4 py-2 text-gray-100 rounded-2xl ${isActive("/doctor/reports")}`}
            >
              <FaFileAlt size={22} />
              <span className={`ml-3 ${!shouldShowText && "hidden"}`}>Medical reports</span>
            </Link>

            <div className={`flex items-center px-4 py-2 text-gray-100 rounded-2xl ${isActive("/doctor/login")}`}>
              <FaSignOutAlt size={22} />
              <button
                onClick={(e) => {
                  handleLogout(e);
                  closeMobileMenu();
                }}
                className={`ml-3 ${!shouldShowText && "hidden"}`}
              >
                Logout
              </button>
            </div>
            </nav>
          </div>
        </div>


        <div className={`flex-1 transition-all duration-300 ${
          !isMobile && isSidebarOpen ? 'ml-0' : ''
        }`}>
        
        </div>
      </div>
    </>
  );
}

export default DoctorSideBar;