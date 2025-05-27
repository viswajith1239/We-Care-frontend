import React, { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import MessageInputBar from "./MessageInputBar";
import API_URL from "../../axios/API_URL";
import { FaVideo } from "react-icons/fa";
import { useSocketContext } from '../../context/socket';
import { setVideoCall,setPrescription } from '../../slice/DoctorSlice';
import { useDispatch } from 'react-redux';
import { Doctor } from "../../types/doctor";
import userimg from "../../assets/user.png"
import doctorAxiosInstance from "../../axios/doctorAxiosInstance";
import { Toaster, toast } from 'react-hot-toast';

interface Message {
  createdAt: any;
  _id: string;
  senderId: string;
  receiverId: string;
  message: string;
  imageUrl?: string; 
}

interface User {
  startDate: string;
  bookingDate: string;
  amount: any;
  email: string;
  _id: string;
  id: string;
  name: string;
  profileImage?: string;
  userId: string;
  image?: string;
  booking?: string;
  appoinmentId: string;
}

interface DoctorChatProps {
  doctorId: string;
  bookingId: string | null;
  userId: string;
}

interface Prescription {
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instruction: string;
}

const Chat: React.FC<DoctorChatProps> = ({ userId }) => {
  const { userInfo } = useSelector((state: RootState) => state.user);
  const { doctorInfo,showPrescription  } = useSelector((state: RootState) => state.doctor);
  const [bookingId, setBookingId] = useState<string | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selecteduser, setSelectedUser] = useState<User | null>(null);
  const [doctorData, setDoctorData] = useState<Doctor | null>(null);

   const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([{
    medicineName: '',
    dosage: '',
    frequency: '',
    duration: '',
    instruction: ''
  }]);
  let { socket } = useSocketContext();
  const dispatch = useDispatch<AppDispatch>();

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showPrescription  && selecteduser) {
      setIsModalOpen(true);
      // Reset the prescription state to false after opening modal
      dispatch(setPrescription(false));
    }
  },[showPrescription , selecteduser, dispatch]);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'instant' });
    }
  }, [messages, selecteduser]);


  console.log("Selected Patient:", selecteduser);
  console.log("Patients List:", users);
  console.log("Doctor ID:", doctorInfo?.id);
  const doctorId = doctorInfo?.id;

  useEffect(() => {
    const fetchusers = async () => {
      if (!doctorInfo?.id) return;
  
      try {
        const response = await axios.get(`${API_URL}/doctor/fetchusers/${doctorInfo?.id}`, {
          withCredentials: true,
        });
  
        console.log("Users response:", response.data);
  
        const extractedUsers = response.data.map((item: any) => ({
        _id: item._id, 
          id: item.userId, 
          name: item.name, 
          email: item.email,
          amount: item.amount,
          appoinmentId: item.appoinmentId,
          profileImage: item.profileImage,
          bookingDate:item.bookingDate,
          startDate:item.startDate
        }));
  
        setUsers(extractedUsers);
        console.log("Users Fetched:", extractedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
  
    fetchusers();
  }, [doctorInfo]);

  useEffect(() => {
    if (!selecteduser || !doctorInfo) return;

    const fetchMessages = async () => {
      console.log("Fetching messages between doctor and patient");
      console.log("Doctor ID:", doctorInfo.id);
      console.log("Patient ID:", selecteduser._id);

      try {
        const response = await axios.get(`${API_URL}/messages/${doctorInfo.id}/${selecteduser._id}`);
        setMessages(response.data);
        console.log("Messages Fetched:", response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [selecteduser, doctorInfo]);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await axios.get(`${API_URL}/doctor/${doctorInfo.id}`);
        setDoctorData(response.data.DoctorData[0]);
      } catch (error) {
        console.error("Error fetching doctor data:", error);
      }
    };
    fetchDoctor();
  }, [doctorInfo.id]);

  useEffect(() => {
    if (!socket) return;

    socket.emit("join", doctorInfo?.id || userInfo?.id);

    const handleNewMessage = (newMessage: any) => {
      console.log("New message received via socket:", newMessage);
      setMessages((prev) => [...prev, newMessage]);
    };

    socket.on("messageUpdate", handleNewMessage);

    return () => {
      socket.off("messageUpdate", handleNewMessage);
    };
  }, [socket, doctorInfo?.id, userInfo?.id]);
 
  const handleSelectDoctor = (doctor: User) => {
    console.log("Patient Selected:", doctor.id);
    setSelectedUser(doctor);
  };

  const handleNewMessage = (newMessage: Message) => {
    console.log("New message from input:", newMessage);
    setMessages((prev) => {
      const isDuplicate = prev.some(
        (msg) =>
          msg._id === newMessage._id ||
          (msg.createdAt === newMessage.createdAt &&
            msg.message === newMessage.message)
      );
      return isDuplicate ? prev : [...prev, newMessage];
    });
  };

  const navigateVideoChat = () => {
    console.log("Starting video call");
    dispatch(
      setVideoCall({
        userID: selecteduser?._id || "",
        type: "out-going",
        callType: "video",
        roomId: `${Date.now()}`,
        userName: `${selecteduser?.name}`,
        doctorName: `${doctorData?.name}`,
        doctorImage: `${doctorData?.profileImage}`, 
        bookingId: `${selecteduser?.appoinmentId}`
      })
    );
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      const response = await axios.delete(`${API_URL}/messages/${messageId}`, {
        withCredentials: true,
      });

      if (response.status === 200) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg._id === messageId
              ? {
                  ...msg,
                  message: "Your message was deleted",
                  imageUrl: "",
                }
              : msg
          )
        );
      }
    } catch (error) {
      console.error("Failed to delete message:", error);
    }
  };



  const handleChange = (index: number, field: keyof Prescription, value: string) => {
    const updatedPrescriptions = [...prescriptions];
    updatedPrescriptions[index][field] = value;
    setPrescriptions(updatedPrescriptions);
  };

  const addPrescriptionField = () => {
    setPrescriptions([...prescriptions, {
      medicineName: '',
      dosage: '',
      frequency: '',
      duration: '',
      instruction: ''
    }]);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selecteduser || !doctorId) {
      toast.error('Please select a patient first.');
      return;
    }

    try {

      const prescriptionData = {
        prescriptions,
        patientDetails: {
          id: selecteduser._id,
          name: selecteduser.name,
          email: selecteduser.email,
          appointmentId: selecteduser.appoinmentId,
          amount: selecteduser.amount,
          bookingDate:selecteduser.bookingDate,
          startDate:selecteduser.startDate
          
        },
        doctorDetails: {
          doctorId: doctorId,
          doctorName: doctorData?.name,
          doctorImage: doctorData?.profileImage,
        }
      };
      const response = await doctorAxiosInstance.post(`${API_URL}/doctor/prescription/${doctorId}/${selecteduser._id}`, {
        ...prescriptionData
      });

      toast.success('Prescription submitted successfully!');
      setIsModalOpen(false);
      setPrescriptions([{
        medicineName: '',
        dosage: '',
        frequency: '',
        duration: '',
        instruction: ''
      }]);
    } catch (error) {
      console.error('Error submitting prescription:', error);
      toast.error('Failed to submit prescription.');
    }
  };

  return (
    <div className="flex h-full">
      <Toaster/>
      <div className="w-1/3 bg-gray-100 p-4 border-r">
        <h2 className="text-lg font-semibold mb-4">Your Patients</h2>
        <div className="space-y-2">
          {users.length === 0 ? (
            <p className="text-gray-500">No patients available</p>
          ) : (
            users.map((user) => (
              <div
                key={user._id} 
                onClick={() => handleSelectDoctor(user)}
                className={`flex items-center p-2 rounded-lg cursor-pointer ${
                  selecteduser?._id === user._id ? "bg-[#00897B] text-white" : "hover:bg-gray-200"
                }`}
              >
                <img className="h-10 w-10 rounded-full mr-3" src={userimg} alt={user.name} />
                <span>{user.name}</span> 
              </div>
            ))
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {selecteduser ? (
          <div className="p-4 bg-[#00897B] text-white text-lg font-semibold flex items-center rounded-lg">
            <img className="h-10 w-10 rounded-full mr-3" src={userimg} alt="user" />
            <span className="flex-1">Chat with {selecteduser.name}</span>
             {/* <button
              onClick={() => setIsModalOpen(true)}
              className="mr-2 p-2 rounded-lg hover:bg-[#00695C] transition-colors"
              title="Add Prescription"
              aria-label="Add prescription"
            >
              + Prescription
            </button> */}
            <button
              onClick={navigateVideoChat}
              className="p-2 rounded-lg hover:bg-[#00695C] transition-colors"
              title="Start Video Call"
              aria-label="Start video call"
            >
              <FaVideo size={24} />
            </button>
          </div>
        ) : (
          <div className="p-4">
            <h2 className="text-1xl font-semibold text-black">
              Select a patient to start chatting
            </h2>
          </div>
        )}
        
        <div className="flex-1 overflow-auto p-4">
          {selecteduser && messages.length === 0 ? (
            <p className="text-gray-500">No messages yet</p>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`flex items-end mb-4 ${
                  msg.senderId === doctorInfo?.id ? "justify-end" : "justify-start"
                }`}
              >
                {msg.senderId !== doctorInfo?.id && (
                  <img
                    src={userimg}
                    alt="User"
                    className="w-8 h-8 rounded-full mr-2"
                  />
                )}
                <div className="flex flex-col">
                  <div
                    className={`p-3 rounded-lg max-w-xs ${
                      msg.senderId === doctorInfo?.id
                        ? "bg-[#00897B] text-white"
                        : "bg-gray-300 text-black"
                    }`}
                  >
                   
                    {msg.message && <p className="mb-2">{msg.message}</p>}
                    
                 
                    {msg.imageUrl && (
                      <img 
                        src={msg.imageUrl} 
                        alt="Message attachment" 
                        className="rounded-lg max-w-full max-h-64 mt-1" 
                        onError={(e) => {
                          console.error("Image failed to load:", msg.imageUrl);
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-400 mt-1 self-end">
                    {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={bottomRef}></div>
        </div>
        
        {selecteduser && (
          <MessageInputBar 
            userId={selecteduser._id} 
            onNewMessage={handleNewMessage} 
          />
        )}
      </div>

       {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl relative overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-3 text-xl text-gray-600 hover:text-red-500"
            >
              &times;
            </button>

            <h2 className="text-2xl font-semibold mb-4">Create Prescription for {selecteduser?.name}</h2>

            <form onSubmit={handleSubmit}>
              {prescriptions.map((item, index) => (
                <div key={index} className="mb-6">
                  <label className="block text-sm font-medium mb-1">Medicine Name</label>
                  <input
                    type="text"
                    value={item.medicineName}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleChange(index, 'medicineName', e.target.value)
                    }
                    className="w-full border border-gray-300 px-3 py-2 rounded-md"
                    required
                  />

                  <label className="block text-sm font-medium mt-3 mb-1">Dosage</label>
                  <input
                    type="text"
                    value={item.dosage}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleChange(index, 'dosage', e.target.value)
                    }
                    className="w-full border border-gray-300 px-3 py-2 rounded-md"
                    required
                  />

                  <label className="block text-sm font-medium mt-3 mb-1">Frequency</label>
                  <input
                    type="text"
                    value={item.frequency}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleChange(index, 'frequency', e.target.value)
                    }
                    className="w-full border border-gray-300 px-3 py-2 rounded-md"
                    required
                  />

                  <label className="block text-sm font-medium mt-3 mb-1">Duration</label>
                  <input
                    type="text"
                    value={item.duration}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleChange(index, 'duration', e.target.value)
                    }
                    className="w-full border border-gray-300 px-3 py-2 rounded-md"
                    required
                  />

                  <label className="block text-sm font-medium mt-3 mb-1">Instruction</label>
                  <input
                    type="text"
                    value={item.instruction}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleChange(index, 'instruction', e.target.value)
                    }
                    className="w-full border border-gray-300 px-3 py-2 rounded-md"
                  />
                </div>
              ))}

              <button
                type="button"
                onClick={addPrescriptionField}
                className="text-blue-600 hover:text-blue-800 mb-4"
              >
                + Add another medicine
              </button>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="bg-[#00897B] text-white px-4 py-2 rounded hover:bg-[#00695C]"
                >
                  Submit Prescription
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;