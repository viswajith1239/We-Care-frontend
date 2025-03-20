import React, { useState, ChangeEvent, FormEvent ,useEffect} from "react";
import axiosinstance from "../../axios/userAxiosInstance";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { ISpecialization } from "../../types/doctor";
import API_URL from "../../axios/API_URL";
import { IAppoinmentSchedule } from "../../types/doctor";
import toast, { Toaster } from "react-hot-toast";


// interface Session {
//   selectedDate?: string;
//   startTime?: string;
//   endTime?: string;
//   startDate?: string;
//   endDate?: string;
//   specialization: string;
//   status: string; // "Confirmed" or "Pending"
//   type?: string;
//   price?: number; // Added price field
// }

const ScheduleAppoinments: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [sessionType, setSessionType] = useState<string>("Single");
  // const [sessions, setSessions] = useState<Session[]>([]);
  const [formData, setFormData] = useState({
    selectedDate: "",
    startTime: "",
    endTime: "",
    // startDate: "",
    // endDate: "",
    specialization: "",
    price: 0, // Initialize price to 0
  });
  const [spec, setSpec] = useState<ISpecialization[]>([]);
 
  const [specializationId] = useState("");
    const [sessionSchedules, setSessionSchedules] = useState<IAppoinmentSchedule[]>([])

    const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(3);
  const [,setEditingSession] = useState<IAppoinmentSchedule | null>(null);


   


  const { doctorInfo} = useSelector((state: RootState) => state.doctor);
  const doctorId = doctorInfo.id;

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // const handleSpecializationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   setSpecializationId(e.target.value); 
  // }
  // const handleSessionTypeChange = (type: string) => {
  //   setSessionType(type);
  // };
///////////////////////////////////////////////////
const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  // Validation Logic
  if (sessionType === "Single") {
    if (!formData.selectedDate || !formData.startTime || !formData.endTime) {
      toast.error("Please fill in all required fields for Appoinment.");
      return;
    }
  } 
 

  const sessionData = {
    ...formData,
    // type: sessionType,
    status: "Pending",
    specializationId,
  };

  try {
    
    const response = await axiosinstance.post(
        
      `${API_URL}/doctor/appoinments/${doctorId}`,
      sessionData
    );

    if (response.status === 201) {
      setSessionSchedules((prevSchedules) =>
        Array.isArray(response.data.sessioncreated)
          ? [...prevSchedules, ...response.data.sessioncreated]
          : [...prevSchedules, response.data.sessioncreated]
      );
      toast.success("Session created successfully");
    }
  
    
      // Create Mode
      console.log("docor id",doctorId);
      
     
  } catch (error: any) {
    console.error("Error:", error);
    const errorMessage =
      error.response?.data.message || "An unexpected error occurred";
    toast.error(errorMessage);
  } finally {
    setShowModal(false);
    setFormData({
      selectedDate: "",
      startTime: "",
      endTime: "",
      // startDate: "",
      // endDate: "",
      specialization: "",
      price: 0,
    });
    setSessionType("Single");
    setEditingSession(null);
  }
};

