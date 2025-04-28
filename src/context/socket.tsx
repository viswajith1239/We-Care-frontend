import React,{createContext,ReactNode,useContext,useEffect,useState} from "react"

import { useSelector,useDispatch } from "react-redux"
import io from "socket.io-client"

import { AppDispatch,RootState } from "../app/store"
import { endCallDoctor, setRoomId, setShowVideoCall, setVideoCall } from "../slice/DoctorSlice";
import toast from "react-hot-toast";
import { endCallUser, setRoomIdUser, setShowIncomingVideoCall, setShowVideoCallUser, setVideoCallUser } from "../slice/UserSlice";
import { data } from "react-router-dom";
import { useNotification } from "./NotificationContext";

type SocketType = ReturnType<typeof io>;

interface SocketContextType {
  socket: SocketType | null;
  onlineUsers: string[]
}
const SocketContext = createContext<SocketContextType>({ socket: null,onlineUsers: [] });

export const useSocketContext = () => useContext(SocketContext);

export const SocketContextProvider = ({ children }: { children: ReactNode }): JSX.Element => {
      
        const [socket, setSocket] = useState<SocketType | null>(null);
        const [onlineUsers,setonlineUsers]=useState([])
        const { userInfo } = useSelector((state: RootState) => state.user);
        const { doctorInfo } = useSelector((state: RootState) => state.doctor);
        const dispatch = useDispatch<AppDispatch>();
        const loggedUser = userInfo?.id || doctorInfo?.id || null;
        const {addDoctorNotification, addUserNotification} = useNotification()
console.log('userInfo',userInfo)
console.log('doctorInfo',doctorInfo)
        
console.log('userInfos',loggedUser)

        useEffect(() => {
            console.log("Initializing socket connection...");
            if (!loggedUser) {
              console.warn("No loggedUser found, skipping socket initialization.");
              setSocket(null);
              return;
            }
        
            const newSocket = io("http://localhost:3000", {
              query: { userId: loggedUser },
              transports: ["websocket"],
              reconnectionAttempts: 5,
            });
        
            newSocket.on("connect", () => {
              console.log("Socket connected:", newSocket.id);
              setSocket(newSocket);
              
            });
            newSocket.on("getonline",(userSocketMap)=>{
              setonlineUsers(userSocketMap)
              console.log();
              
            })
        
           // Cleanup socket on unmount
            return () => {
              console.log("Disconnecting socket...");
              newSocket.disconnect();
              setSocket(null);
            };
          }, [loggedUser]);
        
          useEffect(() => {
            if (!socket) {
              console.warn("Socket instance is null; skipping event listener setup.");
              return;
            }
            socket.on("incoming-video-call", (data: any) => {
              console.log('DATA context',data)
              console.log("DATA received in context:", data);
    console.log("Current User Info:", userInfo);
    console.log("Current Doctor Info:", doctorInfo);

    // Explicitly log and compare IDs
    console.log("Comparing userInfo.id:", userInfo?.id, "with data._id:", data._id);
    console.log("Comparing doctorInfo.id:", doctorInfo?.id, "with data._id:", data._id);
              
              if (userInfo?.id===data._id) {
                console.log('DATA',data)
              dispatch(setShowIncomingVideoCall({
                _id: data._id,
                doctorId: data.from,
                callType: data.callType,
                doctorName: data.doctorName,
                doctorImage: data.doctorImage,
                roomId: data.roomId,
              }));
           
            }
            
            else if (doctorInfo && doctorInfo.id ==data._id) {
              // Doctor received their own call by mistake, ignore
              console.log("Doctor received a call but ignoring it.");
              
            }
            else{
              console.log("Unrelated socket event received; ignoring.");
            }
            });
        
            // Accepted Call
            socket.on("accepted-call", (data: any) => {
            
              console.log('accepted-call',data)
              dispatch(setRoomId(data.roomId));
              dispatch(setShowVideoCall(true));
        
              socket.emit("doctor-call-accept", {
                roomId: data.roomId,
                doctorId: data.from,
                to: data._id,
              });
            
            });
        
            
            socket.on("doctor-accept", (data: any) => {
              dispatch(setRoomId(data.roomId));
              dispatch(setShowVideoCall(true));
            });
        
            // Call Rejected
            socket.on("call-rejected", () => {
              toast.error("Call ended/rejected");
              dispatch(setVideoCall(null));
              dispatch(endCallDoctor());
              dispatch(endCallUser());
            });
        
            // User Left
            socket.on("user-left", (data: string | undefined) => {
              
              if (data === userInfo?.id) {
                dispatch(setShowVideoCallUser(false));
                dispatch(setRoomIdUser(null));
                dispatch(setVideoCallUser(null));
                dispatch(setShowIncomingVideoCall(null));
              } else if (data === doctorInfo?.id) {
                dispatch(setShowVideoCall(false));
                dispatch(setRoomId(null));
                dispatch(setVideoCall(null));
              }
            });
          
            socket.on('receiveNewBooking', (data: string) => {
              addDoctorNotification(data);
            });
            
            socket.on('receiveCancelNotificationForDoctor', (data: string) => {
              addDoctorNotification(data);
            });


            
        
            // Cleanup event listeners
            return () => {
              
              socket.off("incoming-video-call");
              socket.off("accepted-call");
              // socket.off("doctor-accept");
              socket.off("call-rejected");
              socket.off("user-left");
              socket.off('receiveCancelNotificationForDoctor')
              socket.off('receiveCancelNotificationForUser')
            
            };
        },[socket, dispatch,addUserNotification,addDoctorNotification])


        

        return <SocketContext.Provider value={{ socket,onlineUsers }}>{children}</SocketContext.Provider>;
         
}
