

import { useState, useEffect } from "react";
import doctorAxiosInstance from "../../axios/doctorAxiosInstance";
import API_URL from "../../axios/API_URL";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import toast from "react-hot-toast";

interface BookingDetail {
  userId: { _id: string; name: string; email: string; phone: string };
  _id: string;
  startTime: string;
  endTime: string;
  paymentStatus: string;
  appoinmentStatus?: string;
  bookingDate: string;
}

function Bookings() {
  const [bookingDetails, setBookingDetails] = useState<BookingDetail[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState(1);
  const { doctorInfo } = useSelector((state: RootState) => state.doctor);
  const ITEMS_PER_PAGE = 5;

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      if (doctorInfo && doctorInfo.id) {
        const response = await doctorAxiosInstance.get( `${API_URL}/doctor/bookings/${doctorInfo.id}` );
        setBookingDetails(response.data || []);
      } else {
        console.log("Doctor ID not available");
      }
    } catch (error) {
      console.log("Error in fetching booking details", error);
      setBookingDetails([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookingDetails();
  }, [doctorInfo]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading bookings...</p>
      </div>
    );
  }

  const handleCancel = async (bookingId: string, userId: string) => {
    const result = await Swal.fire({
      title: "Do you want to cancel this appointment?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, cancel it!",
    });

    if (result.isConfirmed) {
      try {
        const response = await doctorAxiosInstance.post(
          `${API_URL}/doctor/cancel-booking`,
          { bookingId, userId }
        );
        toast.success("Appointment cancelled successfully!");
        fetchBookingDetails();
      } catch (error) {
        console.log("Error canceling appointment", error);
      }
    }
  };

  const totalPages = Math.ceil(bookingDetails.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedBookings = bookingDetails.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Your Appointments</h2>

      <div className="overflow-hidden rounded-lg border border-gray-200">
        <table className="w-full border-collapse rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-3 px-4 bg-[#00897B] text-white text-center">
                Patient Name
              </th>
              <th className="py-3 px-4 bg-[#00897B] text-white text-center">
                Email
              </th>
             
              <th className="py-3 px-4 bg-[#00897B] text-white text-center">
                Date
              </th>
              <th className="py-3 px-4 bg-[#00897B] text-white text-center">
                Time
              </th>
              <th className="py-3 px-4 bg-[#00897B] text-white text-center">
                Payment Status
              </th>
              <th className="py-3 px-4 bg-[#00897B] text-white text-center">
                Appointment Status
              </th>
              {/* <th className="py-3 px-4 bg-[#00897B] text-white text-center">
                Actions
              </th> */}
            </tr>
          </thead>
          <tbody>
            {paginatedBookings.length > 0 ? (
              paginatedBookings.map((booking) => (
                <tr key={booking._id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 border-b">
                    {booking.userId.name}
                  </td>
                  <td className="py-3 px-4 border-b">
                    {booking.userId.email}
                  </td>
                 
                  <td className="py-3 px-4 border-b">
                    {new Date(booking.bookingDate).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 border-b">
                    {booking.startTime} - {booking.endTime}
                  </td>
                  <td className="py-3 px-4 border-b">
                  <span className={`px-2 py-1 rounded-full text-xs ${
            booking.paymentStatus?.toLowerCase() === 'completed' ? 'bg-green-100 text-green-800' :
            booking.paymentStatus?.toLowerCase() === 'pending' ? 'bg-yellow-100 text-yellow-800' :
            booking.paymentStatus?.toLowerCase() === 'confirmed' ? 'bg-green-100 text-white-800' :
            'bg-red-100 text-red-800'
          }`}>
            {booking.paymentStatus}
          </span>
                  </td>
                  <td className="py-3 px-4 border-b">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        booking.appoinmentStatus === "completed"
                          ? "bg-green-100 text-green-800"
                          : booking.appoinmentStatus === "scheduled"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {booking.appoinmentStatus || "Not Started"}
                    </span>
                  </td>
                  {/* <td className="py-3 px-4 border-b">
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                      onClick={() =>
                        handleCancel(booking._id, booking.userId._id)
                      }
                    >
                      Cancel
                    </button>
                  </td> */}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="text-center py-8 bg-gray-50 text-gray-500">
                  No appointments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center space-x-2 mt-4">
        <button
          className={`px-6 py-2 rounded-lg ${
            currentPage === 1
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#00897B] text-white"
          }`}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Prev
        </button>
        <span className="px-6 py-2 text-black font-bold">{`Page ${currentPage} of ${totalPages}`}</span>
        <button
          className={`px-4 py-2 rounded-lg ${
            currentPage === totalPages
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#00897B] text-white"
          }`}
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Bookings;
