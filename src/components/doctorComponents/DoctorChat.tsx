import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import MessageInputBar from "./MessageInputBar";
import API_URL from "../../axios/API_URL";
import { FaVideo } from "react-icons/fa";

interface Message {
  senderId: string;
  receiverId: string;
  message: string;
  createdAt: string;
}

interface User {
  _id :string;
  id: string;
  name: string;
  profileImage: string;
}
interface DoctorChatProps {
  doctorId: string;
}

const Chat: React.FC <DoctorChatProps>= () => {
  const { userInfo } = useSelector((state: RootState) => state.user);
  const { doctorInfo } = useSelector((state: RootState) => state.doctor);

  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selecteduser, setSelectedDoctor] = useState<User | null>(null);

  console.log(" Selected Doctor:", selecteduser);
  console.log(" Users List:", users);
  console.log("Checking doctorInfo:", doctorInfo?.id);


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
          id: item.userId.userId, 
          name: item.name, 
          profileImage: item.userId.profileImage || "", 
        }));
  
        setUsers(extractedUsers);
        console.log("Users Fetched:", extractedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
  
    fetchusers();
  }, [doctorInfo]);
  console.log("please check the users",users)

 
  useEffect(() => {
    if (!selecteduser || !userInfo) return;

    const fetchMessages = async () => {
      console.log("Fetching messages for:", selecteduser._id);

      try {
        console.log("????????????/")
        console.log("sender",doctorInfo.id)
        console.log("receiver",selecteduser._id)


        const response = await axios.get(`${API_URL}/messages/${doctorInfo.id}/${selecteduser._id}`);
        setMessages(response.data);
        console.log("Messages Fetched:", response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [selecteduser, userInfo]);

 
  const handleSelectDoctor = (doctor: User) => {
    console.log("Doctor Selected:", doctor.id);
    setSelectedDoctor(doctor);
  };

 
  const handleNewMessage = (newMessage: Message) => {
    setMessages((prev) => [...prev, newMessage]);
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
      <img   className=" h-10  mr-3" />
      <span>{user.name}</span> 
    </div>
  ))
)}
        </div>
      </div>

    
      <div className="flex-1 flex flex-col">
       
        {selecteduser ? (
          <div className="p-4 bg-[#00897B] text-white text-lg font-semibold flex items-center rounded-lg">
          <span className="flex-1">Chat with {selecteduser.name}</span>
          <button
            // onClick={handleVideoCall}
            className="p-2 rounded-lg hover:bg-[#00897B] transition-colors"
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
        className={`flex mb-2 ${
          msg.senderId === userInfo?.id ? "justify-start":"justify-end"
        }`}
      >
        {msg.senderId !== userInfo?.id && (
          <img
            src={selecteduser?.profileImage}
            
          />
        )}
        <div
          className={`p-3 rounded-lg max-w-xs ${
            msg.senderId === userInfo?.id
              ? "bg-[#00897B]  text-white"
              : "bg-gray-300 text-black"
          }`}
        >
          {msg.message}
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
