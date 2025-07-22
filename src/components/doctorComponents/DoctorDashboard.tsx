import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
import { FaUserDoctor } from "react-icons/fa6";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import { FaRegCalendarAlt } from "react-icons/fa";
import { IWallet } from "../../types/doctor";
import { formatPriceToINR } from "../../utils/timeAndPrice";
import RevenueChart from "./RevenueChart";
import { getBookingDetails, getDoctorDashboardData, getWalletBalance } from "../../service/doctorService";

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
  const [walletBalance, setWalletBalance] = useState<IWallet | null>(null);
  const [dashboardData, setDashboardData] = useState({ doctorRevenue: 0, userDoctorChartData: [], doctorWiseData: {}, });

  const appoinmentsPerPage = 3;
  // const navigate = useNavigate();
  const { doctorInfo } = useSelector((state: RootState) => state.doctor);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (!doctorInfo?.id) return;
      try {
        const response = await getBookingDetails(doctorInfo.id)
        console.log(",,,,,", response);

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


  useEffect(() => {
    const fetchWalletBalance = async () => {
      const response = await getWalletBalance(doctorInfo.id)
      console.log("oooo", response);

      setWalletBalance(response.data.walletData);
    };
    fetchWalletBalance();
  }, []);

  useEffect(() => {

    const fetchDashboardDatas = async () => {

      try {

        const response = await getDoctorDashboardData(doctorInfo.id)

        setDashboardData({
          doctorRevenue: response.data.data.doctorRevenue,
          userDoctorChartData: response.data.data.userDoctorChartData,
          doctorWiseData: response.data.data.doctorWiseData,


        });

      } catch (error: any) {



      }
    };

    fetchDashboardDatas();
  }, []);

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
        <div className="bg-white rounded-lg shadow-md p-6 text-center flex flex-col items-center">
          <div className="flex items-center space-x-2 mb-2">
            <FaUserDoctor size={30} className="text-gray-700" />
            <h3 className="text-lg font-semibold text-gray-800">Active Patients</h3>
          </div>
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
                <th className="py-2 px-4  bg-[#00897B] text-white"> Patient ID</th>
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
                    <td className="py-2 px-4 text-center">{appoinment.userId._id}</td>
                    <td className="py-2 px-4 text-center">{appoinment.userId.name}</td>
                    <td className="py-2 px-4 text-center">
                      {new Date(appoinment.startDate).toLocaleDateString("en-US")}
                    </td>
                    <td className="py-2 px-4 text-center">{appoinment.startTime}</td>
                    <td
                      className={`py-2 px-4 font-semibold text-center ${appoinment.paymentStatus === "Confirmed" ? "text-green-600" : "text-red-500"
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
      </div>

      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <button
            className={`px-6 py-2 rounded-lg ${currentPage === 1
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#00897B] text-white"
              }`}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          <span className="text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className={`px-4 py-2 rounded-lg ${currentPage === totalPages
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#00897B] text-white"
              }`}
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3">
        <div className="col-span-2 md:col-span-3 flex justify-center">
          <div className=" w-[300px] md:w-[300px] bg-white shadow-lg rounded-lg p-6 flex flex-col items-center">
            <h3 className="text-xl font-semibold text-black mb-2">Wallet Balance</h3>
            <p className="text-3xl font-bold text-black">
              {formatPriceToINR(walletBalance?.balance ?? 0)}
            </p>
          </div>
        </div>
      </div>


      <div className="flex justify-center mb-5">
        <div className="w-[90%] md:w-[70%] lg:w-[50%] bg-white p-10 shadow-lg rounded-lg flex justify-center">
          <RevenueChart
            data={dashboardData.userDoctorChartData}
            doctorid={doctorInfo.id}
          />
        </div>
      </div>

    </div>
  );
}

export default DoctorDashboard;
