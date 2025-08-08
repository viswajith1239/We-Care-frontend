import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import MessageInputBar from "./MessageInputBar";
import API_URL from "../../axios/API_URL";
import { useSocketContext } from "../../context/socket";
import { useSearchParams } from "react-router-dom";

interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  message: string;
  imageUrl?: string;
  createdAt: string;
  read: boolean;
}

interface Doctor {
  _id: string;
  name: string;
  profileImage: string;
}

interface DoctorChatProps {
  doctorId?: string;
}

const Chat: React.FC<DoctorChatProps> = ({ doctorId }) => {
  const { userInfo } = useSelector((state: RootState) => state.user);
  const { doctorInfo } = useSelector((state: RootState) => state.doctor);

  
  const [searchParams] = useSearchParams();

  const [messages, setMessages] = useState<Message[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);

  const processedMessages = useRef(new Set<string>());
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "instant" });
    }
  }, [messages, selectedDoctor]);

  let { socket, onlineUsers } = useSocketContext();

  useEffect(() => {
    const fetchDoctors = async () => {
      if (!userInfo?.id) return;

      try {
        const response = await axios.get(`${API_URL}/user/fetchdoctors/${userInfo?.id}`, {
          withCredentials: true,
        });
        setDoctors(response.data);
        const targetDoctorId = searchParams.get('doctorId') || doctorId;
        if (targetDoctorId) {
          const doctor = response.data.find((d: Doctor) => d._id === targetDoctorId);
          if (doctor) setSelectedDoctor(doctor);
        }
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    fetchDoctors();
  }, [userInfo, doctorId]);

  useEffect(() => {
    if (!selectedDoctor || !userInfo) return;

    const fetchMessages = async () => {
      try {
        const response = await axios.get(`${API_URL}/messages/${userInfo.id}/${selectedDoctor._id}`);
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
  }, [selectedDoctor, userInfo]);

  useEffect(() => {
    if (!socket) return;

    socket.emit("join", doctorInfo?.id || userInfo?.id);

    const handleSocketMessage = (newMessage: Message) => {
      const isRelevantConversation =
        selectedDoctor &&
        ((newMessage.senderId === selectedDoctor._id && newMessage.receiverId === userInfo?.id) ||
          (newMessage.senderId === userInfo?.id && newMessage.receiverId === selectedDoctor._id));

      if (!isRelevantConversation) return;

      if (newMessage._id && processedMessages.current.has(newMessage._id)) return;

      if (newMessage._id) processedMessages.current.add(newMessage._id);

      setMessages((prev) => [...prev, newMessage]);
    };

    const handleMessageRead = ({ messageId }: { messageId: string }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId ? { ...msg, read: true } : msg
        )
      );
    };

    const handleMessageDeleted = ({ messageId }: { messageId: string }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId
            ? { ...msg, message: "this message was deleted", imageUrl: "", read: msg.read }
            : msg
        )
      );
    };

    socket.on("messageUpdate", handleSocketMessage);
    socket.on("messageRead", handleMessageRead);
    socket.on("messageDeleted", handleMessageDeleted);

    return () => {
      socket.off("messageUpdate", handleSocketMessage);
      socket.off("messageRead", handleMessageRead);
      socket.off("messageDeleted", handleMessageDeleted);
    };
  }, [socket, doctorInfo?.id, userInfo?.id, selectedDoctor]);


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.message-container')) {
        setSelectedMessage(null);
      }
      if (dropdownOpen) setDropdownOpen(null);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen, selectedMessage]);

  const handleSelectDoctor = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setSelectedMessage(null);
  };

  const handleNewMessage = (newMessage: Message) => {
    if (newMessage._id && processedMessages.current.has(newMessage._id)) return;

    if (newMessage._id) processedMessages.current.add(newMessage._id);

    setMessages((prev) => [...prev, newMessage]);
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
              ? { ...msg, message: "this message was deleted", imageUrl: "", read: msg.read }
              : msg
          )
        );
        setSelectedMessage(null);


        if (socket && selectedDoctor) {
          socket.emit("messageDeleted", {
            messageId: messageId,
            senderId: userInfo?.id,
            receiverId: selectedDoctor._id,
          });
        }
      }
    } catch (error) {
      console.error("Failed to delete message:", error);
    }
  };

  const handleMessageDoubleClick = (messageId: string, isUserMessage: boolean) => {

    if (isUserMessage) {
      setSelectedMessage(selectedMessage === messageId ? null : messageId);
    }
  };

  const handleImageError = (doctorId: string) => {
    setImageErrors((prev) => ({ ...prev, [doctorId]: true }));
  };

  const getImageSource = (doctor: Doctor) => {
    if (imageErrors[doctor._id] || !doctor.profileImage || doctor.profileImage === "undefined") {
      return "https://via.placeholder.com/40";
    }
    return doctor.profileImage.startsWith("/") ? `${API_URL}${doctor.profileImage}` : doctor.profileImage;
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
              const imgSrc = getImageSource(doctor);

              return (
                <div
                  key={doctor._id}
                  onClick={() => handleSelectDoctor(doctor)}
                  className={`flex items-center p-2 rounded-lg cursor-pointer ${selectedDoctor?._id === doctor._id ? "bg-[#00897B] text-white" : "hover:bg-gray-200"
                    }`}
                >
                  <div className="relative mr-3">
                    <img
                      src={imgSrc}
                      alt={`Dr. ${doctor.name}`}
                      className="w-10 h-10 rounded-full object-cover"
                      onError={() => handleImageError(doctor._id)}
                    />
                    <span
                      className={`absolute bottom-0 right-0 w-3 h-3 ${isDoctorOnline ? "bg-green-500" : "bg-gray-400"
                        } border-2 border-white rounded-full`}
                    ></span>
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
          <div className="p-4 bg-[#00897B] text-white text-lg font-semibold flex items-center rounded-lg">
            <img
              className="h-10 w-10 rounded-full mr-3"
              src={selectedDoctor.profileImage}
              alt="Doctor"
            />
            <span className="flex-1">Chat with DR. {selectedDoctor.name}</span>
          </div>

        ) : (
          <div className="p-4">
            <h2 className="text-1xl font-semibold text-black">
              Select a doctor to start chatting
            </h2>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4">
          {selectedDoctor && messages.length === 0 ? (
            <p className="text-gray-500">No messages yet</p>
          ) : (
            messages.map((msg, index) => {
              const isUserMessage = msg.senderId === userInfo?.id;
              const imgSrc = selectedDoctor && !isUserMessage ? getImageSource(selectedDoctor) : "https://via.placeholder.com/32";
              const isSelected = selectedMessage === msg._id;

              return (
                <div
                  key={msg._id || index}
                  className={`flex items-end mb-4 ${isUserMessage ? "justify-end" : "justify-start"} group relative message-container`}
                >
                  {!isUserMessage && (
                    <img
                      src={imgSrc}
                      alt="Doctor"
                      className="w-8 h-8 rounded-full mr-2 object-cover"
                      onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/32")}
                    />
                  )}
                  <div className="flex flex-col relative">
                    <div
                      className={`p-3 rounded-lg max-w-xs relative ${isUserMessage ? "bg-[#00897B] text-white" : "bg-gray-300 text-black"
                        } ${isSelected ? "ring-2 ring-blue-500" : ""} ${isUserMessage ? "cursor-pointer" : ""
                        }`}
                      onDoubleClick={() => handleMessageDoubleClick(msg._id, isUserMessage)}
                    >
                      {msg.message && <p>{msg.message}</p>}
                      {msg.imageUrl && (
                        <img
                          src={msg.imageUrl}
                          alt="Message attachment"
                          className="rounded-lg max-w-full max-h-64 mt-1"
                          onError={(e) => (e.currentTarget.style.display = "none")}
                        />
                      )}

                      {/* Delete button - only show when message is selected and it's user's message */}
                      {isSelected && isUserMessage && (
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

                    <div className="flex items-center mt-1 self-end">
                      <p className="text-sm text-gray-400 mr-1">
                        {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      {isUserMessage && (
                        <span className="flex">
                          <svg
                            className={`w-4 h-4 ${msg.read ? "text-blue-500" : "text-gray-400"}`}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M5 12l5 5L20 7" />
                          </svg>
                          <svg
                            className={`w-4 h-4 ${msg.read ? "text-blue-500" : "text-gray-400"}`}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M5 12l5 5L20 7" />
                          </svg>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={bottomRef}></div>
        </div>
        {selectedDoctor && (
          <MessageInputBar doctorId={selectedDoctor._id} onNewMessage={handleNewMessage} />
        )}
      </div>
    </div>
  );
};

export default Chat;