//////////////////////////////////////////////////////////////////////
  const handleCancel = () => {
    setFormData({
      selectedDate: "",
      startTime: "",
      endTime: "",
      // startDate: "",
      // endDate: "",
      specialization: "",
      price: 0,
    });
    setSessionType("Single");
    setShowModal(false);
  };

  const handleOpenModal = async () => {
    try {
      setShowModal(true);
      const response = await axiosinstance.get(`${API_URL}/doctor/specializations/${doctorId}`);
      setSpec(response.data.data.specializations);
    } catch (error) {
      console.error("Error fetching specializations:", error);
    }
  };
  
  /////////////////////////////////////////
  // const handleEdit = (session: IAppoinmentSchedule) => {
  //   setEditingSession(session)
  //   console.log("Session Data:", session);
  //   console.log("Specializations Array:", spec);
  
  //   if (spec.length === 0) {
  //     console.error("Specializations are not loaded yet.");
  //     return;
  //   }
  
  //   const specialization = spec.find((s) => s._id === specializationId);
  //   console.log("Matched Specialization:", specialization);
  
    
  //   setFormData({
  //     specialization: specialization ? specialization._id : '',
  //     selectedDate: session.selectedDate 
  //       ? new Date(session.selectedDate).toISOString().split('T')[0]
  //       : '', 
  //     startTime: session.startTime || '',
  //     endTime: session.endTime || '',
  //   //  price: session.price || '',
  //   price:session.price,
      

  //   });
  
  //   setShowModal(true);
  // };
  

  useEffect(() => {
    
    const fetchSessionData = async () => {
       
      try {
        console.log("ya")
        const response = await axiosinstance.get(
          `${API_URL}/doctor/shedules/${doctorId}`
        );

        
        const schedules = response.data.sheduleData;
        // console.log("schedules", schedules);

        setSessionSchedules(schedules);
      } catch (error) {
        console.error("Failed to fetch schedules:", error);
        toast.error("Failed to fetch schedules");
      } finally {
     
      }
    };
    fetchSessionData();
  }, [doctorId]);
  
  const handlePageChange = (pageNumber: number) => {
    if (pageNumber < 1) {
      setCurrentPage(1);  
    } else if (pageNumber > Math.ceil(sessionSchedules.length / itemsPerPage)) {
      setCurrentPage(Math.ceil(sessionSchedules.length / itemsPerPage));  
    } else {
      setCurrentPage(pageNumber);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSessions = sessionSchedules.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="min-h-screen bg-white py-4 px-4">
      <Toaster/>
      <button
        onClick={handleOpenModal}
        className="mt-2 px-4 py-3 bg-[#00897B] text-white text-lg font-semibold rounded-lg shadow-xl transform hover:scale-105 transition-all duration-300"
      >
        Add New Appoinment
      </button>

      {showModal && (
  
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 md:p-8 rounded-xl w-full max-w-lg shadow-xl relative">
        
        <button
          onClick={handleCancel}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl"
        >
          &times;
        </button>

       
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">Add Appointment Details</h2>

     
        <form onSubmit={handleSubmit} className="space-y-4">
         
          <div>
            <label className="text-gray-700 font-medium">Specialization</label>
            <select
              name="specialization"
              value={formData.specialization}
              onChange={handleInputChange}
              className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:ring focus:ring-indigo-300"
            >
              <option value="">Select Specialization</option>
              {spec.map((special) => (
                <option key={special._id} value={special._id}>
                  {special.name}
                </option>
              ))}
            </select>
          </div>

       
          <div>
            <label className="text-gray-700 font-medium">Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:ring focus:ring-indigo-300"
            />
          </div>

         
          {sessionType === "Single" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-gray-700 font-medium">Date</label>
                <input
                  type="date"
                  name="selectedDate"
                  value={formData.selectedDate}
                  onChange={handleInputChange}
                  className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:ring focus:ring-indigo-300"
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
              <div>
                <label className="text-gray-700 font-medium">Start Time</label>
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleInputChange}
                  className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:ring focus:ring-indigo-300"
                />
              </div>
              <div>
                <label className="text-gray-700 font-medium">End Time</label>
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleInputChange}
                  className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:ring focus:ring-indigo-300"
                />
              </div>
            </div>
          )}

         
          <div className="flex justify-end space-x-4 mt-6">
            <button
              onClick={handleCancel}
              type="button"
              className="px-5 py-2 bg-gray-300 text-gray-700 font-medium rounded-lg shadow-md hover:bg-gray-400 transition-all duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 text-white font-medium rounded-lg shadow-md hover:bg-indigo-700 transition-all duration-300"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  
)}



    
      <div className="mt-1">
        <h2 className="text-2xl font-bold text-black mb-4 text-center">
          Scheduled Appoinments
        </h2>
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden border ">
          <thead>
            <tr className="bg-[#00897B] text-white">
              {/* <th className="py-3 px-6 text-center">specialization</th> */}
              <th className="py-3 px-6 text-center">Appoinments</th>
              <th className="py-3 px-6 text-center">Date</th>
              <th className="py-3 px-6 text-center">Start Time</th>
              <th className="py-3 px-6 text-center">Status</th>
              <th className="py-3 px-6 text-center">Price</th> 
            </tr>
          </thead>
          <tbody>
  {currentSessions.map((appoinment, index) => (
    <tr key={index} className="border-b">
   
      <td className="py-3 px-6 text-center">
        {indexOfFirstItem + index + 1} 
      </td>
      <td className="py-3 px-6 text-center">
        {new Date(appoinment.selectedDate || appoinment.startDate).toLocaleDateString(undefined, { 
          year: "numeric", 
          month: "long", 
          day: "numeric" 
        })}
      </td>
      <td className="py-3 px-6 text-center">{appoinment.startTime}</td>
      <td className="py-3 px-6 text-center">{appoinment.status}</td>
      <td className="py-3 px-6 text-center">{appoinment.price}</td>
      
    </tr>
  ))}
</tbody>

        </table>
<div className="flex justify-between items-center mt-6">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 text-black rounded mr-2 hover:bg-[#00897B]"
        >
          Previous
        </button>
        <span className="text-gray-600">Page {currentPage} of {Math.ceil(sessionSchedules.length / itemsPerPage)}</span>

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={indexOfLastItem >= sessionSchedules.length}
          className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-[#00897B]"
        >
          Next
        </button>
      </div>
    

      </div>
    </div>
  );
};

export default ScheduleAppoinments;
