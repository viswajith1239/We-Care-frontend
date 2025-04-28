import { useState, useEffect,useRef } from "react";
// import axios from "axios";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import {Typography,Button,Paper, TextField,} from "@mui/material";
import dayjs from "dayjs";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"
import { FaCalendarAlt } from "react-icons/fa"; 
// import Cookies from "js-cookie";

import { RootState } from "../../app/store";
import { loadStripe } from "@stripe/stripe-js";
import toast, { Toaster } from "react-hot-toast";
import Review from "./Review";



import API_URL from "../../axios/API_URL";
// // import {loadStripe} from '@stripe/stripe-js';
import userAxiosInstance from "../../axios/userAxiosInstance";
import { useNavigate } from "react-router-dom";
import { AvgRatingAndReviews } from "../../types/user";

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
}



function DoctorsProfileView() {
  // const [selectedDate, setSelectedDate] = useState<Dayjs | undefined>(undefined);

  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  // const [isSingleSession, setIsSingleSession] = useState(false);
  // const [isPackageSession, setIsPackageSession] = useState(false);
  const [sessionSchedules, setSessionSchedules] = useState<ISessionSchedule[]>([]);
  const [doctor, setDoctor] = useState<DoctorProfile | null>(null);
  // const [showSelectionBox, setShowSelectionBox] = useState(false);
  const [showDateSection, setShowDateSection] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null)
  const [bookingStatus, setBookingStatus] = useState<string | null>(null);
  const [avgRatingAndTotalReviews, setAvgRatingAndTotalReviews] = useState<AvgRatingAndReviews[]>([]);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [hasUserReviewed, setHasUserReviewed] = useState<boolean>(false);
  const [reviewComment, setReviewComment] = useState<string | null>(null);
  const [userReviewId, setUserReviewId] = useState<string | null>(null);
  const [reload, setReload] = useState(false);
  // const [showDateInput, setShowDateInput] = useState(false);
  const datePickerRef = useRef(null);
 

  const { doctorId } = useParams<{ doctorId: string }>();

  
  const { userInfo } = useSelector((state: RootState) => state.user);
  const userId=userInfo?.id
 
  const navigate=useNavigate()

  useEffect(() => {
    const fetchDoctor = async () => { 
      try {
        const response = await userAxiosInstance.get(`${API_URL}/user/doctors/${doctorId}`);
        console.log("hhhh",response.data);
        
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
        const response = await userAxiosInstance.get(`${API_URL}/user/schedules`);
        const schedules = response.data;
        
        console.log("Fetched Schedules:", schedules);
  
        
        const date: string[] = Array.from(
          new Set(
            schedules
              .filter(
                (schedule: { doctorId: string; isBooked: boolean }) =>
                  !schedule.isBooked && schedule.doctorId === doctorId
              )
              .map((schedule: { selectedDate: string }) =>
                dayjs(schedule.selectedDate).format("YYYY-MM-DD")
              )
          )
        );
  
        console.log("Available Dates:", date);
  
        setSessionSchedules(schedules);
        setAvailableSlots(date);
      } catch (error) {
        console.error("Error fetching schedules:", error);
      }
    };
  
    fetchSessionSchedules();
  }, [doctorId]);
  ;


  // const handleDateChange = (date: any | null) => {
  //   setSelectedDate(date);
  //   if (date) {
  //     const formattedDate = date.format("YYYY-MM-DD");
  //     const slots:any = sessionSchedules
  //       .filter((schedule) => {
  //         const scheduleDate = dayjs(schedule.selectedDate || schedule.startDate).format(
  //           "YYYY-MM-DD"
  //         );
  //         return (
  //           scheduleDate === formattedDate &&
  //           schedule.doctorId.toString() === doctorId?._id.toString() &&
  //           !schedule.isBooked &&
  //           ((isSingleSession && schedule.type === "single") ||
  //             (isPackageSession && schedule.type === "package"))
  //         );
  //       })
  //       .map((schedule) => ({
  //         time: `${schedule.startTime} - ${schedule.endTime}`,
  //         price: schedule.price,
  //         id:schedule._id
  //       }));
        
  //     setAvailableSlots(slots);
  //   } else {
  //     setAvailableSlots([]);
  //   }
  // };

  // const handleBookSession = (sessionType: string) => {
  //   setIsSingleSession(sessionType === "single");

  //   setIsPackageSession(sessionType === "package");
  //   setSelectedDate(dayjs());
  //   setAvailableSlots([]);
  // };

