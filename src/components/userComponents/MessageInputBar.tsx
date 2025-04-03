import React, { useState } from "react";
import { BsSend } from "react-icons/bs";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import API_URL from "../../axios/API_URL";
import {useSocketContext} from "../../context/socket"


interface MessageInputBarProps {
  doctorId?: string;
  onNewMessage: (message: any) => void;
}

function MessageInputBar({ doctorId, onNewMessage }: MessageInputBarProps) {
  const [message, setMessage] = useState("");
  const { userInfo } = useSelector((state: RootState) => state.user);
  const {doctorInfo}=useSelector((state:RootState)=>state.doctor)
  const { socket } = useSocketContext();
  console.log("pppp",doctorInfo);
  

  const userId = userInfo?.id;
 
  console.log("mmmmmmmmmmmmmmmmmmm",doctorId);
  
  

  const handleSendMessage = async (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();
    if (!message) return;

    const receiverId = doctorId ?? "defaultDoctorId";
console.log("receiver iddddddddddddd==========",receiverId)
    const newMessage = {
      senderId: userId,
      receiverId,
      message,
    };
    
  

    
    console.log("ppp",newMessage);
    

    try {
      console.log("trrrrr");
      

      await axios.post(`${API_URL}/messages/send`, newMessage);
      if (socket) {
        socket.emit("sendMessage", newMessage); 
      } else {
        console.error("Socket is not initialized");
      }
     

     
      // onNewMessage(newMessage);
      setMessage("");
    } catch (error) {
      console.error("Error sending message", error);
    }
  };

  return (
    <form onSubmit={handleSendMessage} className="relative w-full">
      <input
        onChange={(e) => setMessage(e.target.value)}
        value={message}
        type="text"
        className="border text-sm rounded-lg block w-full p-2.5 pr-10 bg-gray-700 border-gray-600 text-white"
        placeholder="Send a message"
      />
      <button type="submit" className="absolute inset-y-0 right-0 flex items-center pr-3 text-white">
        <BsSend />
      </button>
    </form>
  );
}

export default MessageInputBar;
