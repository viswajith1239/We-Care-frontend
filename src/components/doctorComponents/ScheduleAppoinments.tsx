import React, { useState, ChangeEvent, FormEvent, useEffect, useCallback } from "react";
import axiosinstance from "../../axios/userAxiosInstance";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { ISpecialization } from "../../types/doctor";
import API_URL from "../../axios/API_URL";
import { IAppoinmentSchedule } from "../../types/doctor";
import toast, { Toaster } from "react-hot-toast";
import Swal from "sweetalert2";
import { getDoctorSpecialization, getSessionData } from "../../service/doctorService";

enum RecurrenceType {
  SINGLE = "Single",
  DAILY = "Daily",
  WEEKLY = "Weekly",
  MONTHLY = "Monthly"
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalSchedules: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  limit: number;
}

const ScheduleAppoinments: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [sessionType, setSessionType] = useState<RecurrenceType>(RecurrenceType.SINGLE);
  const [spec, setSpec] = useState<ISpecialization[]>([]);
  const [sessionSchedules, setSessionSchedules] = useState<IAppoinmentSchedule[]>([]);
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);
  const [startDate, setStartDate] = useState('');
const [endDate, setEndDate] = useState('');
const [allAppointments, setAllAppointments] = useState<IAppoinmentSchedule[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [paginationInfo, setPaginationInfo] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalSchedules: 0,
    hasNextPage: false,
    hasPreviousPage: false,
    limit: 5
  });
  const ITEMS_PER_PAGE = 5;

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

  const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (name === 'isRecurring' && type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      const newSessionType = checkbox.checked ? RecurrenceType.DAILY : RecurrenceType.SINGLE;
      
      setSessionType(newSessionType);
      setFormData(prev => ({
        ...prev,
        [name]: checkbox.checked,
        recurrenceType: newSessionType
      }));
      return;
    }

    // Handle recurrenceType change
    if (name === 'recurrenceType') {
      const newType = value as RecurrenceType;
      setSessionType(newType);
      setFormData(prev => ({ ...prev, [name]: newType }));
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

  const handleOpenModal = async (appointmentToReschedule?: IAppoinmentSchedule) => {
    try {
      const response = await getDoctorSpecialization(doctorId)
      setSpec(response.data.data.specializations);

      if (appointmentToReschedule) {
        setIsRescheduling(true);
        setSelectedAppointmentId(appointmentToReschedule._id);

        const appointmentDate = new Date(appointmentToReschedule.selectedDate || appointmentToReschedule.startDate);
        const formattedDate = appointmentDate.toISOString().split('T')[0];
        const specializationId = appointmentToReschedule.specializationId?._id || "";

        // Set sessionType for rescheduling (always single for existing appointments)
        setSessionType(RecurrenceType.SINGLE);
        
        setFormData({
          selectedDate: formattedDate,
          startTime: appointmentToReschedule.startTime,
          endTime: appointmentToReschedule.endTime,
          specialization: specializationId || "",
          price: appointmentToReschedule.price.toString(),
          isRecurring: false,
          recurrenceType: RecurrenceType.SINGLE,
          recurrenceInterval: 1,
          recurrenceEnd: "",
        });
      } else {
        setIsRescheduling(false);
        setSelectedAppointmentId(null);

        // Reset sessionType to default
        setSessionType(RecurrenceType.SINGLE);

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
      }

      setShowModal(true);
    } catch (error) {
      console.error("Error fetching specializations:", error);
      toast.error("Failed to fetch specializations");
    }
  };

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
    setIsRescheduling(false);
    setSelectedAppointmentId(null);
  };

  const filterAppointmentsByDateRange = (appointments: IAppoinmentSchedule[]) => {
  if (!startDate && !endDate) {
    return appointments;
  }

  return appointments.filter(appointment => {
    const appointmentDate = new Date(appointment.selectedDate || appointment.startDate);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    if (start && end) {
      return appointmentDate >= start && appointmentDate <= end;
    } else if (start) {
      return appointmentDate >= start;
    } else if (end) {
      return appointmentDate <= end;
    }
    return true;
  });
};

  // Modified fetchSessionData to accept search parameter
