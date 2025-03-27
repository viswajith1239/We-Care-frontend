import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import axiosinstance from "../../axios/userAxiosInstance";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { ISpecialization } from "../../types/doctor";
import API_URL from "../../axios/API_URL";
import { IAppoinmentSchedule } from "../../types/doctor";
import toast, { Toaster } from "react-hot-toast";

enum RecurrenceType {
  SINGLE = "Single",
  DAILY = "Daily",
  WEEKLY = "Weekly",
  MONTHLY = "Monthly"
}

const ScheduleAppoinments: React.FC = () => {
 
  const [showModal, setShowModal] = useState(false);
  const [sessionType, setSessionType] = useState<RecurrenceType>(RecurrenceType.SINGLE);
  const [spec, setSpec] = useState<ISpecialization[]>([]);
  const [sessionSchedules, setSessionSchedules] = useState<IAppoinmentSchedule[]>([]);
  
  
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(3);

 
  const [formData, setFormData] = useState({
    selectedDate: "",
    startTime: "",
    endTime: "",
    specialization: "",
    price: "",
    isRecurring: false,
    recurrenceType: RecurrenceType.SINGLE,
    recurrenceInterval: 1,
    recurrenceEnd: "",
  });

 
  const [selectedDays, setSelectedDays] = useState<number[]>([]);


  const { doctorInfo } = useSelector((state: RootState) => state.doctor);
  const doctorId = doctorInfo.id;


  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
  
    if (name === 'isRecurring' && type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFormData(prev => ({
        ...prev,
        [name]: checkbox.checked,
        recurrenceType: checkbox.checked ? RecurrenceType.DAILY : RecurrenceType.SINGLE
      }));
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  
  const handleDayToggle = (day: number) => {
    setSelectedDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  
  const handleOpenModal = async () => {
    try {
      setShowModal(true);
      const response = await axiosinstance.get(`${API_URL}/doctor/specializations/${doctorId}`);
      setSpec(response.data.data.specializations);
    } catch (error) {
      console.error("Error fetching specializations:", error);
      toast.error("Failed to fetch specializations");
    }
  };

  // Cancel modal and reset form
  const handleCancel = () => {
    setFormData({
      selectedDate: "",
      startTime: "",
      endTime: "",
      specialization: "",
      price: "",
      isRecurring: false,
      recurrenceType: RecurrenceType.SINGLE,
      recurrenceInterval: 1,
      recurrenceEnd: "",
    });
    setSelectedDays([]);
    setSessionType(RecurrenceType.SINGLE);
    setShowModal(false);
  };

  
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    
    if (!formData.selectedDate || !formData.startTime || !formData.endTime) {
      toast.error("Please fill in all required fields.");
      return;
    }
  
   
    if (!formData.specialization) {
      toast.error("Please select a specialization.");
      return;
    }
  
    
    if (!formData.price || Number(formData.price) <= 0) {
      toast.error("Please enter a valid price.");
      return;
    }
  

    if (formData.isRecurring) {
     
      if (!formData.recurrenceEnd) {
        toast.error("Please select an end date for recurring appointments.");
        return;
      }
  
    
      if (formData.recurrenceInterval < 1) {
        toast.error("Recurrence interval must be at least 1.");
        return;
      }
  
     
      if (
        formData.recurrenceType === RecurrenceType.WEEKLY && 
        selectedDays.length === 0
      ) {
        toast.error("Please select at least one day for weekly recurring appointments.");
        return;
      }
    }
  
    const sessionData = {
      ...formData,
      doctorId: doctorId,
      status: "Pending",
      specializationId: formData.specialization,
      isRecurring: formData.isRecurring,
      recurrenceType: formData.isRecurring ? formData.recurrenceType : "None",
      daysOfWeek: formData.isRecurring && formData.recurrenceType === RecurrenceType.WEEKLY 
        ? selectedDays 
        : [],
      recurrenceInterval: formData.isRecurring ? formData.recurrenceInterval : 1,
      recurrenceEnd: formData.isRecurring ? formData.recurrenceEnd : null,
    };
  
    try {
      const response = await axiosinstance.post(
        `${API_URL}/doctor/appoinments/${doctorId}`,
        sessionData
      );
  
      if (response.status === 201) {
        
        const createdSessions = Array.isArray(response.data.apponmentscreated)
          ? response.data.apponmentscreated
          : [response.data.apponmentscreated];
  
        
        setSessionSchedules((prevSchedules) => [
          ...prevSchedules,
          ...createdSessions
        ]);
  
       
        toast.success(
          formData.isRecurring 
            ? "Recurring appointments created successfully" 
            : "Single appointment created successfully"
        );
  
       
        handleCancel();
      }
    } catch (error: any) {
      
      console.error("Error creating appointment:", error);
      
      const errorMessage = 
        error.response?.data?.message || 
        "An unexpected error occurred while creating the appointment";
      
      toast.error(errorMessage);
    }
  };

  
  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        const response = await axiosinstance.get(
          `${API_URL}/doctor/shedules/${doctorId}`
        );
        
        const schedules = response.data.sheduleData;
        setSessionSchedules(schedules);
      } catch (error) {
        console.error("Failed to fetch schedules:", error);
        toast.error("Failed to fetch schedules");
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

 
  const renderRecurringOptions = () => {
    if (!formData.isRecurring) return null;

    return (
      <div className="space-y-4">
        <div>
          <label className="text-gray-700 font-medium">Recurrence Type</label>
          <select
            name="recurrenceType"
            value={formData.recurrenceType}
            onChange={handleInputChange}
            className="w-full mt-2 p-3 border border-gray-300 rounded-lg"
          >
            {Object.values(RecurrenceType)
              .filter(type => type !== RecurrenceType.SINGLE)
              .map(type => (
                <option key={type} value={type}>{type}</option>
              ))
            }
          </select>
        </div>

        {formData.recurrenceType === RecurrenceType.WEEKLY && (
          <div>
            <label className="text-gray-700 font-medium">Days of Week</label>
            <div className="flex space-x-2 mt-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleDayToggle(index)}
                  className={`px-3 py-2 rounded-lg ${
                    selectedDays.includes(index) 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-gray-700 font-medium">Recurrence Interval</label>
            <input
              type="number"
              name="recurrenceInterval"
              value={formData.recurrenceInterval}
              onChange={handleInputChange}
              min="1"
              className="w-full mt-2 p-3 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="text-gray-700 font-medium">End Recurrence Date</label>
            <input
              type="date"
              name="recurrenceEnd"
              value={formData.recurrenceEnd}
              onChange={handleInputChange}
              className="w-full mt-2 p-3 border border-gray-300 rounded-lg"
              min={new Date().toISOString().split("T")[0]}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white py-4 px-4">
      <Toaster/>
      
    
      <button
        onClick={handleOpenModal}
        className="mt-2 px-4 py-3 bg-[#00897B] text-white text-lg font-semibold rounded-lg shadow-xl transform hover:scale-105 transition-all duration-300"
      >
        Add New Appointment
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
     
          
           <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">
             Add Appointment Details
           </h2>
     
         
           <div className="max-h-[80vh] overflow-y-auto">
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
     
               
               <div className="flex items-center">
                 <input
                   type="checkbox"
                   name="isRecurring"
                   checked={formData.isRecurring}
                   onChange={handleInputChange}
                   className="mr-2"
                 />
                 <label className="text-gray-700">Create Recurring Appointment</label>
               </div>
     
             
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
     
              
               {renderRecurringOptions()}
     
              
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
         </div>
      )}


      <div className="mt-1">
        <h2 className="text-2xl font-bold text-black mb-4 text-center">
          Scheduled Appointments
        </h2>
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden border">
          <thead>
            <tr className="bg-[#00897B] text-white">
              <th className="py-3 px-6 text-center">Appointments</th>
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
          <span className="text-gray-600">
            Page {currentPage} of {Math.ceil(sessionSchedules.length / itemsPerPage)}
          </span>
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