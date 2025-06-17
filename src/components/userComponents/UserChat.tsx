import React, { useEffect, useState, useRef } from "react";
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
  imageUrl?: string;
  createdAt: string;
  read: boolean; // Added
}

interface Doctor {
  _id: string;
  name: string;
  profileImage: string;
}

interface DoctorChatProps {
  doctorId?: string; // Made optional to match usage
}

const Chat: React.FC<DoctorChatProps> = ({ doctorId }) => {
  const { userInfo } = useSelector((state: RootState) => state.user);
  const { doctorInfo } = useSelector((state: RootState) => state.doctor);

  const [messages, setMessages] = useState<Message[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

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
        // Auto-select doctor if doctorId is provided
        if (doctorId) {
          const doctor = response.data.find((d: Doctor) => d._id === doctorId);
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

    socket.on("messageUpdate", handleSocketMessage);
    socket.on("messageRead", handleMessageRead);

    return () => {
      socket.off("messageUpdate", handleSocketMessage);
      socket.off("messageRead", handleMessageRead);
    };
  }, [socket, doctorInfo?.id, userInfo?.id, selectedDoctor]);

  const handleSelectDoctor = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
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
              ? { ...msg, message: "Your message was deleted", imageUrl: "", read: msg.read }
              : msg
          )
        );
        setDropdownOpen(null);
      }
    } catch (error) {
      console.error("Failed to delete message:", error);
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

  useEffect(() => {
    const handleClickOutside = () => {
      if (dropdownOpen) setDropdownOpen(null);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

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
                  className={`flex items-center p-2 rounded-lg cursor-pointer ${
                    selectedDoctor?._id === doctor._id ? "bg-[#00897B] text-white" : "hover:bg-gray-200"
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
                      className={`absolute bottom-0 right-0 w-3 h-3 ${
                        isDoctorOnline ? "bg-green-500" : "bg-gray-400"
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
          <div className="p-4 bg-[#00897B] text-white text-lg font-semibold rounded-lg">
            Chat with Dr. {selectedDoctor.name}
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

              return (
                <div
                  key={msg._id || index}
                  className={`flex items-end mb-4 ${isUserMessage ? "justify-end" : "justify-start"} group relative`}
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
                      className={`p-3 rounded-lg max-w-xs ${
                        isUserMessage ? "bg-[#00897B] text-white" : "bg-gray-300 text-black"
                      }`}
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

                    {isUserMessage && (
                      <div className="absolute -top-2 -right-2 group relative">
                        <button
                          className="text-gray-500 text-sm opacity-0 group-hover:opacity-100 transition"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDropdownOpen(dropdownOpen === msg._id ? null : msg._id);
                          }}
                        >
                          ⋮
                        </button>

                        {dropdownOpen === msg._id && (
                          <div
                            className="absolute right-0 mt-1 w-24 bg-white shadow-md rounded z-10"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              onClick={() => handleDeleteMessage(msg._id)}
                              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    )}
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