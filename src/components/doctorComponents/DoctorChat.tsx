import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import MessageInputBar from "./MessageInputBar";
import API_URL from "../../axios/API_URL";
import { FaVideo } from "react-icons/fa";
import { useSocketContext } from '../../context/socket';
import { setVideoCall } from '../../slice/DoctorSlice';
import { useDispatch } from 'react-redux';
import { Doctor } from "../../types/doctor";
import userimg from "../../assets/user.png"
import doctorAxiosInstance from "../../axios/doctorAxiosInstance";

interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  message: string;
  imageUrl?: string; 
  createdAt: string;
}

interface User {
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

const Chat: React.FC<DoctorChatProps> = ({ userId }) => {
  const { userInfo } = useSelector((state: RootState) => state.user);
  const { doctorInfo } = useSelector((state: RootState) => state.doctor);
  const [bookingId, setBookingId] = useState<string | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selecteduser, setSelectedUser] = useState<User | null>(null);
  const [doctorData, setDoctorData] = useState<Doctor | null>(null);
  let { socket } = useSocketContext();
  const dispatch = useDispatch<AppDispatch>();

  console.log(" Selected Doctor:", selecteduser);
  console.log(" Users List:", users);
  console.log("Checking doctorInfo:", doctorInfo?.id);
  const doctorId = doctorInfo?.id;

  useEffect(() => {
    const fetchusers = async () => {
      if (!doctorInfo?.id) return;
  
      try {
        const response = await axios.get(`${API_URL}/doctor/fetchusers/${doctorInfo?.id}`, {
          withCredentials: true,
        });
  
        console.log("response------------", response.data);
  
        const extractedUsers = response.data.map((item: any) => ({
          _id: item._id, 
          id: item.userId, 
          name: item.name, 
          // profileImage: item.profileImage || "", 
          appoinmentId: item.appoinmentId
        }));
  
        setUsers(extractedUsers);
        console.log("Users Fetched:", extractedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
  
    fetchusers();
  }, [doctorInfo]);
  console.log("please check the users", users);

  useEffect(() => {
    if (!doctorId) return;

    const fetchUsers = async () => {
      try {
        const response = await doctorAxiosInstance.get(`${API_URL}/doctor/bookingdetails/${doctorId}`);
        
        const seenUserId = new Set();
        const uniqueUsers = response.data.data.filter((booking: any) => {
          if (!booking.userId || !booking.userId._id) return false; // Ensure userId exists
          if (seenUserId.has(booking.userId._id)) return false;
          seenUserId.add(booking.userId._id);
          return true;
        });

        // setUsers(uniqueUsers.map((booking: any) => ({
        //   // bookingId: booking._id,
        // })));
      } catch (error: any) {
        console.error("Error fetching doctor:", error.response?.data || error.message);
      }
    };

    fetchUsers();
  }, [doctorId]);

  useEffect(() => {
    if (!selecteduser || !userInfo) return;

    const fetchMessages = async () => {
      console.log("Fetching messages for:", selecteduser._id);

      try {
        console.log("????????????/")
        console.log("sender", doctorInfo.id)
        console.log("receiver", selecteduser._id)


        
        const response = await axios.get(`${API_URL}/messages/${doctorInfo.id}/${selecteduser._id}`);
        if (response.data.length > 0) {
          console.log("First message from backend:", response.data[0]);
        }
        setMessages(response.data);
        console.log("Messages Fetched:", response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [selecteduser, userInfo]);

  useEffect(() => {
    const fetchDoctor = async () => {
      console.log("nnnnnn");
      
      const response = await axios.get(`${API_URL}/doctor/${doctorInfo.id}`);
      console.log("pppp", response)
      setDoctorData(response.data.DoctorData[0]);
    };
    fetchDoctor();
  }, [doctorInfo.id, userId]);

  useEffect(() => {
    if (!socket) return;

    socket.emit("join", doctorInfo?.id || userInfo?.id);

    const handleNewMessage = (newMessage: any) => {
      setMessages((prev) => [...prev, newMessage]);
    };

    socket.on("messageUpdate", handleNewMessage);

    return () => {
      socket.off("messageUpdate", handleNewMessage);
    };
  }, [socket, doctorInfo?.id, userInfo?.id]);
 
  const handleSelectDoctor = (doctor: User) => {
    console.log("user Selected:", doctor.id);
    setSelectedUser(doctor);
  };

  const handleNewMessage = (newMessage: Message) => {
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
    console.log("videocallllllllll");
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

  return (
    <div className="flex h-full">
      <div className="w-1/3 bg-gray-100 p-4 border-r">
        <h2 className="text-lg font-semibold mb-4">Your Patients</h2>
        <div className="space-y-2">
          {users.length === 0 ? (
            <p className="text-gray-500">No users available</p>
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
          {messages.length === 0 ? (
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
                    {/* Show message text if it exists */}
                    {msg.message && <p className="mb-2">{msg.message}</p>}
                    
                    {/* Show image if mediaUrl exists */}
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
        
        {selecteduser && <MessageInputBar userId={selecteduser._id} onNewMessage={handleNewMessage} />}
      </div>
    </div>
  );
};

export default Chat;