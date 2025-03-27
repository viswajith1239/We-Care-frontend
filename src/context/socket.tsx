import React,{createContext,ReactNode,useContext,useEffect,useState} from "react"

import { useSelector,useDispatch } from "react-redux"
import io from "socket.io-client"

import { AppDispatch,RootState } from "../app/store"

type SocketType = ReturnType<typeof io>;

interface SocketContextType {
  socket: SocketType | null;
}
const SocketContext = createContext<SocketContextType>({ socket: null });

export const useSocketContext = () => useContext(SocketContext);

export const SocketContextProvider = ({ children }: { children: ReactNode }): JSX.Element => {
      
        const [socket, setSocket] = useState<SocketType | null>(null);
        const { userInfo } = useSelector((state: RootState) => state.user);
        const { doctorInfo } = useSelector((state: RootState) => state.doctor);
        const dispatch = useDispatch<AppDispatch>();
        const loggedUser = userInfo?.id || doctorInfo?.id || null;


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
        })

        return <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>;
         
}
