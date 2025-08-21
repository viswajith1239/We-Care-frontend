import React, { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import MessageInputBar from "./MessageInputBar";
import API_URL from "../../axios/API_URL";
import profileicon from "../../assets/user.png";
import { FaVideo } from "react-icons/fa";
import { useSocketContext } from "../../context/socket";
import { setVideoCall, setPrescription } from "../../slice/DoctorSlice";
import doctorAxiosInstance from "../../axios/doctorAxiosInstance";
import { Toaster, toast } from "react-hot-toast";

interface Message {
  createdAt: any;
  _id: string;
  senderId: string;
  receiverId: string;
  message: string;
  imageUrl?: string;
  read?: boolean;
}

interface User {
  bookingId: string;
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

interface Doctor {
  _id: string;
  name: string;
  profileImage?: string;
}

interface Prescription {
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instruction: string;
}

interface DoctorChatProps {
  doctorId: string;
  bookingId: string | null;
  userId: string;
}

const Chat: React.FC<DoctorChatProps> = ({ userId }) => {
  const { userInfo } = useSelector((state: RootState) => state.user);
  const { doctorInfo, showPrescription } = useSelector((state: RootState) => state.doctor);
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [doctorData, setDoctorData] = useState<Doctor | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([{
    medicineName: "",
    dosage: "",
    frequency: "",
    duration: "",
    instruction: "",
  }]);
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);

  const { socket, onlineUsers } = useSocketContext();
  const dispatch = useDispatch<AppDispatch>();
  const bottomRef = useRef<HTMLDivElement>(null);
  const processedMessages = useRef(new Set<string>());

  useEffect(() => {
    if (showPrescription && selectedUser) {
      setIsModalOpen(true);
      dispatch(setPrescription(false));
    }
  }, [showPrescription, selectedUser, dispatch]);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "instant" });
    }
  }, [messages, selectedUser]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!doctorInfo?.id) return;

      try {
        const response = await axios.get(`${API_URL}/doctor/fetchusers/${doctorInfo?.id}`, {
          withCredentials: true,
        });
        console.log("rr",response);
        

        const extractedUsers = response.data.map((item: any) => ({
          _id: item._id,
          id: item.userId,
          name: item.name,
          email: item.email,
          amount: item.amount,
          appoinmentId: item.appoinmentId,
          bookingId:item.bookingId,
          profileImage: item.profileImage,
          bookingDate: item.bookingDate,
          startDate: item.startDate,
         
        }));

        setUsers(extractedUsers);
        if (userId) {
          const user = extractedUsers.find((u: User) => u._id === userId);
          if (user) setSelectedUser(user);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [doctorInfo, userId]);

  useEffect(() => {
    if (!selectedUser || !doctorInfo) return;

    const fetchMessages = async () => {
      try {
        const response = await axios.get(`${API_URL}/messages/${doctorInfo.id}/${selectedUser._id}`);
        if (Array.isArray(response.data)) {
          processedMessages.current.clear();
          response.data.forEach((msg: Message) => {
            if (msg._id) processedMessages.current.add(msg._id);
          });
          setMessages(response.data);
        } else {
          console.error("Expected array of messages but got:", response.data);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [selectedUser, doctorInfo]);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await axios.get(`${API_URL}/doctor/${doctorInfo.id}`);
       
        
        setDoctorData(response.data.DoctorData);
      } catch (error) {
        console.error("Error fetching doctor data:", error);
      }
    };
    fetchDoctor();
  }, [doctorInfo?.id]);

  useEffect(() => {
  console.log("doctorInfo:", doctorInfo); // 👈 Add this to debug
}, [doctorInfo]);

  // Socket listener for messages and deletions
  useEffect(() => {
    if (!socket) return;

    socket.emit("join", doctorInfo?.id || userInfo?.id);

    const handleSocketMessage = (newMessage: Message) => {
      const isRelevantConversation =
        selectedUser &&
        ((newMessage.senderId === selectedUser._id && newMessage.receiverId === doctorInfo?.id) ||
         (newMessage.senderId === doctorInfo?.id && newMessage.receiverId === selectedUser._id));

      if (!isRelevantConversation) return;

      if (newMessage._id && processedMessages.current.has(newMessage._id)) return;

      if (newMessage._id) processedMessages.current.add(newMessage._id);

      setMessages((prev) => [...prev, newMessage]);
    };

    const handleMessageDeleted = ({ messageId }: { messageId: string }) => {
      console.log(`Received messageDeleted event for messageId: ${messageId}`);
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId
            ? { ...msg, message: "this message was deleted", imageUrl: "", read: msg.read }
            : msg
        )
      );
      setSelectedMessage(null);
    };

    socket.on("messageUpdate", handleSocketMessage);
    socket.on("messageDeleted", handleMessageDeleted);

    return () => {
      socket.off("messageUpdate", handleSocketMessage);
      socket.off("messageDeleted", handleMessageDeleted);
    };
  }, [socket, doctorInfo?.id, userInfo?.id, selectedUser]);

  // Handle click outside to deselect message
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".message-container")) {
        setSelectedMessage(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectDoctor = (user: User) => {
    setSelectedUser(user);
    setSelectedMessage(null);
  };

  const handleNewMessageFromInput = (newMessage: Message) => {
    if (newMessage._id && processedMessages.current.has(newMessage._id)) return;

    if (newMessage._id) processedMessages.current.add(newMessage._id);

    setMessages((prev) => [...prev, newMessage]);
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      console.log(`Attempting to delete message with ID: ${messageId}`);
      const response = await axios.delete(`${API_URL}/messages/${messageId}`, {
        withCredentials: true,
      });
      console.log("");
      

      if (response.status === 200) {
        if (socket && selectedUser) {
          console.log(`Emitting messageDeleted event for messageId: ${messageId}`);
          socket.emit("messageDeleted", {
            messageId: messageId,
            senderId: doctorInfo?.id,
            receiverId: selectedUser._id,
          });
        }
        setMessages((prev) =>
          prev.map((msg) =>
            msg._id === messageId
              ? { ...msg, message: "Your message was deleted", imageUrl: "", read: msg.read }
              : msg
          )
        );
        setSelectedMessage(null);
      }
    } catch (error) {
      console.error("Failed to delete message:", error);
      toast.error("Failed to delete message");
    }
  };

  const handleMessageDoubleClick = (messageId: string, isDoctorMessage: boolean) => {
    if (isDoctorMessage) {
      setSelectedMessage(selectedMessage === messageId ? null : messageId);
    }
  };
  console.log("selectedUser:", selectedUser);
console.log("doctorData:", doctorData);

  const navigateVideoChat = () => {
    dispatch(
      setVideoCall({
        userID: selectedUser?._id || "",
        type: "out-going",
        callType: "video",
        roomId: `${Date.now()}`,
        userName: `${selectedUser?.name}`,
        doctorName: `${doctorData?.name}`,
        doctorImage: `${doctorData?.profileImage}`,
        profileImage:`${selectedUser?.profileImage}`,
        bookingId: `${selectedUser?.appoinmentId}`,
      })
    );
  };

  const handleChange = (index: number, field: keyof Prescription, value: string) => {
    const updatedPrescriptions = [...prescriptions];
    updatedPrescriptions[index][field] = value;
    setPrescriptions(updatedPrescriptions);
  };

  const addPrescriptionField = () => {
    setPrescriptions([...prescriptions, {
      medicineName: "",
      dosage: "",
      frequency: "",
      duration: "",
      instruction: "",
    }]);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedUser || !doctorInfo?.id) {
      toast.error("Please select a patient first.");
      return;
    }

    console.log('Full selectedUser object:', selectedUser);

    try {
      const prescriptionData = {
        prescriptions,
        patientDetails: {
          id: selectedUser._id,
          name: selectedUser.name,
          email: selectedUser.email,
          bookingIds: selectedUser.bookingId,
          bookingId:selectedUser.appoinmentId,
          amount: selectedUser.amount,
          bookingDate: selectedUser.bookingDate,
          startDate: selectedUser.startDate,
          
        },
        doctorDetails: {
          doctorId: doctorInfo.id,
          doctorName: doctorData?.name,
          doctorImage: doctorData?.profileImage,
        },
      };
     await doctorAxiosInstance.post(
        `${API_URL}/doctor/prescription/${doctorInfo.id}/${selectedUser._id}`,
        { ...prescriptionData }
      );

      toast.success("Prescription submitted successfully!");
      setIsModalOpen(false);
      setPrescriptions([{
        medicineName: "",
        dosage: "",
        frequency: "",
        duration: "",
        instruction: "",
      }]);
    } catch (error) {
      console.error("Error submitting prescription:", error);
      toast.error("Failed to submit prescription.");
    }
  };

  return (
    <div className="flex h-full">
      <Toaster />
      <div className="w-1/3 bg-gray-100 p-4 border-r overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Your Patients</h2>
        <div className="space-y-2">
          {users.length === 0 ? (
            <p className="text-gray-500">No patients available</p>
          ) : (
            users.map((user) => {
              const isUserOnline = onlineUsers.includes(user._id);

              return (
                <div
                  key={user._id}
                  onClick={() => handleSelectDoctor(user)}
                  className={`flex items-center p-2 rounded-lg cursor-pointer ${
                    selectedUser?._id === user._id ? "bg-[#00897B] text-white" : "hover:bg-gray-200"
                  }`}
                >
                  <div className="relative mr-3">
                    <img
                      className="h-10 w-10 rounded-full object-top"
                      src={user.profileImage || profileicon}
                      alt={user.name}
                    />
                    <span
                      className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full ${
                        isUserOnline ? "bg-green-500" : "bg-gray-400"
                      }`}
                    ></span>
                  </div>
                  <span>{user.name}</span>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <div className="p-4 bg-[#00897B] text-white text-lg font-semibold flex items-center rounded-lg">
            <img className="h-10 w-10 rounded-full mr-3" src={selectedUser.profileImage || profileicon} alt="user" />
            <span className="flex-1">Chat with {selectedUser.name}</span>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mr-2 p-2 rounded-lg hover:bg-[#00695C] transition-colors"
              title="Add Prescription"
              aria-label="Add prescription"
            >
              + Prescription
            </button>
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
          {selectedUser && messages.length === 0 ? (
            <p className="text-gray-500">No messages yet</p>
          ) : (
            messages.map((msg, index) => {
              const isDoctorMessage = msg.senderId === doctorInfo?.id;
              const isSelected = selectedMessage === msg._id;

              return (
                <div
                  key={msg._id || index}
                  className={`flex items-end mb-4 ${
                    isDoctorMessage ? "justify-end" : "justify-start"
                  } group relative message-container`}
                  onDoubleClick={() => handleMessageDoubleClick(msg._id, isDoctorMessage)}
                >
                  {!isDoctorMessage && (
                    <img
                      src={selectedUser?.profileImage || profileicon}
                      alt="User"
                      className="w-8 h-8 rounded-full mr-2"
                    />
                  )}
                  <div className="flex flex-col">
                    <div
                      className={`p-3 rounded-lg max-w-xs relative ${
                        isDoctorMessage ? "bg-[#00897B] text-white" : "bg-gray-300 text-black"
                      } ${isSelected ? "ring-2 ring-blue-500" : ""} ${
                        isDoctorMessage ? "cursor-pointer" : ""
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
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      )}
                      {isSelected && isDoctorMessage && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteMessage(msg._id);
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-lg transition-colors duration-200"
                          title="Delete message"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
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
              );
            })
          )}
          <div ref={bottomRef}></div>
        </div>

        {selectedUser && (
          <MessageInputBar
            userId={selectedUser._id}
            onNewMessage={handleNewMessageFromInput}
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
              ×
            </button>

            <h2 className="text-2xl font-semibold mb-4">Create Prescription for {selectedUser?.name}</h2>

            <form onSubmit={handleSubmit}>
              {prescriptions.map((item, index) => (
                <div key={index} className="mb-6">
                  <label className="block text-sm font-medium mb-1">Medicine Name</label>
                  <input
                    type="text"
                    value={item.medicineName}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleChange(index, "medicineName", e.target.value)
                    }
                    className="w-full border border-gray-300 px-3 py-2 rounded-md"
                    required
                  />
                  <label className="block text-sm font-medium mt-3 mb-1">Dosage</label>
                  <input
                    type="text"
                    value={item.dosage}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleChange(index, "dosage", e.target.value)
                    }
                    className="w-full border border-gray-300 px-3 py-2 rounded-md"
                    required
                  />
                  <label className="block text-sm font-medium mt-3 mb-1">Frequency</label>
                  <input
                    type="text"
                    value={item.frequency}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleChange(index, "frequency", e.target.value)
                    }
                    className="w-full border border-gray-300 px-3 py-2 rounded-md"
                    required
                  />
                  <label className="block text-sm font-medium mt-3 mb-1">Duration</label>
                  <input
                    type="text"
                    value={item.duration}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleChange(index, "duration", e.target.value)
                    }
                    className="w-full border border-gray-300 px-3 py-2 rounded-md"
                    required
                  />
                  <label className="block text-sm font-medium mt-3 mb-1">Instruction</label>
                  <input
                    type="text"
                    value={item.instruction}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleChange(index, "instruction", e.target.value)
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