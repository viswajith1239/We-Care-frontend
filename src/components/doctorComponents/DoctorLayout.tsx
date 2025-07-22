import React, { useEffect, useRef, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { BsBell } from "react-icons/bs";
import { Outlet, useNavigate } from "react-router-dom";
import DoctorSideBar from "./DoctorSideBar";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { useNotification } from "../../context/NotificationContext";
import { clearDoctorNotification, getDoctorNotification } from "../../service/doctorService";
// import { FaQuoteLeft, FaQuoteRight } from "react-icons/fa";
// import img from "../../assets/cartoon dashboard.png"


const DoctorLayout: React.FC = () => {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const { doctorInfo } = useSelector((state: RootState) => state.doctor);
  console.log("ffff", doctorInfo._id);

  const { doctorNotifications, addDoctorNotification, clearDoctorNotifications, updateDoctorNotificationReadStatus } = useNotification();


  const navigate = useNavigate();
  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const toggleNotificationDropdown = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      profileRef.current &&
      !profileRef.current.contains(event.target as Node) &&
      notificationRef.current &&
      !notificationRef.current.contains(event.target as Node)
    ) {
      setIsProfileDropdownOpen(false);
      setIsNotificationOpen(false);
    }
  };

  useEffect(() => {
    const fetchNotification = async () => {
      try {
        if (doctorInfo.id) {
          const response = await getDoctorNotification(doctorInfo.id)
          console.log("hhhh", response);

          const serverNotifications = response.data.notifications || [];
          serverNotifications.forEach((notif: { content: string }) => {
            addDoctorNotification(notif.content);
          }
          );
        }
      } catch (error) {
        console.error("Failed to fetch notifications:", error);

      }
    }
    fetchNotification()
  }, [doctorInfo?.id])

  const handleClear = async () => {
    try {
      const response = await clearDoctorNotification(doctorInfo.id)

      if (response.status === 200) {
        clearDoctorNotifications();
        toast.success(response.data.message);
      } else {
        toast.error("Failed to clear notifications.");
      }
    } catch (error) {
      console.error("Error clearing notifications:", error);
      toast.error("An error occurred while clearing notifications.");
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="h-screen flex bg-slate-100">
      <DoctorSideBar />

      <div className="flex-1 flex flex-col">
        <header className="bg-gradient-to-r from-[#5cbba8] to-[#5cbba8] text-white shadow-md py-4 px-6 flex items-center justify-between border rounded-lg ">
          <h1 className="text-2xl font-semibold">Doctor Dashboard</h1>

          <div className="flex items-center space-x-6">

            <div className="relative" ref={notificationRef}>
              <BsBell
                className="h-6 w-6 cursor-pointer"
                onClick={toggleNotificationDropdown}
              />
              <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-600 rounded-full">
                {doctorNotifications.length}
              </span>

              {isNotificationOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white text-gray-800 shadow-lg rounded-lg z-10">
                  <div className="p-4">
                    <h3 className="text-lg font-semibold border-b pb-2">
                      Notifications
                    </h3>
                    {doctorNotifications.length > 0 ? (
                      <>
                        <ul className="space-y-3 mt-2 max-h-64 overflow-y-auto">
                          {doctorNotifications.map((notification, index) => (
                            <li
                              key={index}
                              className={`text-sm text-gray-700 border-b pb-2 ${notification.read
                                  ? "opacity-50 bg-gray-100"
                                  : "bg-[#e0f0e0]"
                                }`}
                            >
                              {typeof notification.message === "string"
                                ? notification.message
                                : "Invalid message"}
                            </li>
                          ))}
                        </ul>
                        <div className="flex justify-end mt-2">
                          <button
                            onClick={handleClear}
                            className="text-gray-800"
                          >
                            Clear
                          </button>
                        </div>
                      </>
                    ) : (
                      <p className="text-sm text-gray-500">
                        No new notifications
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>


            <div className="relative" ref={profileRef}>
              <FaUserCircle
                className="text-2xl cursor-pointer"
                onClick={toggleProfileDropdown}
              />
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 shadow-lg rounded-lg z-10">
                  <ul className="py-1">
                    <li
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        navigate("/doctor/profile");
                        setIsProfileDropdownOpen(false);
                      }}
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

        <div className="flex-1 p-6 bg-slate-100 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default DoctorLayout;