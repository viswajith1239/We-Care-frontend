import React, { useState, useRef } from "react";
import { BsSend, BsImage, BsEmojiSmile } from "react-icons/bs";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import API_URL from "../../axios/API_URL";
import { useSocketContext } from "../../context/socket";
import EmojiPicker, { EmojiClickData, EmojiStyle, Theme } from "emoji-picker-react";

interface MessageInputBarProps {
  doctorId?: string;
  onNewMessage: (message: any) => void;
}

function MessageInputBar({ doctorId, onNewMessage }: MessageInputBarProps) {
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

  const userId = userInfo?.id;

  const handleSendMessage = async (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();
    if (!message && !imageUrl) return;

    const receiverId = doctorId ?? "defaultDoctorId";

    const newMessage = {
      senderId: userId,
      receiverId,
      message,
      mediaUrl: imageUrl,
      createdAt: new Date().toISOString(),
      read: false, // Add read field
    };

    try {
      const response = await axios.post(`${API_URL}/messages/send`, newMessage);
      const savedMessage = response.data.data;

      if (socket) {
        socket.emit("sendMessage", savedMessage);
      } else {
        console.error("Socket is not initialized");
      }

      onNewMessage(savedMessage);

      setMessage("");
      setImageUrl(null);
      setPreviewUrl(null);
      setShowEmojiPicker(false);
    } catch (error) {
      console.error("Error sending message", error);
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
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    const currentPosition = inputRef.current?.selectionStart || message.length;
    const newMessage = message.slice(0, currentPosition) + emojiData.emoji + message.slice(currentPosition);
    setMessage(newMessage);
    inputRef.current?.focus();
    inputRef.current?.setSelectionRange(currentPosition + emojiData.emoji.length, currentPosition + emojiData.emoji.length);
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

    if (showEmojiPicker) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showEmojiPicker]);

  return (
    <div className="w-full relative">
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
        <div ref={emojiPickerRef} className="absolute bottom-full mb-2 left-0 z-50">
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
              showPreview: true,
            }}
          />
        </div>
      )}

      <form onSubmit={handleSendMessage} className="relative w-full flex items-center">
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
          className="absolute left-2 text-gray-400 hover:text-white z-10"
        >
          <BsImage />
        </button>
        <button
          type="button"
          onClick={toggleEmojiPicker}
          className={`absolute left-8 z-10 ${showEmojiPicker ? "text-blue-400" : "text-gray-400 hover:text-white"
            }`}
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
          className="absolute right-3 text-white disabled:text-gray-500"
          disabled={uploading || (!message && !imageUrl)}
        >
          <BsSend />
        </button>
      </form>
    </div>
  );
}

export default MessageInputBar;