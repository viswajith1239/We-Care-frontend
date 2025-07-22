import { useState, useEffect, useRef } from "react";
import dayjs from "dayjs";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"
import { FaCalendarAlt, FaStar } from "react-icons/fa";

import { RootState } from "../../app/store";
import { loadStripe } from "@stripe/stripe-js";
import toast, { Toaster } from "react-hot-toast";
import Review from "./Review";

import API_URL from "../../axios/API_URL";
import userAxiosInstance from "../../axios/userAxiosInstance";
import { useNavigate } from "react-router-dom";
import { AvgRatingAndReviews } from "../../types/user";
import { getschedules } from "../../service/userService";

interface ISessionSchedule {
  _id: any;
  price: any;
  selectedDate?: string;
  startDate: string;
  startTime: string;
  endTime: string;
  type: string;
  doctorId: string;
  isBooked: boolean;
}

interface DoctorProfile {
  _id: string;
  name: string;
  profileImage: string;
  specializations: { name: string }[];
  yearsOfExperience: string;
  email: string,
  gender: string
}

interface TimeSlot {
  id: string;
  time: string;
  price: number;
}

function DoctorsProfileView() {
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([]);
  const [sessionSchedules, setSessionSchedules] = useState<ISessionSchedule[]>([]);
  const [doctor, setDoctor] = useState<DoctorProfile | null>(null);
  const [showDateSection, setShowDateSection] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [bookingStatus, setBookingStatus] = useState<string | null>(null);
  const [avgRatingAndTotalReviews, setAvgRatingAndTotalReviews] = useState<AvgRatingAndReviews[]>([]);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [hasUserReviewed, setHasUserReviewed] = useState<boolean>(false);
  const [reviewComment, setReviewComment] = useState<string | null>(null);
  const [reviewId, setreviewId] = useState<string | null>(null);
  const [reload, setReload] = useState(false);
  const [refreshSchedules, setRefreshSchedules] = useState(false); // Add this to trigger refresh

  const datePickerRef = useRef(null);
  const { doctorId } = useParams<{ doctorId: string }>();
  const { userInfo } = useSelector((state: RootState) => state.user);
  const userId = userInfo?.id;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await userAxiosInstance.get(`${API_URL}/user/doctors/${doctorId}`);
        console.log("Doctor data:", response.data);

        if (response.data && response.data.length > 0) {
          setDoctor(response.data[0]);
        }
      } catch (error) {
        console.error("Error fetching doctor:", error);
      }
    };

    fetchDoctor();
  }, [doctorId]);


  useEffect(() => {
    const fetchSessionSchedules = async () => {
      try {
        const response = await getschedules();
        const schedules = response.data;

        console.log("Fetched Schedules:", schedules);
        setSessionSchedules(schedules);


        const datesWithAvailableSlots = schedules
          .filter((schedule: ISessionSchedule) =>
            !schedule.isBooked && schedule.doctorId === doctorId
          )
          .map((schedule: ISessionSchedule) =>
            dayjs(schedule.selectedDate || schedule.startDate).format("YYYY-MM-DD")
          );


        const uniqueDates = Array.from(new Set(datesWithAvailableSlots));


        const validDates = uniqueDates.filter(date => {
          const slotsForDate = schedules.filter((schedule: ISessionSchedule) =>
            dayjs(schedule.selectedDate || schedule.startDate).format("YYYY-MM-DD") === date &&
            schedule.doctorId === doctorId &&
            !schedule.isBooked
          );
          return slotsForDate.length > 0;
        });

        console.log("Available Dates:", validDates);
        setAvailableDates(validDates);


        if (selectedDate) {
          const selectedDateStr = dayjs(selectedDate).format("YYYY-MM-DD");
          if (!validDates.includes(selectedDateStr)) {
            setSelectedDate(null);
            setAvailableTimeSlots([]);
          }
        }
      } catch (error) {
        console.error("Error fetching schedules:", error);
      }
    };

    fetchSessionSchedules();
  }, [doctorId, refreshSchedules]);

  const handleDateChange = (date: any | null) => {
    setSelectedDate(date);

    if (date) {
      const formattedDate = dayjs(date).format("YYYY-MM-DD");


      const slotsForDate: TimeSlot[] = sessionSchedules
        .filter(schedule =>
          dayjs(schedule.selectedDate || schedule.startDate).format("YYYY-MM-DD") === formattedDate &&
          schedule.doctorId === doctorId &&
          !schedule.isBooked
        )
        .map(schedule => ({
          id: schedule._id,
          time: `${schedule.startTime} - ${schedule.endTime}`,
          price: schedule.price
        }));

      setAvailableTimeSlots(slotsForDate);
    } else {
      setAvailableTimeSlots([]);
    }
  };

  const openCalendar = () => {
    (datePickerRef.current as any)?.setOpen(true);
  };

  const handlepayment = async (appointment: TimeSlot) => {
    try {
      const response = await userAxiosInstance.post(
        `${API_URL}/user/payment/${appointment.id}`,
        { userData: userInfo }
      );
      console.log("Payment response:", response);

      const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
      if (stripe) {
        await stripe.redirectToCheckout({ sessionId: response.data.id });


        setRefreshSchedules(prev => !prev);
      } else {
        navigate("/login");
      }
    } catch (error) {
      console.log("Error in payment:", error);
      toast.error("Payment failed. Please try again.");
    }
  };

  useEffect(() => {
    const findBooking = async () => {
      try {
        const response = await userAxiosInstance.get(
          `${API_URL}/user/bookings/${userId}/${doctorId}`
        );
        console.log("Booking status:", response);
        setBookingStatus(response.data);
      } catch (error) {
        console.error("Error fetching booking status:", error);
      }
    };

    if (userId && doctorId) {
      findBooking();
    }
  }, [userId, doctorId]);


  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {

        setRefreshSchedules(prev => !prev);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const handleAddReview = () => {
    setIsReviewModalOpen(true);
  };

  const handleEditReview = () => {
    setIsReviewModalOpen(true);
  };

  const handleStarClick = (rating: any) => {
    setSelectedRating(rating);
  };

  const handleReviewSubmit = async () => {
    const data = {
      reviewComment,
      selectedRating,
      userId,
      doctorId,
    };

    try {
      const response = await userAxiosInstance.post(`${API_URL}/user/review`, data);
      console.log("Review submitted:", response.data.reviewId);

      setreviewId(response.data.reviewId);
      setIsReviewModalOpen(false);
      setReviewComment(null);
      setSelectedRating(0);
      setHasUserReviewed(true);
      setReload((prev) => !prev);

      if (response.data.message) {
        toast.success(response.data.message);
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review. Please try again.");
    }
  };

  const handleReviewEdit = async () => {
    const data = {
      reviewComment,
      selectedRating,
      reviewId,
    };

    try {
      const response = await userAxiosInstance.patch(
        `${API_URL}/user/edit-review`,
        data
      );
      console.log("Review updated:", response);

      setIsReviewModalOpen(false);
      setReviewComment(null);
      setSelectedRating(0);
      setReload((prev) => !prev);

      if (response.data.message) {
        toast.success(response.data.message);
      }
    } catch (error) {
      console.error("Error updating review:", error);
      toast.error("Failed to update review. Please try again.");
    }
  };

  useEffect(() => {
    const getAvgRatingAndTotalReviews = async () => {
      try {
        const response = await userAxiosInstance.get(
          `${API_URL}/user/reviews-summary/${doctorId}`
        );
        setAvgRatingAndTotalReviews(response.data);
      } catch (error) {
        console.error("Error fetching reviews summary:", error);
      }
    };

    if (doctorId) {
      getAvgRatingAndTotalReviews();
    }
  }, [doctorId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-4 lg:p-10">
      <Toaster />


      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">


        <div className="max-w-3xl mx-auto px-4 py-6 space-y-6 -mt-6">

          <div className="bg-white shadow-xl rounded-lg text-gray-900 overflow-hidden">

            <div className="h-32 bg-[#00897B] bg-opacity-60 rounded-t-lg"></div>


            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white mx-auto -mt-16">
              <img
                className="object-cover object-top h-full w-full"
                src={doctor?.profileImage}
                alt="Doctor"
              />
            </div>


            {avgRatingAndTotalReviews.length > 0 && (
              <div className="text-center mt-4">
                <p className="text-yellow-500 font-semibold text-lg flex items-center justify-center gap-1">
                  <FaStar className="text-yellow-500" />
                  {avgRatingAndTotalReviews[0]?.averageRating?.toFixed(1) || 0}
                </p>
                <p className="text-sm text-gray-600">
                  ({avgRatingAndTotalReviews[0]?.totalReviews || 0} reviews)
                </p>
              </div>
            )}


            <div className="text-center p-4 space-y-2">
              <h2 className="text-xl font-bold">Dr. {doctor?.name}</h2>
              <p><strong>Specialization:</strong> {doctor?.specializations[0]?.name || "N/A"}</p>
              <p><strong>Experience:</strong> {doctor?.yearsOfExperience || "N/A"} years</p>
              <p><strong>Email:</strong> {doctor?.email || "N/A"}</p>
              <p><strong>Gender:</strong> {doctor?.gender || "N/A"}</p>
            </div>


            <div className="px-4 pb-4 text-gray-700 text-center space-y-2">
              <p>
                <strong>Dr. {doctor?.name}</strong> has {doctor?.yearsOfExperience} years of experience and is a highly skilled and compassionate medical professional specializing in{" "}
                <strong>{doctor?.specializations[0]?.name || "general medicine"}</strong>.
              </p>
              <p>
                They are dedicated to providing exceptional patient care and personalized treatment plans.
              </p>
            </div>


            <div className="p-4 border-t text-center">
              <button
                onClick={() => setShowDateSection(true)}
                className="px-6 py-2 bg-[#00897B] text-white font-semibold rounded-lg shadow hover:bg-[#00796B] transition transform hover:scale-105"
              >
                Book Appointment
              </button>
            </div>
          </div>


          {showDateSection && (
            <div className="w-full bg-white shadow-md rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Choose Available Date</h3>


              <div className="relative w-48 mx-auto mb-6">
                <DatePicker
                  ref={datePickerRef}
                  selected={selectedDate}
                  onChange={handleDateChange}
                  includeDates={availableDates.map(date => new Date(date))}
                  minDate={new Date()}
                  dateFormat="MM/dd/yyyy"
                  placeholderText="Select a date"
                  popperPlacement="bottom-start"
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md text-gray-700 shadow-sm cursor-pointer"
                />
                <FaCalendarAlt
                  onClick={openCalendar}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                />
              </div>


              {selectedDate && availableTimeSlots.length > 0 ? (
                <>
                  <h4 className="text-md font-semibold text-gray-800 mb-3 text-center">Available Slots</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {availableTimeSlots.map((slot, index) => (
                      <button
                        key={index}
                        onClick={() => handlepayment(slot)}
                        className="px-4 py-2 bg-[#00897B] text-white font-semibold rounded-lg shadow hover:bg-[#00796B] transition transform hover:scale-105 text-sm"
                      >
                        {slot.time} - ₹{slot.price}
                      </button>
                    ))}
                  </div>
                </>
              ) : selectedDate && availableTimeSlots.length === 0 ? (
                <p className="text-center text-gray-600 mt-2">No slots available for this date.</p>
              ) : null}


              {availableDates.length === 0 && (
                <p className="text-center text-gray-600 mt-4">No available dates at the moment.</p>
              )}
            </div>
          )}
        </div>



        <div className="space-y-6 ">

          <div className="bg-white shadow-md rounded-lg p-6 px-4 py-11">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-gray-800">
                {bookingStatus === "Confirmed" ? "Patient Reviews" : "Reviews"}
              </h2>

              {bookingStatus === "Confirmed" && (
                <div>
                  {hasUserReviewed ? (
                    <button
                      onClick={handleEditReview}
                      className="bg-[#00897B] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#00796B] transition"
                    >
                      Edit Review
                    </button>
                  ) : (
                    <button
                      onClick={handleAddReview}
                      className="bg-[#00897B] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#00796B] transition"
                    >
                      Add Review
                    </button>
                  )}
                </div>
              )}
            </div>


            <Review
              doctorId={doctorId}
              reload={reload}
              currentUser={userInfo?.id}
              onReviewCheck={(hasReview) => setHasUserReviewed(hasReview)}
            />
          </div>
        </div>
      </div>


      {isReviewModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white rounded-lg p-6 md:p-8 w-full max-w-2xl shadow-lg max-h-[90vh] overflow-y-auto relative">
            <h1 className="font-bold text-2xl sm:text-xl">
              {hasUserReviewed ? "Edit Review" : "Write a Review"}
            </h1>
            <h2 className="font-medium mt-3 sm:text-base">Select Your Rating</h2>


            <div className="text-yellow-600 text-lg sm:text-base">
              <div className="flex items-center mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    onClick={() => handleStarClick(star)}
                    className={`w-7 h-7 ms-1 cursor-pointer sm:w-5 sm:h-5 ${star <= selectedRating ? "text-yellow-600" : "text-gray-300"
                      }`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 22 20"
                    aria-hidden="true"
                  >
                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                  </svg>
                ))}
              </div>


              <div className="mt-3">
                <textarea
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full border rounded-md p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                  placeholder="Write your review here..."
                  rows={6}
                  value={reviewComment || ""}
                />
              </div>
            </div>


            <div className="flex justify-end gap-4 sm:gap-2 mt-4">
              <button
                className="bg-red-500 px-3 py-2 rounded-md text-white sm:px-2 sm:py-1 sm:text-sm hover:bg-red-600 transition"
                onClick={() => setIsReviewModalOpen(false)}
              >
                Close
              </button>
              {!hasUserReviewed ? (
                <button
                  onClick={handleReviewSubmit}
                  className="bg-[#00897B] px-3 py-2 rounded-md text-white sm:px-2 sm:py-1 sm:text-sm hover:bg-[#00796B] transition"
                >
                  Submit
                </button>
              ) : (
                <button
                  onClick={handleReviewEdit}
                  className="bg-blue-500 px-3 py-2 rounded-md text-white sm:px-2 sm:py-1 sm:text-sm hover:bg-blue-600 transition"
                >
                  Update
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DoctorsProfileView;