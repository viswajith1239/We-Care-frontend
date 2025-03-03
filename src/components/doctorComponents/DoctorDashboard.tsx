import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
import doctorAxiosInstance from "../../axios/doctorAxiosInstance";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import API_URL from "../../axios/API_URL";
import { FaRegCalendarAlt } from "react-icons/fa";

interface Specialization {
  name: string;
  _id: string;
}

interface BookingDetail {
  name: string;
  _id: string;
  startDate: string;
  startTime: string;
  appoinmentEndTime: string;
  specialization: Specialization;
  paymentStatus: string;
  appoinmentStatus?: string;
  userId: { _id: string; name: string };
}

function DoctorDashboard() {
  const [bookingDetails, setBookingDetails] = useState<BookingDetail[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const appoinmentsPerPage = 3;
  // const navigate = useNavigate();
  const { doctorInfo } = useSelector((state: RootState) => state.doctor);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (!doctorInfo?.id) return;
      try {
        const response = await doctorAxiosInstance.get(
          `${API_URL}/doctor/bookingdetails/${doctorInfo.id}`
        );
        const upcomingAppoinmets = response.data.data.filter(
          (appoinmet: BookingDetail) => new Date(appoinmet.startDate) >= new Date()
        );
        setBookingDetails(upcomingAppoinmets);
      } catch (error) {
        console.error("Error fetching booking details:", error);
      }
    };
    fetchBookingDetails();
  }, [doctorInfo.id]);

  const uniqueUserIds = new Set(bookingDetails.map((booking) => booking.userId._id));
  const totalUsers = uniqueUserIds.size;

  const indexOfLastAppoinmets = currentPage * appoinmentsPerPage;
  const indexOfFirstAppoinmets = indexOfLastAppoinmets - appoinmentsPerPage;
  const currentAppoinments = bookingDetails.slice(indexOfFirstAppoinmets, indexOfLastAppoinmets);
  const totalPages = Math.max(1, Math.ceil(bookingDetails.length / appoinmentsPerPage));

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Doctor Dashboard</h1>
        
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 justify-center">
        <FaRegCalendarAlt className="text-gray-600 w-5 h-5" />
        Total Appointments
        </h3>
<p className="text-2xl font-bold text-gray-700">{bookingDetails.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <h3 className="text-lg font-semibold text-gray-800">👥 Active Doctors</h3>
          <p className="text-2xl font-bold text-gray-700">{totalUsers}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6 mt-8">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-4 justify-center">
           <FaRegCalendarAlt className="text-gray-600 w-6 h-6" /> Upcoming Appoinments
        </h2>
        <div className="overflow-hidden rounded-lg border border-gray-200">
          <table className="w-full border-collapse rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-2 px-4  bg-[#00897B] text-white"> Name</th>
                <th className="py-2 px-4  bg-[#00897B] text-white ">Date</th>
                <th className="py-2 px-4  bg-[#00897B] text-white">Time</th>
                <th className="py-2 px-4  bg-[#00897B] text-white">Payment Status</th>
              </tr>
            </thead>
            <tbody>
              {currentAppoinments.length > 0 ? (
                currentAppoinments.map((appoinment) => (
                  <tr key={appoinment._id} className="border-t">
                    <td className="py-2 px-4 text-center">{appoinment.userId.name}</td>
                    <td className="py-2 px-4 text-center">
                      {new Date(appoinment.startDate).toLocaleDateString("en-US")}
                    </td>
                    <td className="py-2 px-4 text-center">{appoinment.startTime}</td>
                    <td
                      className={`py-2 px-4 font-semibold text-center ${
                        appoinment.paymentStatus === "Confirmed" ? "text-green-600" : "text-red-500"
                      }`}
                    >
                      {appoinment.paymentStatus}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-4 text-center text-gray-500">
                    No upcoming appoinments.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-4">
            <button
              className="px-4 py-2 bg-gray-300  rounded-md hover:bg-[#00897B] disabled:opacity-50 text-black"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="px-4 py-2 bg-gray-300  rounded-md hover:bg-[#00897B] disabled:opacity-50 text-black"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next 
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default DoctorDashboard;
