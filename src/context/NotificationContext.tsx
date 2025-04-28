
import React,{createContext,ReactNode,useState,useEffect, useCallback, useContext} from "react";



interface Notification {
    id: string;
    message: string;
    read: boolean;
  }
  

interface NotificationContextProps {
    userNotifications: Notification[];
    doctorNotifications: Notification[];
    addUserNotification: (message: string) => void;
    addDoctorNotification: (message: string) => void;
    clearUserNotifications: () => void;
    clearDoctorNotifications: () => void;
    updateDoctorNotificationReadStatus: (notificationId: string) => void;
    updateUserNotificationReadStatus: (notificationId: string) => void;
    countUnreadNotificationsUser:number
  }

  const NotificationContext = createContext<NotificationContextProps | undefined>(undefined);

  export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [userNotifications, setUserNotifications] = useState<Notification[]>([])
    const [doctorNotifications, setDoctorNotifications] = useState<Notification[]>([]);
    useEffect(() => {
        const storedDoctorNotifications = localStorage.getItem("doctorNotifications");
        const storedUserNotifications = localStorage.getItem("userNotifications");
    
        if (storedDoctorNotifications) {
            setDoctorNotifications(JSON.parse(storedDoctorNotifications));
        }
        if (storedUserNotifications) {
          setUserNotifications(JSON.parse(storedUserNotifications));
        }
      }, []);
      useEffect(() => {
        localStorage.setItem("doctorNotifications", JSON.stringify(doctorNotifications));
      }, [doctorNotifications]);
      useEffect(() => {
        localStorage.setItem("userNotifications", JSON.stringify(userNotifications));
      }, [userNotifications]);
    
      const countUnreadNotifications = (notifications: Notification[]) => {
        return notifications.filter(notif => !notif.read).length;
      };    
      const addUserNotification = useCallback((message: string) => {
        setUserNotifications((prev) => {
          const isDuplicate = prev.some((notif) => notif.message === message);
          if (isDuplicate) return prev;
      
          const newNotification: Notification = {
            id: Date.now().toString(),
            message,
            read: false,
          };
          return [...prev, newNotification];
        });
      }, []);
      const addDoctorNotification = useCallback((message: string) => {
        setDoctorNotifications((prev) => {
          const isDuplicate = prev.some((notif) => notif.message === message);
          if (isDuplicate) return prev;
    
          const newNotification: Notification = {
            id: Date.now().toString(),
            message,
            read: false,
          };
          return [...prev, newNotification];
        });
      }, []);
      const updateDoctorNotificationReadStatus = (notificationId: string) => {
        setDoctorNotifications((prev) =>
          prev.map((notif) =>
            notif.id === notificationId ? { ...notif, read: !notif.read } : notif
          )
        );
      };
      
  const updateUserNotificationReadStatus = (notificationId: string) => {
    setUserNotifications((prev) =>
      prev.map((notif) =>
        notif.id === notificationId ? { ...notif, read: !notif.read } : notif
      )
    );
  };
  
  const clearUserNotifications = useCallback(() => {
    setUserNotifications([]);
  }, []);

  const clearDoctorNotifications = useCallback(() => {
    setDoctorNotifications([]);
  }, []);
  return (
    <NotificationContext.Provider
      value={{
        userNotifications,
        doctorNotifications,
        addUserNotification,
        addDoctorNotification,
        clearUserNotifications,
        clearDoctorNotifications,
        updateDoctorNotificationReadStatus,
        updateUserNotificationReadStatus,
        countUnreadNotificationsUser: countUnreadNotifications(userNotifications),
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

      

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
      throw new Error("useNotification must be used within a NotificationProvider");
    }
    return context;
  };
  