const fetchSessionData = async (page: number = 1, search: string = '') => {
  try {
    console.log("Fetching session data with search:", search);
    
    const response = await getSessionData(doctorId, page, ITEMS_PER_PAGE, search);

    console.log("Full response:", response);
    console.log("Requested page:", page);

    const schedules = response.data.sheduleData?.appoinmentData || [];
    const paginationData = response.data.sheduleData?.pagination || null;

    console.log("Extracted schedules:", schedules);
    console.log("Extracted pagination:", paginationData);

    if (Array.isArray(schedules)) {
      // Store all appointments for filtering
      setAllAppointments(schedules);
      
      // Apply date range filter
      const filteredAppointments = filterAppointmentsByDateRange(schedules);
      setSessionSchedules(filteredAppointments);

      if (paginationData) {
        setPaginationInfo(paginationData);

        if (paginationData.currentPage !== currentPage) {
          setCurrentPage(paginationData.currentPage);
        }
      } else {
        const totalSchedules = filteredAppointments.length;
        const totalPages = Math.ceil(totalSchedules / ITEMS_PER_PAGE);
        setPaginationInfo({
          currentPage: page,
          totalPages: totalPages,
          totalSchedules: totalSchedules,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
          limit: ITEMS_PER_PAGE
        });
      }
    } else {
      console.error("Schedules data is not an array:", schedules);
      setSessionSchedules([]);
      setAllAppointments([]);
    }
  } catch (error) {
    console.error("Failed to fetch schedules:", error);
    toast.error("Failed to fetch schedules");
    setSessionSchedules([]);
    setAllAppointments([]);
  }
};

// Add handlers for date range changes
const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value;
  setStartDate(value);
  applyDateRangeFilter(value, endDate);
};

const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value;
  setEndDate(value);
  applyDateRangeFilter(startDate, value);
};

const applyDateRangeFilter = (start: string, end: string) => {
  const filteredAppointments = allAppointments.filter(appointment => {
    const appointmentDate = new Date(appointment.selectedDate || appointment.startDate);
    const startFilter = start ? new Date(start) : null;
    const endFilter = end ? new Date(end) : null;

    if (startFilter && endFilter) {
      return appointmentDate >= startFilter && appointmentDate <= endFilter;
    } else if (startFilter) {
      return appointmentDate >= startFilter;
    } else if (endFilter) {
      return appointmentDate <= endFilter;
    }
    return true;
  });

  setSessionSchedules(filteredAppointments);
  
  // Update pagination info for filtered results
  const totalSchedules = filteredAppointments.length;
  const totalPages = Math.ceil(totalSchedules / ITEMS_PER_PAGE);
  setPaginationInfo(prev => ({
    ...prev,
    totalSchedules: totalSchedules,
    totalPages: totalPages,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
  }));
};