// //   const handleConfirmBooking = (slot: string, id: any) => {
// //     if (selectedDate) {
// //       alert(`Session booked for ${slot} on ${selectedDate.toDate().toLocaleDateString()}`);
// //     }
// //     setSelectedDate(dayjs());
// //     setAvailableSlots([]);
// //     setIsSingleSession(false);
// //     setIsPackageSession(false);
// //   };

//   const availableDates = Array.from(
//     new Set(
//       sessionSchedules
//         .filter(
//           (schedule) =>
//             !schedule.isBooked &&
//             ((isSingleSession && schedule.type === "single") ||
//               (isPackageSession && schedule.type === "package"))
//         )
//         // .map((schedule) =>
//         //   dayjs(schedule.selectedDate || schedule.startDate).format("YYYY-MM-DD")
//         // )
//     )
//   );

  const handlepayment=async (appoinmentId: any)=>{
    
    try {
      const response=await userAxiosInstance.post(`${API_URL}/user/payment/${appoinmentId.id}`,{ userData: userInfo })
      console.log("response for fetch is..........",response)
      const stripe=await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)
      if(stripe){
        await stripe.redirectToCheckout({sessionId:response.data.id})
      }else{
        navigate("/login")
      }
    } catch (error) {
      console.log("error in payment",error)
    }

  }

  const handleDateChange = (date: any | null) => {
    setSelectedDate(date);
    
    if (date) {
      const formattedDate = dayjs(date).format("YYYY-MM-DD");
  
      
      const slotsForDate:any = sessionSchedules
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
  
      setAvailableSlots(slotsForDate);
    } else {
      setAvailableSlots([]); 
    }
  
  
    (datePickerRef.current as any)?.setOpen(true);

  };
  
  

 

  const openCalendar = () => {
    (datePickerRef.current as any)?.setOpen(true);

  };


  useEffect(() => {
    const findBooking = async () => {
      const response = await userAxiosInstance.get(
        `${API_URL}/user/bookings/${userId}/${doctorId}`
      );
      console.log("nnnn",response);
      
    
      setBookingStatus(response.data);
    };

    findBooking();
  }, []);


  const handleAddReview = () => {
    setIsReviewModalOpen(true);
  }
  const handleEditReview = () => {
    setIsReviewModalOpen(true);
  };
  
  const handleStarClick = (rating: any) => {
    setSelectedRating(rating);
  }
  const handleReviewSubmit = async () => {
    const data = {
      reviewComment,
      selectedRating,
      userId,
      doctorId,
    };
  
    const response = await userAxiosInstance.post(`${API_URL}/user/review`, data);
  
    setUserReviewId(response.data.reviewId);
    setIsReviewModalOpen(false);
    setReviewComment(null);
    setSelectedRating(0);
    setHasUserReviewed(true);
    setReload((prev) => !prev);
    if (response.data.message) {
      toast.success(response.data.message);
    }
  };
  const handleReviewEdit = async () => {
    
    const data = {
      reviewComment,
      selectedRating,
      userReviewId,
    
    };
    const response = await userAxiosInstance.patch(
      `${API_URL}/user/edit-review`,
      data
    );
    console.log("uuuuuu",response)
    setIsReviewModalOpen(false);
    setReviewComment(null);
    setSelectedRating(0);
    setReload((prev) => !prev);
    if (response.data.message) {
      toast.success(response.data.message);
    }
  };

  console.log("pppp",hasUserReviewed);
  
  useEffect(() => {
    const getAvgRatingAndTotalReviews = async () => {
      const response = await userAxiosInstance.get(
        `${API_URL}/user/reviews-summary/${doctorId}`
      );
      setAvgRatingAndTotalReviews(response.data);
    };
    getAvgRatingAndTotalReviews();
  }, [doctorId]);
  return (
    
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-10 flex flex-col justify-center items-center">
      <Toaster />
      <div className="max-w-xl w-full bg-white shadow-xl rounded-lg text-gray-900 overflow-hidden">
       
        <div className="rounded-t-lg h-32 overflow-hidden relative bg-[#00897B] bg-opacity-50"></div>

      
        <div className="mx-auto w-32 h-32 relative -mt-16 border-4 border-white rounded-full overflow-hidden">
          <img
            className="object-cover object-top h-full w-full"
            src={doctor?.profileImage}
            alt="Doctor"
          />
        </div>

      
        <div className="text-center mt-2 p-4">
          <h2 className="text-xl font-semibold">Dr. {doctor?.name}</h2>
          <p className="text-gray-700">
            <strong>Specialization: </strong>
            {doctor?.specializations[0]?.name || "N/A"}
          </p>
        </div>

        
        <p className="text-gray-700 mt-4 px-4">
          <strong>Dr. {doctor?.name}</strong> is a highly skilled and compassionate medical 
          professional specializing in{" "}
          <strong>{doctor?.specializations[0]?.name || "general medicine"}</strong>.  
          They are dedicated to providing exceptional patient care and personalized treatment plans.
        </p>

        
        <div className="p-4 border-t mx-8 mt-2 text-center">
          <button
            onClick={() => setShowDateSection(true)}
            className="px-6 py-2 bg-[#00897B] text-white font-semibold rounded-lg shadow hover:bg-[#00796B] transition transform hover:scale-105"
          >
            Book Appointment
          </button>
        </div>
      </div>

      
      {showDateSection && (
        <div className="mt-4 w-full max-w-xl p-4 bg-white shadow-md rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Choose Available Date</h3>

          
          <div className="relative w-48 mx-auto">
            <DatePicker
              ref={datePickerRef}
              selected={selectedDate}
              onChange={handleDateChange}
              includeDates={availableSlots.map(date => new Date(date))}
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

         
          {selectedDate && availableSlots.length > 0 ? (
  <div className="mt-4 p-4 bg-white shadow-md rounded-lg w-full max-w-xl">
    <h3 className="text-lg font-semibold text-gray-800 mb-2">Available Slots</h3>
    <div className="grid grid-cols-2 gap-4">
      {availableSlots.map((slot,index) => (
        <button
          key={index}
          onClick={() => handlepayment(slot)}
          className="px-4 py-2 bg-[#00897B] text-white font-semibold rounded-lg shadow hover:bg-[#00796B] transition transform hover:scale-105"
        >
          {slot.time} - ₹{slot.price}
        </button>
      ))}
    </div>
  </div>
) : selectedDate && (
  <p className="text-gray-600 mt-2">No slots available for this date.</p>
)}
        </div>
      )}
       <div className="flex justify-center mt-8">
  <h1 className="text-2xl mt-5 font-md sm:text-xl sm:mt-3">
  {bookingStatus === "Confirmed" ? "Hear from Our Clients" : ""}
</h1>

      </div>

{bookingStatus === "Confirmed" ? (
        <div className="flex justify-end mr-10 sm:mr-4">
          {hasUserReviewed ? (
            
             <button
             onClick={handleEditReview}
             className="bg-[#00897B] text-white  sm:px-2 sm:py-1 sm:text-sm"
           >
             Edit Review
           </button>
          ) : (
            <button
            onClick={handleAddReview}
            className="bg-[#00897B] text-white  rounded-lg px-4 py-1 text-sm mt-5"
            >
            Add review
          </button>
          )}
        </div>
      ) : (
        ""
      )}
      <Review
        doctorId={doctorId}
        reload={reload}
        currentUser={userInfo?.id}
        onReviewCheck={(hasReview) => setHasUserReviewed(hasReview)}
      />
      
      {isReviewModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 md:p-8 w-full max-w-2xl shadow-lg h-[55vh] overflow-y-auto relative sm:p-4 sm:h-auto">
            <h1 className="font-bold text-2xl sm:text-xl">
              {hasUserReviewed ? "Edit Review" : "Write a Review"}
            </h1>
            <h1 className="font-medium mt-3 sm:text-base">Select Your Rating</h1>
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
                />
              </div>
            </div>
            <div className="flex justify-end gap-4 sm:gap-2 mt-4">
              <button
                className="bg-red-500 px-3 py-2 rounded-md text-white sm:px-2 sm:py-1 sm:text-sm"
                onClick={() => setIsReviewModalOpen(false)}
              >
                Close
              </button>
              {!hasUserReviewed ? (
                
                
               <button
                onClick={handleReviewSubmit}
                className="bg-[#00897B] px-3 py-2 rounded-md text-white sm:px-2 sm:py-1 sm:text-sm"
              >
                Submit
              </button>
              ): (
                 <button
                 onClick={handleReviewEdit}
                 className="bg-blue-500 px-3 py-2 rounded-md text-white sm:px-2 sm:py-1 sm:text-sm"
               >
                 Submit
               </button>
            )}
               
            </div>
          </div>
        </div>
      )}
    </div>
  
   
    

//    

  );
 
}

export default DoctorsProfileView;


