import { useState, useEffect, useCallback } from "react";
import doctorAxiosInstance from "../../axios/doctorAxiosInstance";
import API_URL from "../../axios/API_URL";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import toast from "react-hot-toast";
import { getDoctorBookings } from "../../service/doctorService";

interface BookingDetail {
  startDate: string | number | Date;
  userId: { _id: string; name: string; email: string; phone: string };
  _id: string;
  startTime: string;
  endTime: string;
  paymentStatus: string;
  appoinmentStatus?: string;
  bookingDate: string;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalBookings: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  limit: number;
}

function Bookings() {
  const [bookingDetails, setBookingDetails] = useState<BookingDetail[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [paginationInfo, setPaginationInfo] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalBookings: 0,
    hasNextPage: false,
    hasPreviousPage: false,
    limit: 5
  });
  const { doctorInfo } = useSelector((state: RootState) => state.doctor);
  const ITEMS_PER_PAGE = 5;

 
  const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
  };

  const fetchBookingDetails = async (page: number = 1, search: string = '') => {
    try {
      setLoading(true);
      if (doctorInfo && doctorInfo.id) {
        console.log("ss", search);

        const response = await getDoctorBookings(doctorInfo.id, page, ITEMS_PER_PAGE, search);

        console.log('Booking data:', response.data);

        if (response.data.bookings) {
          setBookingDetails(response.data.bookings);
          setPaginationInfo(response.data.pagination);
        } else {
          setBookingDetails(response.data || []);
        }
      } else {
        console.log('Doctor ID not available');
      }
    } catch (error) {
      console.log("Error in fetching booking details", error);
      setBookingDetails([]);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = useCallback(
    debounce((searchTerm: string) => {
      setCurrentPage(1);
      fetchBookingDetails(1, searchTerm);
    }, 500),
    [doctorInfo]
  );

  useEffect(() => {
    fetchBookingDetails(currentPage, searchQuery);
  }, [doctorInfo, currentPage]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    debouncedSearch(value);
  };
  

  const clearSearch = () => {
    setSearchQuery('');
    setCurrentPage(1);
    fetchBookingDetails(1, '');
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-sm sm:text-base">Loading bookings...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8 max-w-7xl">
      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 text-center sm:text-center">Your Appointments</h2>


      <div className="mb-4 sm:mb-6 flex justify-center">
        <div className="relative w-full max-w-xs sm:max-w-md lg:max-w-lg">
          <input
            type="text"
            placeholder="Search by patient name or email..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00897B] focus:border-transparent outline-none"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm sm:text-base"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      
      <div className="hidden lg:block overflow-hidden rounded-lg border border-gray-200 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-3 px-4 bg-[#00897B] text-white text-center text-sm font-medium">
                  Patient Name
                </th>
                <th className="py-3 px-4 bg-[#00897B] text-white text-center text-sm font-medium">
                  Email
                </th>
                <th className="py-3 px-4 bg-[#00897B] text-white text-center text-sm font-medium">
                  Date
                </th>
                <th className="py-3 px-4 bg-[#00897B] text-white text-center text-sm font-medium">
                  Time
                </th>
                <th className="py-3 px-4 bg-[#00897B] text-white text-center text-sm font-medium">
                  Payment Status
                </th>
                <th className="py-3 px-4 bg-[#00897B] text-white text-center text-sm font-medium">
                  Appointment Status
                </th>
              </tr>
            </thead>
            <tbody>
              {bookingDetails.length > 0 ? (
                bookingDetails.map((booking) => (
                  <tr key={booking._id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 border-b text-center text-sm">
                      {booking.userId.name}
                    </td>
                    <td className="py-3 px-4 border-b text-center text-sm">
                      {booking.userId.email}
                    </td>
                    <td className="py-3 px-4 border-b text-center text-sm">
                      {new Date(booking.startDate).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 border-b text-center text-sm">
                      {booking.startTime} - {booking.endTime}
                    </td>
                    <td className="py-3 px-4 border-b text-center">
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(booking.paymentStatus)}`}>
                        {booking.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 border-b text-center">
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(booking.appoinmentStatus || 'pending')}`}>
                        {booking.appoinmentStatus || "Not Started"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-8 bg-gray-50 text-gray-500 text-sm">
                    {searchQuery
                      ? `No appointments found matching "${searchQuery}". Try a different search term.`
                      : "No appointments found."
                    }
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      
      <div className="hidden md:block lg:hidden overflow-hidden rounded-lg border border-gray-200 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[640px]">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-3 bg-[#00897B] text-white text-center text-sm font-medium">
                  Patient
                </th>
                <th className="py-2 px-3 bg-[#00897B] text-white text-center text-sm font-medium">
                  Date & Time
                </th>
                <th className="py-2 px-3 bg-[#00897B] text-white text-center text-sm font-medium">
                  Payment
                </th>
                <th className="py-2 px-3 bg-[#00897B] text-white text-center text-sm font-medium">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {bookingDetails.length > 0 ? (
                bookingDetails.map((booking) => (
                  <tr key={booking._id} className="hover:bg-gray-50">
                    <td className="py-2 px-3 border-b text-center text-sm">
                      <div className="font-medium">{booking.userId.name}</div>
                      <div className="text-xs text-gray-500 truncate">{booking.userId.email}</div>
                    </td>
                    <td className="py-2 px-3 border-b text-center text-sm">
                      <div>{new Date(booking.startDate).toLocaleDateString()}</div>
                      <div className="text-xs text-gray-600">{booking.startTime} - {booking.endTime}</div>
                    </td>
                    <td className="py-2 px-3 border-b text-center">
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(booking.paymentStatus)}`}>
                        {booking.paymentStatus}
                      </span>
                    </td>
                    <td className="py-2 px-3 border-b text-center">
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(booking.appoinmentStatus || 'pending')}`}>
                        {booking.appoinmentStatus || "Not Started"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center py-8 bg-gray-50 text-gray-500 text-sm">
                    {searchQuery
                      ? `No appointments found matching "${searchQuery}". Try a different search term.`
                      : "No appointments found."
                    }
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>


      <div className="block md:hidden space-y-3">
        {bookingDetails.length > 0 ? (
          bookingDetails.map((booking) => (
            <div key={booking._id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-sm text-gray-800">{booking.userId.name}</h3>
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(booking.appoinmentStatus || 'pending')}`}>
                  {booking.appoinmentStatus || "Not Started"}
                </span>
              </div>
              
              <div className="space-y-2 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span className="font-medium">Email:</span>
                  <span className="text-right break-all">{booking.userId.email}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="font-medium">Date:</span>
                  <span>{new Date(booking.startDate).toLocaleDateString()}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="font-medium">Time:</span>
                  <span>{booking.startTime} - {booking.endTime}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="font-medium">Payment:</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(booking.paymentStatus)}`}>
                    {booking.paymentStatus}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 bg-gray-50 text-gray-500 text-sm rounded-lg">
            {searchQuery
              ? `No appointments found matching "${searchQuery}". Try a different search term.`
              : "No appointments found."
            }
          </div>
        )}
      </div>

      <div className="flex justify-center items-center mt-6 sm:mt-8">
        <div className="flex items-center space-x-1 sm:space-x-2">
          <button
            className="px-2 sm:px-4 py-2 bg-gray-300 rounded text-xs sm:text-sm disabled:opacity-50 hover:bg-gray-400 transition-colors"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={!paginationInfo.hasPreviousPage}
          >
            Previous
          </button>
          <span className="px-2 sm:px-4 py-2 text-black font-bold text-center text-xs sm:text-sm">
            Page {paginationInfo.currentPage} of {paginationInfo.totalPages}
          </span>
          <button
            className="px-2 sm:px-4 py-2 bg-gray-300 rounded text-xs sm:text-sm disabled:opacity-50 hover:bg-gray-400 transition-colors"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!paginationInfo.hasNextPage}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default Bookings;