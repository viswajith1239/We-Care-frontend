import React, { useState,useRef } from "react";
import { BsImage, BsSend } from "react-icons/bs";
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
   const [uploading, setUploading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string | null>(null); // Changed from mediaUrl to imageUrl
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
  const { userInfo } = useSelector((state: RootState) => state.user);
  const { doctorInfo } = useSelector((state: RootState) => state.doctor);
  const { socket } = useSocketContext();

  const doctorId = doctorInfo?.id; 

  console.log("Sender ID (doctorId):", doctorId);
  console.log("Receiver ID (userId):", userId);

  const handleSendMessage = async (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();
    if (!message && !imageUrl) return;
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
      mediaUrl: imageUrl, // We keep mediaUrl here because your controller expects it
      createdAt: new Date().toISOString(),
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
      setImageUrl(null);
      setPreviewUrl(null);
    } catch (error: any) {
      console.error("Error sending message:", error.response?.data || error.message);
    }
  };


   const handleFileInput = () => {
      fileInputRef.current?.click();
    };
  
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
  
      // Create a preview URL for the image
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
  
      // Start upload
      setUploading(true);
  
      try {
        // Create a FormData object to send the file
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "wecare"); 
  
        // Upload to Cloudinary
        const response = await axios.post(
          "https://api.cloudinary.com/v1_1/dxop0bbkp/image/upload", 
          formData
        );
  
        // Set the URL of the uploaded image
        const uploadedImageUrl = response.data.secure_url;
        console.log("Image uploaded successfully:", uploadedImageUrl);
        setImageUrl(uploadedImageUrl);
        setUploading(false);
      } catch (error) {
        console.error("Error uploading file:", error);
        setUploading(false);
        setPreviewUrl(null);
      }
    };
  
    const removeMedia = () => {
      setImageUrl(null);
      setPreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    };
  

  return (

    <div className="w-full">
    {previewUrl && (
      <div className="relative mb-2">
        <img src={previewUrl} alt="Upload preview" className="h-24 rounded-md" />
        <button
          type="button"
          onClick={removeMedia}
          className="absolute top-1 right-1 bg-gray-800 text-white rounded-full p-1 text-xs"
        >
          ✕
        </button>
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-md">
            <div className="text-white">Uploading...</div>
          </div>
        )}
      </div>
    )}
    <form onSubmit={handleSendMessage} className="relative w-full">
      <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={handleFileInput}
                className="absolute left-2 text-gray-400 hover:text-white"
              >
                <BsImage />
              </button>
      <input
        onChange={(e) => setMessage(e.target.value)}
        value={message}
        type="text"
        className="border text-sm rounded-lg block w-full p-2.5 pr-10 bg-gray-700 border-gray-600 text-white"
        placeholder="Send a message"
        disabled={uploading}
      />
      <button type="submit" className="absolute inset-y-0 right-0 flex items-center pr-3 text-white" disabled={uploading || (!message && !imageUrl)}>
        <BsSend />
      </button>
    </form>
    </div>
  );
}

export default MessageInputBar;