const clearDateRange = () => {
  setStartDate('');
  setEndDate('');
  setSessionSchedules(allAppointments);
  
  // Reset pagination info
  const totalSchedules = allAppointments.length;
  const totalPages = Math.ceil(totalSchedules / ITEMS_PER_PAGE);
  setPaginationInfo(prev => ({
    ...prev,
    totalSchedules: totalSchedules,
    totalPages: totalPages,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
  }));
};

  // Add debouncedSearch callback
  const debouncedSearch = useCallback(
    debounce((searchTerm: string) => {
      setCurrentPage(1);
      fetchSessionData(1, searchTerm);
    }, 500),
    [doctorId]
  );

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

    if (formData.isRecurring && !isRescheduling) {
      if (!formData.recurrenceEnd) {
        toast.error("Please select an end date for recurring appointments.");
        return;
      }

      if (formData.recurrenceInterval < 1) {
        toast.error("Recurrence interval must be at least 1.");
        return;
      }

      if (
        sessionType === RecurrenceType.WEEKLY &&
        selectedDays.length === 0
      ) {
        toast.error("Please select at least one day for weekly recurring appointments.");
        return;
      }
    }

    try {
      if (isRescheduling && selectedAppointmentId) {
        const rescheduleData = {
          selectedDate: formData.selectedDate,
          startTime: formData.startTime,
          endTime: formData.endTime,
          specializationId: formData.specialization,
          price: formData.price,
          status: "Pending"
        };
        console.log("fffff", rescheduleData);

        const response = await axiosinstance.put(
          `${API_URL}/doctor/shedules/${selectedAppointmentId}/reschedule`,
          rescheduleData
        );

        if (response.status === 200) {
          toast.success("Appointment rescheduled successfully and set to Pending status");
          fetchSessionData(currentPage, searchQuery);
          handleCancel();
        }
      } else {
        const sessionData = {
          ...formData,
          doctorId: doctorId,
          status: "Pending",
          specializationId: formData.specialization,
          isRecurring: formData.isRecurring,
          recurrenceType: formData.isRecurring ? sessionType : "None",
          daysOfWeek: formData.isRecurring && sessionType === RecurrenceType.WEEKLY
            ? selectedDays
            : [],
          recurrenceInterval: formData.isRecurring ? formData.recurrenceInterval : 1,
          recurrenceEnd: formData.isRecurring ? formData.recurrenceEnd : null,
        };

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
          fetchSessionData(currentPage, searchQuery);
          handleCancel();
        }
      }
    } catch (error: any) {
      console.error("Error with appointment:", error);

      const errorMessage =
        error.response?.data?.message ||
        `An unexpected error occurred while ${isRescheduling ? 'rescheduling' : 'creating'} the appointment`;

      toast.error(errorMessage);
    }
  };

  const handleAppoinmentCancel = async (id: string) => {
    try {
      const response = await axiosinstance.patch(`${API_URL}/doctor/shedules/${id}/appoinment`)
      console.log("mmmm", response.data);

      if (response.data.success) {
        toast.success('Appointment cancelled')
        fetchSessionData(currentPage, searchQuery);
      }
    } catch (error) {
      console.error("Failed to cancel appointment:", error);
      toast.error("Failed to cancel appointment");
    }
  }

  const handleReschedule = (appointment: IAppoinmentSchedule) => {
    handleOpenModal(appointment);
  };

  const handlePageChange = (newPage: number) => {
    console.log("Changing to page:", newPage);
    console.log("Current page before change:", currentPage);

    setCurrentPage(newPage);
    fetchSessionData(newPage, searchQuery); // Include search query
  };

  // Updated search handlers
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    debouncedSearch(value);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setCurrentPage(1);
    fetchSessionData(1, '');
  };

  useEffect(() => {
    if (doctorId) {
      fetchSessionData(1, searchQuery); 
    }
  }, [doctorId]); 

  // Update useEffect to include searchQuery in dependencies
  useEffect(() => {
    if (doctorId && currentPage > 1) {
      fetchSessionData(currentPage, searchQuery);
    }
  }, [currentPage]);

  const formatTime = (time:string|undefined) => {
    if (!time) return '';
    
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const renderRecurringOptions = () => {
    if (!formData.isRecurring) return null;

    return (
      <div className="space-y-4">
        <div>
          <label className="text-gray-700 font-medium">Recurrence Type</label>
          <select
            name="recurrenceType"
            value={sessionType} // Use sessionType here
            onChange={handleInputChange}
            className="w-full mt-2 p-2 sm:p-3 border border-gray-300 rounded-lg text-sm sm:text-base"
          >
            {Object.values(RecurrenceType)
              .filter(type => type !== RecurrenceType.SINGLE)
              .map(type => (
                <option key={type} value={type}>{type}</option>
              ))
            }
          </select>
        </div>

        {sessionType === RecurrenceType.WEEKLY && ( // Use sessionType here
          <div>
            <label className="text-gray-700 font-medium">Days of Week</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleDayToggle(index)}
                  className={`px-2 py-2 text-xs sm:px-3 sm:text-sm rounded-lg transition-colors ${selectedDays.includes(index)
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-gray-700 font-medium">Recurrence Interval</label>
            <input
              type="number"
              name="recurrenceInterval"
              value={formData.recurrenceInterval}
              onChange={handleInputChange}
              min="1"
              className="w-full mt-2 p-2 sm:p-3 border border-gray-300 rounded-lg text-sm sm:text-base"
            />
          </div>
          <div>
            <label className="text-gray-700 font-medium">End Recurrence Date</label>
            <input
              type="date"
              name="recurrenceEnd"
              value={formData.recurrenceEnd}
              onChange={handleInputChange}
              className="w-full mt-2 p-2 sm:p-3 border border-gray-300 rounded-lg text-sm sm:text-base"
              min={new Date().toISOString().split("T")[0]}
            />
          </div>
        </div>
      </div>
    );
  };


  return (
    <div className="min-h-screen bg-white py-4 px-2 sm:px-4 lg:px-6">
      <Toaster />


      <div className="mb-6">
        <button
          onClick={() => handleOpenModal()}
          className="w-full sm:w-auto px-4 py-3 bg-[#00897B] text-white text-sm sm:text-lg font-semibold rounded-lg shadow-xl transform hover:scale-105 transition-all duration-300"
        >
          Add New Slot
        </button>
      </div>

      


      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white p-4 sm:p-6 md:p-8 rounded-xl w-full max-w-lg max-h-[95vh] shadow-xl relative">

            <button
              onClick={handleCancel}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl z-10"
            >
              &times;
            </button>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 text-center mb-4 sm:mb-6 pr-8">
              {isRescheduling ? 'Reschedule Appointment' : 'Add Slot Details'}
            </h2>

            <div className="max-h-[70vh] overflow-y-auto">
              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">

                <div>
                  <label className="text-gray-700 font-medium text-sm sm:text-base">Specialization</label>
                  <select
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleInputChange}
                    className="w-full mt-2 p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring focus:ring-indigo-300 text-sm sm:text-base"
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
                  <label className="text-gray-700 font-medium text-sm sm:text-base">Price</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full mt-2 p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring focus:ring-indigo-300 text-sm sm:text-base"
                  />
                </div>

     
                {!isRescheduling && (
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="isRecurring"
                      checked={formData.isRecurring}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    <label className="text-gray-700 text-sm sm:text-base">Create Recurring Appointment</label>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="text-gray-700 font-medium text-sm sm:text-base">Date</label>
                    <input
                      type="date"
                      name="selectedDate"
                      value={formData.selectedDate}
                      onChange={handleInputChange}
                      className="w-full mt-2 p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring focus:ring-indigo-300 text-sm sm:text-base"
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-gray-700 font-medium text-sm sm:text-base">Start Time</label>
                      <input
                        type="time"
                        name="startTime"
                        value={formData.startTime}
                        onChange={handleInputChange}
                        className="w-full mt-2 p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring focus:ring-indigo-300 text-sm sm:text-base"
                      />
                    </div>
                    <div>
                      <label className="text-gray-700 font-medium text-sm sm:text-base">End Time</label>
                      <input
                        type="time"
                        name="endTime"
                        value={formData.endTime}
                        onChange={handleInputChange}
                        className="w-full mt-2 p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring focus:ring-indigo-300 text-sm sm:text-base"
                      />
                    </div>
                  </div>
                </div>

               
                {!isRescheduling && renderRecurringOptions()}

                <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 mt-4 sm:mt-6">
                  <button
                    onClick={handleCancel}
                    type="button"
                    className="px-4 sm:px-5 py-2 bg-gray-300 text-gray-700 font-medium rounded-lg shadow-md hover:bg-gray-400 transition-all duration-300 text-sm sm:text-base"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 sm:px-5 py-2 bg-indigo-600 text-white font-medium rounded-lg shadow-md hover:bg-indigo-700 transition-all duration-300 text-sm sm:text-base"
                  >
                    {isRescheduling ? 'Update' : 'Save'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

 
      <div className="mt-6">
        <h2 className="text-xl sm:text-2xl font-bold text-black mb-4 text-center">
          Scheduled Slots
        </h2>

        <div className="mb-4 sm:mb-6 flex justify-center">
        <div className="relative w-full max-w-xs sm:max-w-md lg:max-w-lg">
          <input
            type="text"
            placeholder="Search...."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border  border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00897B] focus:border-transparent outline-none"
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

        <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row justify-center items-center gap-4">
    <div className="flex flex-col sm:flex-row items-center gap-2">
      <label className="text-sm font-medium text-gray-700"></label>
      <input
        type="date"
        value={startDate}
        onChange={handleStartDateChange}
        className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00897B] focus:border-transparent outline-none"
      />
    </div>
    
    <div className="flex flex-col sm:flex-row items-center gap-2">
      <label className="text-sm font-medium text-gray-700"></label>
      <input
        type="date"
        value={endDate}
        onChange={handleEndDateChange}
        className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00897B] focus:border-transparent outline-none"
        min={startDate}
      />
    </div>
    
    {(startDate || endDate) && (
      <button
        onClick={clearDateRange}
        className="px-3 py-2 text-sm bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
      >
        Clear Dates
      </button>
    )}
  </div>


      </div>

        <div className="hidden lg:block overflow-x-auto mt-10">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden border">
            <thead>
              <tr className="bg-[#00897B] text-white">
                <th className="py-3 px-4 text-center text-sm font-medium">Slots</th>
                <th className="py-3 px-4 text-center text-sm font-medium">Date</th>
                <th className="py-3 px-4 text-center text-sm font-medium">Start Time</th>
                <th className="py-3 px-4 text-center text-sm font-medium">End Time</th>
                <th className="py-3 px-4 text-center text-sm font-medium">Status</th>
                <th className="py-3 px-4 text-center text-sm font-medium">Price</th>
                <th className="py-3 px-4 text-center text-sm font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {sessionSchedules.length > 0 ? (
                sessionSchedules.map((appoinment, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 text-center text-sm">
                      {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                    </td>
                    <td className="py-3 px-4 text-center text-sm">
                      {new Date(appoinment.selectedDate || appoinment.startDate).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric"
                      })}
                    </td>
                    <td className="py-3 px-4 text-center text-sm">{formatTime(appoinment.startTime)}</td>
                    <td className="py-3 px-4 text-center text-sm">{formatTime(appoinment.endTime)}</td>
                    <td className="py-3 px-4 text-center text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        appoinment.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                        appoinment.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                        appoinment.status === 'Completed' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {appoinment.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center text-sm">₹{appoinment.price}</td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          className={`py-1 px-2 rounded-md text-xs text-white ${
                            (appoinment.status === 'Cancelled' || appoinment.status === 'Completed' || appoinment.status === 'Confirmed')
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-red-500 hover:bg-red-600"
                          }`}
                          onClick={() => {
                            if (
                              appoinment.status !== 'Cancelled' &&
                              appoinment.status !== 'Completed' &&
                              appoinment.status !== 'Confirmed'
                            ) {
                              Swal.fire({
                                title: 'Are you sure?',
                                text: "You won't be able to revert this!",
                                icon: 'warning',
                                showCancelButton: true,
                                confirmButtonColor: '#d33',
                                cancelButtonColor: '#3085d6',
                                confirmButtonText: 'Yes, cancel it!'
                              }).then((result) => {
                                if (result.isConfirmed) {
                                  handleAppoinmentCancel(appoinment._id);
                                  Swal.fire(
                                    'Cancelled!',
                                    'Your appointment has been cancelled.',
                                    'success'
                                  );
                                }
                              });
                            }
                          }}
                          disabled={
                            appoinment.status === 'Cancelled' ||
                            appoinment.status === 'Completed' ||
                            appoinment.status === 'Confirmed'
                          }
                        >
                          {appoinment.status === 'Cancelled' ? "Cancelled" : "Cancel"}
                        </button>

                        <button
                          className={`py-1 px-2 rounded-md text-xs text-white ${
                            (appoinment.status === 'Cancelled' || appoinment.status === 'Completed')
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-blue-500 hover:bg-blue-600"
                          }`}
                          onClick={() => {
                            if (
                              appoinment.status !== 'Cancelled' &&
                              appoinment.status !== 'Completed'
                            ) {
                              handleReschedule(appoinment);
                            }
                          }}
                          disabled={
                            appoinment.status === 'Cancelled' ||
                            appoinment.status === 'Completed'
                          }
                        >
                          Reschedule
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-500">
                    No scheduled appointments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

    
        <div className="lg:hidden space-y-4">
          {sessionSchedules.length > 0 ? (
            sessionSchedules.map((appoinment, index) => (
              <div key={index} className="bg-white border rounded-lg p-4 shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <div className="text-sm font-medium text-gray-600">
                    Slot #{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    appoinment.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                    appoinment.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                    appoinment.status === 'Completed' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {appoinment.status}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                  <div>
                    <span className="text-gray-600">Price:</span>
                    <div className="font-medium">₹{appoinment.price}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Start Time:</span>
                    <div className="font-medium">{formatTime(appoinment.startTime)}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">End Time:</span>
                    <div className="font-medium">{formatTime(appoinment.endTime)}</div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    className={`flex-1 py-2 px-3 rounded-md text-sm text-white ${
                      (appoinment.status === 'Cancelled' || appoinment.status === 'Completed' || appoinment.status === 'Confirmed')
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-red-500 hover:bg-red-600"
                    }`}
                    onClick={() => {
                      if (
                        appoinment.status !== 'Cancelled' &&
                        appoinment.status !== 'Completed' &&
                        appoinment.status !== 'Confirmed'
                      ) {
                        Swal.fire({
                          title: 'Are you sure?',
                          text: "You won't be able to revert this!",
                          icon: 'warning',
                          showCancelButton: true,
                          confirmButtonColor: '#d33',
                          cancelButtonColor: '#3085d6',
                          confirmButtonText: 'Yes, cancel it!'
                        }).then((result) => {
                          if (result.isConfirmed) {
                            handleAppoinmentCancel(appoinment._id);
                            Swal.fire(
                              'Cancelled!',
                              'Your appointment has been cancelled.',
                              'success'
                            );
                          }
                        });
                      }
                    }}
                    disabled={
                      appoinment.status === 'Cancelled' ||
                      appoinment.status === 'Completed' ||
                      appoinment.status === 'Confirmed'
                    }
                  >
                    {appoinment.status === 'Cancelled' ? "Cancelled" : "Cancel"}
                  </button>

                  <button
                    className={`flex-1 py-2 px-3 rounded-md text-sm text-white ${
                      (appoinment.status === 'Cancelled' || appoinment.status === 'Completed')
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-500 hover:bg-blue-600"
                    }`}
                    onClick={() => {
                      if (
                        appoinment.status !== 'Cancelled' &&
                        appoinment.status !== 'Completed'
                      ) {
                        handleReschedule(appoinment);
                      }
                    }}
                    disabled={
                      appoinment.status === 'Cancelled' ||
                      appoinment.status === 'Completed'
                    }
                  >
                    Reschedule
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              No scheduled appointments found.
            </div>
          )}
        </div>

       
        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
          <button
            className="w-full sm:w-auto px-4 py-2 bg-gray-300 rounded disabled:opacity-50 text-sm sm:text-base hover:bg-gray-400 transition-colors"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={!paginationInfo?.hasPreviousPage || currentPage <= 1}
          >
            Previous
          </button>
          <span className="text-gray-600 text-sm sm:text-base">
            Page {currentPage} of {paginationInfo?.totalPages || 1}
          </span>
          <button
            className="w-full sm:w-auto px-4 py-2 bg-gray-300 rounded disabled:opacity-50 text-sm sm:text-base hover:bg-gray-400 transition-colors"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!paginationInfo?.hasNextPage || currentPage >= (paginationInfo?.totalPages || 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleAppoinments;