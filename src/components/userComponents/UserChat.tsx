import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import MessageInputBar from "./MessageInputBar";
import API_URL from "../../axios/API_URL";
import { useSocketContext } from "../../context/socket";

interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  message: string;
  imageUrl?: string; // Changed from mediaUrl to imageUrl to match backend model
  createdAt: string;
}

interface Doctor {
  _id: string;
  name: string;
  profileImage: string;
}

interface DoctorChatProps {
  doctorId: string;
}

const Chat: React.FC<DoctorChatProps> = () => {
  const { userInfo } = useSelector((state: RootState) => state.user);
  const { doctorInfo } = useSelector((state: RootState) => state.doctor);

  const [messages, setMessages] = useState<Message[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  let { socket, onlineUsers } = useSocketContext();
  console.log("Online users list:", onlineUsers);

  useEffect(() => {
    const fetchDoctors = async () => {
      if (!userInfo?.id) return;

      try {
        const response = await axios.get(`${API_URL}/user/fetchdoctors/${userInfo?.id}`, {
          withCredentials: true,
        });
        setDoctors(response.data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    fetchDoctors();
  }, [userInfo]);

  useEffect(() => {
    if (!selectedDoctor || !userInfo) return;

    const fetchMessages = async () => {
      try {
        const response = await axios.get(`${API_URL}/messages/${userInfo.id}/${selectedDoctor._id}`);
        // Ensure we're handling the messages correctly
        if (Array.isArray(response.data)) {
          // Log the first message to debug imageUrl presence
          if (response.data.length > 0) {
            console.log("First message from backend:", response.data[0]);
          }
          setMessages(response.data);
        } else {
          console.error("Expected array of messages but got:", response.data);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [selectedDoctor, userInfo]);

  useEffect(() => {
    if (!socket) return;

    socket.emit("join", doctorInfo?.id || userInfo?.id);

    const handleNewMessage = (newMessage: any) => {
      console.log("New message received:", newMessage);
      setMessages((prev) => [...prev, newMessage]);
    };

    socket.on("messageUpdate", handleNewMessage);

    return () => {
      socket.off("messageUpdate", handleNewMessage);
    };
  }, [socket, doctorInfo?.id, userInfo?.id]);

  const handleSelectDoctor = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
  };

  const handleNewMessage = (newMessage: Message) => {
    console.log("Handling new message:", newMessage);
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

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="w-1/3 bg-gray-100 p-4 border-r overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Your Doctors</h2>
        <div className="space-y-2">
          {doctors.length === 0 ? (
            <p className="text-gray-500">No doctors available</p>
          ) : (
            doctors.map((doctor) => {
              const isDoctorOnline = onlineUsers.includes(doctor._id);

              return (
                <div
                  key={doctor._id}
                  onClick={() => handleSelectDoctor(doctor)}
                  className={`flex items-center p-2 rounded-lg cursor-pointer ${
                    selectedDoctor?._id === doctor._id ? "bg-[#00897B] text-white" : "hover:bg-gray-200"
                  }`}
                >
                  <div className="relative mr-3">
                    <img
                      src={doctor.profileImage}
                      alt={doctor.name}
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <span className={`absolute bottom-0 right-0 w-3 h-3 ${isDoctorOnline ? "bg-green-500" : "bg-gray-400"} border-2 border-white rounded-full`}></span>
                  </div>
                  <span>{doctor.name}</span>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {selectedDoctor ? (
          <div className="p-4 bg-[#00897B] text-white text-lg font-semibold rounded-lg">
            Chat with Dr.{selectedDoctor.name}
          </div>
        ) : (
          <div className="p-4">
            <h2 className="text-1xl font-semibold text-black">
              Select a doctor to start chatting
            </h2>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4">
          
          {messages.length === 0 ? (
            <p className="text-gray-500">No messages yet</p>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`flex items-end mb-4 ${
                  msg.senderId === userInfo?.id ? "justify-end" : "justify-start"
                }`}
              >

                
                
                {msg.senderId !== userInfo?.id && (
                  <img
                    src={selectedDoctor?.profileImage}
                    alt="Sender"
                    className="w-8 h-8 rounded-full mr-2"
                  />
                )}
                <div className="flex flex-col">
                  <div
                    className={`p-3 rounded-lg max-w-xs ${
                      msg.senderId === userInfo?.id
                        ? "bg-[#00897B] text-white"
                        : "bg-gray-300 text-black"
                    }`}
                  >
                    {/* Show message text if it exists */}
                    {msg.message && <p className="mb-2">{msg.message}</p>}
                    
                    {/* Show image if imageUrl exists - changed from mediaUrl to imageUrl */}
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
        </div>
        {selectedDoctor && (
          <MessageInputBar doctorId={selectedDoctor._id} onNewMessage={handleNewMessage} />
        )}
      </div>
    </div>
  );
};

export default Chat;