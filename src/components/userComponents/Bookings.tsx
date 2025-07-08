import { useState, useEffect } from 'react';
import userAxiosInstance from '../../axios/userAxiosInstance';
import API_URL from '../../axios/API_URL';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import ReusableTable from '../../components/userComponents/ResuableTable'; // Adjust the import path as needed

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
  amount?: number;
}

function Bookings() {
  const [bookingDetails, setBookingDetails] = useState<BookingDetail[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
  const [selectedBooking, setSelectedBooking] = useState<BookingDetail | null>(null);
  const { userInfo } = useSelector((state: RootState) => state.user);
  const ITEMS_PER_PAGE = 5;
  const navigate = useNavigate();

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      if (userInfo && userInfo.id) {
        const response = await userAxiosInstance.get(`${API_URL}/user/bookings-details/${userInfo.id}`);
        console.log('Booking data:', response.data);
        setBookingDetails(response.data || []);
      } else {
        console.log('User ID not available');
      }
    } catch (error) {
      console.log('Error in fetching booking details', error);
      setBookingDetails([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookingDetails();
  }, [userInfo]);

  const handleCancel = async (appoinmentId: string, userId: string, doctorId: string) => {
    const result = await Swal.fire({
      title: 'Do you want to cancel this appointment?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, cancel it!',
    });

    if (result.isConfirmed) {
      try {
        const response = await userAxiosInstance.post(`${API_URL}/user/cancel-appoinment`, {
          appoinmentId,
          userId,
          doctorId,
        });
        const refundAmount = response.data.amount || 0;
        if (refundAmount > 0) {
          toast.success(`Appointment cancelled successfully! Refund amount: ₹${refundAmount}`);
        } else {
          toast.success('Appointment cancelled successfully! No refund applicable.');
        }
        fetchBookingDetails();
      } catch (error) {
        console.error('Error cancelling appointment:', error);
        toast.error('Failed to cancel appointment');
      }
    }
  };

  const handleViewDetails = (booking: BookingDetail) => {
    setSelectedBooking(booking);
    setShowDetailsModal(true);
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedBooking(null);
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const totalPages = Math.ceil(bookingDetails.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedBookings = bookingDetails.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const headers = ['Doctor', 'Date', 'Time', 'Payment Status', 'Appointment Status', 'Refund', 'Actions'];

  const renderRow = (booking: BookingDetail, index: number) => (
    <tr key={booking._id} className="hover:bg-gray-50">
      <td className="py-3 px-4 border-b text-center">{booking.doctorName}</td>
      <td className="py-3 px-4 border-b text-center">{new Date(booking.startDate).toLocaleDateString()}</td>
      <td className="py-3 px-4 border-b text-center">{`${booking.startTime} - ${booking.endTime}`}</td>
      <td className="py-3 px-4 border-b text-center">
        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(booking.paymentStatus)}`}>
          {booking.paymentStatus}
        </span>
      </td>
      <td className="py-3 px-4 border-b text-center">
        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(booking.appoinmentStatus || 'pending')}`}>
          {booking.appoinmentStatus || 'Not Started'}
        </span>
      </td>
      <td className="py-3 px-4 border-b text-center">
        {booking.paymentStatus === 'Cancelled' && booking.amount !== undefined ? (
          <span className="text-green-600 font-medium">₹{booking.amount}</span>
        ) : (
          <span className="text-gray-400">-</span>
        )}
      </td>
      <td className="py-3 px-4 border-b text-center">
        <div className="flex gap-1 justify-center items-center flex-wrap">
          <button
            className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs"
            onClick={() => handleCancel(booking._id, booking.userId, booking.doctorId._id)}
          >
            Cancel
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs"
            onClick={() => handleViewDetails(booking)}
          >
            Details
          </button>
          <button
            className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs"
            onClick={() => navigate('/profile/message')}
          >
            Chat
          </button>
        </div>
      </td>
    </tr>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading bookings...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Your Bookings</h2>
      <ReusableTable
        headers={headers}
        data={paginatedBookings}
        renderRow={renderRow}
        headerClassName="bg-[#00897B] text-white"
        emptyMessage="No bookings found. Schedule an appointment with a doctor."
      />
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
      {showDetailsModal && selectedBooking && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-md shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800 mx-auto">Booking Details</h3>
              <button
                onClick={closeDetailsModal}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            <div className="space-y-4">
              <div className="border-b pb-2">
                <label className="block text-sm font-medium text-gray-600">Doctor</label>
                <p className="text-lg text-gray-900">{selectedBooking.doctorName}</p>
              </div>
              <div className="border-b pb-2">
                <label className="block text-sm font-medium text-gray-600">Date</label>
                <p className="text-lg text-gray-900">
                  {new Date(selectedBooking.bookingDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <div className="border-b pb-2">
                <label className="block text-sm font-medium text-gray-600">Time</label>
                <p className="text-lg text-gray-900">{`${selectedBooking.startTime} - ${selectedBooking.endTime}`}</p>
              </div>
              <div className="border-b pb-2">
                <label className="block text-sm font-medium text-gray-600">Payment Status</label>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedBooking.paymentStatus)}`}>
                  {selectedBooking.paymentStatus}
                </span>
              </div>
              <div className="border-b pb-2">
                <label className="block text-sm font-medium text-gray-600">Appointment Status</label>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    selectedBooking.appoinmentStatus || 'pending'
                  )}`}
                >
                  {selectedBooking.appoinmentStatus || 'Not Started'}
                </span>
              </div>
            </div>
            <div className="flex justify-end mt-6 space-x-3">
              <button
                onClick={closeDetailsModal}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Bookings;