import React, { useState, useRef } from "react";
import { BsImage, BsSend } from "react-icons/bs";
import { BsEmojiSmile } from "react-icons/bs";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import API_URL from "../../axios/API_URL";
import { useSocketContext } from "../../context/socket";


import EmojiPicker, { EmojiClickData, EmojiStyle, Theme } from 'emoji-picker-react';

interface MessageInputBarProps {
  userId?: string; 
  onNewMessage: (message: any) => void;
}

function MessageInputBar({ userId, onNewMessage }: MessageInputBarProps) {
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { userInfo } = useSelector((state: RootState) => state.user);
  const { doctorInfo } = useSelector((state: RootState) => state.doctor);
  const { socket } = useSocketContext();

  const doctorId = doctorInfo?.id; 

  console.log("Sender ID (doctorId):", doctorId);
  console.log("Receiver ID (userId):", userId);

  const handleSendMessage = async (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();
    
   
    if (!message.trim() && !imageUrl) {
      console.warn("Cannot send an empty message with no image.");
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
      message: message.trim(), 
      mediaUrl: imageUrl, 
      createdAt: new Date().toISOString(),
    };

    console.log("Sending message:", newMessage);

    try {
      const response = await axios.post(`${API_URL}/messages/send`, newMessage);
      console.log("Message sent successfully:", response.data);
      
      if (socket) {
        socket.emit("sendMessage", newMessage);
        console.log("Socket message emitted:", newMessage);
      } else {
        console.error("Socket is not initialized");
      }

      
      if (response.data && response.data.message) {
        onNewMessage(response.data.message);
      } else {
        onNewMessage(newMessage);
      }
     
      setMessage("");
      setImageUrl(null);
      setPreviewUrl(null);
      setShowEmojiPicker(false);
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

   
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);


    setUploading(true);

    try {
    
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "wecare"); 

      
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dxop0bbkp/image/upload", 
        formData
      );

     
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

  const handleEmojiClick = (emojiData: EmojiClickData, event: MouseEvent) => {
    const currentPosition = inputRef.current?.selectionStart || message.length;
    const newMessage = message.slice(0, currentPosition) + emojiData.emoji + message.slice(currentPosition);
    setMessage(newMessage);
    
   
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.setSelectionRange(currentPosition + emojiData.emoji.length, currentPosition + emojiData.emoji.length);
      }
    }, 0);
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

 
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEmojiPicker]);

  return (
    <div className="w-full p-4 border-t border-gray-700 relative">
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

   
      {showEmojiPicker && (
        <div 
          ref={emojiPickerRef}
          className="absolute bottom-full mb-2 left-4 z-50"
        >
          <EmojiPicker
            onEmojiClick={handleEmojiClick}
            autoFocusSearch={false}
            theme={Theme.DARK}
            emojiStyle={EmojiStyle.NATIVE}
            width={350}
            height={400}
            searchDisabled={false}
            skinTonesDisabled={false}
            previewConfig={{
              defaultEmoji: "1f60a",
              defaultCaption: "What's on your mind?",
              showPreview: true
            }}
          />
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
          className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white z-10"
          disabled={uploading}
        >
          <BsImage />
        </button>

        
        <button
          type="button"
          onClick={toggleEmojiPicker}
          className={`absolute left-8 top-1/2 transform -translate-y-1/2 z-10 ${
            showEmojiPicker ? 'text-blue-400' : 'text-gray-400 hover:text-white'
          }`}
          disabled={uploading}
        >
          <BsEmojiSmile />
        </button>


        <input
          ref={inputRef}
          onChange={(e) => setMessage(e.target.value)}
          value={message}
          type="text"
          className="border text-sm rounded-lg block w-full p-2.5 pl-16 pr-10 bg-gray-700 border-gray-600 text-white"
          placeholder="Send a message"
          disabled={uploading}
        />

   
        <button 
          type="submit" 
          className={`absolute inset-y-0 right-0 flex items-center pr-3 ${
            (message.trim() || imageUrl) && !uploading 
              ? "text-white" 
              : "text-gray-400 cursor-not-allowed"
          }`} 
          disabled={uploading || (!message.trim() && !imageUrl)}
        >
          <BsSend />
        </button>
      </form>
    </div>
  );
}

export default MessageInputBar;