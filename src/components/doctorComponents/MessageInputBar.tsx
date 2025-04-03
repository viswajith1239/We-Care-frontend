import React, { useState } from "react";
import { BsSend } from "react-icons/bs";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import API_URL from "../../axios/API_URL";
import { useSocketContext } from "../../context/socket"

interface MessageInputBarProps {
  userId?: string; 
  onNewMessage: (message: any) => void;
}

function MessageInputBar({ userId, onNewMessage }: MessageInputBarProps) {
  const [message, setMessage] = useState("");
  const { userInfo } = useSelector((state: RootState) => state.user);
  const { doctorInfo } = useSelector((state: RootState) => state.doctor);
  const { socket } = useSocketContext();

  const doctorId = doctorInfo?.id; 

  console.log("Sender ID (doctorId):", doctorId);
  console.log("Receiver ID (userId):", userId);

  const handleSendMessage = async (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();
    if (!message.trim()) {
      console.warn("Cannot send an empty message.");
      return;
    }

    if (!userId) {
      console.error("Error: receiverId (userId) is undefined!");
      return;
    }

    if (!doctorId) {
      console.error("Error: senderId (doctorId) is undefined!");
      return;
    }

    const newMessage = {
      senderId: doctorId,
      receiverId: userId,
      message,
    };

    console.log("Sending message:", newMessage);

    try {
      
      await axios.post(`${API_URL}/messages/send`, newMessage);
      if (socket) {
        socket.emit("sendMessage", newMessage);
      } else {
        console.error("Socket is not initialized");
      }

    // onNewMessage(newMessage);
     
      setMessage("");
    } catch (error: any) {
      console.error("Error sending message:", error.response?.data || error.message);
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
