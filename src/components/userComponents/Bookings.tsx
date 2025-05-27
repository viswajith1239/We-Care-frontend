import { useState, useEffect } from "react";
import userAxiosInstance from "../../axios/userAxiosInstance";
import API_URL from "../../axios/API_URL";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import toast from "react-hot-toast";

interface BookingDetail {
    startDate: string;
    doctorId: { _id: string };
    name: string;
    _id: string;
    startTime: string;
    endTime: string;
    paymentStatus: string;
    appoinmentStatus?: string;
    userId: string;
    bookingDate: string;
    doctorName: string;
  }
  function Bookings() {
    const [bookingDetails, setBookingDetails] = useState<BookingDetail[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState(1);
    const { userInfo } = useSelector((state: RootState) => state.user);
    const ITEMS_PER_PAGE = 5;
    
    const fetchBookingDetails = async () => {
      try {
        setLoading(true);
        
        if (userInfo && userInfo.id) {
          const response = await userAxiosInstance.get(`${API_URL}/user/bookings-details/${userInfo.id}`);
          console.log("ppp",response);
          
          setBookingDetails(response.data || []);
        } else {
          console.log("User ID not available");
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
    }, [userInfo]);  
  
    if (loading) {
      return <div className="flex justify-center items-center h-64">
        <p>Loading bookings...</p>
      </div>;
    }

    const handleCancel = async (appoinmentId: string, userId: string, doctorId: string) => {
      const result = await Swal.fire({
        title: "Do you want to cancel this appoinment?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, cancel it!",
      });
  
      if (result.isConfirmed) {
        try {
        const response=  await userAxiosInstance.post(`${API_URL}/user/cancel-appoinment`, {
            appoinmentId,
            userId,
            doctorId,
          });
          console.log("Cancel Appointment Response:", response); 
          toast.success("Appointment cancelled successfully!");
  
          fetchBookingDetails();
        } catch (error) {
        }
      }
    };

    const handleViewDetails = (booking: BookingDetail) => {
      Swal.fire({
        title: "Booking Details",
        html: `
          <strong>Doctor:</strong> ${booking.doctorName} <br>
          <strong>Date:</strong> ${new Date(booking.bookingDate).toLocaleDateString()} <br>
          <strong>Time:</strong> ${booking.startTime} - ${booking.endTime} <br>
          <strong>Payment Status:</strong> ${booking.paymentStatus} <br>
          <strong>Appointment Status:</strong> ${booking.appoinmentStatus || 'Not Started'}
        `,
        icon: "info",
        confirmButtonText: "Close"
      });
    };

    const totalPages = Math.ceil(bookingDetails.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedBookings = bookingDetails.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  
    return (
      <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Your Bookings</h2>
     
        <div className="overflow-hidden rounded-lg border border-gray-200">
          <table className="w-full border-collapse rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-3 px-4 bg-[#00897B] text-white text-center">Doctor</th>
                <th className="py-3 px-4 bg-[#00897B] text-white text-center">Date</th>
                <th className="py-3 px-4 bg-[#00897B] text-white text-center">Time</th>
                <th className="py-3 px-4 bg-[#00897B] text-white text-center">Payment Status</th>
                <th className="py-3 px-4 bg-[#00897B] text-white text-center">Appoinment Status</th>
                <th className="py-3 px-4 bg-[#00897B] text-white text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
  {paginatedBookings.length > 0 ? (
    paginatedBookings.map((booking) => (
      <tr key={booking._id} className="hover:bg-gray-50">
        <td className="py-3 px-4 border-b">{booking.doctorName}</td>
        <td className="py-3 px-4 border-b">{new Date(booking.startDate).toLocaleDateString()}</td>
        <td className="py-3 px-4 border-b">{booking.startTime} - {booking.endTime}</td>
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
        <td className="py-3 px-4 border-b">{booking.appoinmentStatus || 'Not Started'}</td>
        <td className="py-3 px-4 border-b">
          <button 
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
            onClick={() => handleCancel(booking._id, booking.userId, booking.doctorId._id)}
          >
            Cancel
          </button>
          <button 
            className="ml-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
            onClick={() => handleViewDetails(booking)}
          >
            View Details
          </button>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan={6} className="text-center py-8 bg-gray-50 text-gray-500">
        No bookings found. Schedule an appointment with a doctor.
      </td>
    </tr>
  )}
</tbody>
          </table>
        </div>
        <div className="flex justify-between mt-4">
          <button 
            className="px-4 py-2 bg-gray-300 rounded mr-2 disabled:opacity-50"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="px-4 py-2 text-black font-bold">Page {currentPage} of {totalPages}</span>
          <button 
            className="px-4 py-2 bg-gray-300 rounded ml-2 disabled:opacity-50"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      
    </div>
    );
  }
export default Bookings
