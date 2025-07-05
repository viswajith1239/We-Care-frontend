import React, { createContext, ReactNode, useState, useEffect, useCallback, useContext } from "react";

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
  countUnreadNotificationsUser: number;
  clearAllNotifications: () => void; // New method to clear all notifications on logout
  initializeForUser: (userId: string) => void; // Add this method to the interface
}

const NotificationContext = createContext<NotificationContextProps | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userNotifications, setUserNotifications] = useState<Notification[]>([]);
  const [doctorNotifications, setDoctorNotifications] = useState<Notification[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Function to get user-specific localStorage keys
  const getUserStorageKey = (userId: string, type: 'user' | 'doctor') => {
    return `${type}Notifications_${userId}`;
  };

  // Load notifications for specific user
  const loadUserNotifications = useCallback((userId: string) => {
    const userKey = getUserStorageKey(userId, 'user');
    const doctorKey = getUserStorageKey(userId, 'doctor');
    
    const storedUserNotifications = localStorage.getItem(userKey);
    const storedDoctorNotifications = localStorage.getItem(doctorKey);

    if (storedUserNotifications) {
      setUserNotifications(JSON.parse(storedUserNotifications));
    } else {
      setUserNotifications([]);
    }

    if (storedDoctorNotifications) {
      setDoctorNotifications(JSON.parse(storedDoctorNotifications));
    } else {
      setDoctorNotifications([]);
    }
  }, []);

  // Save notifications to localStorage with user-specific keys
  useEffect(() => {
    if (currentUserId) {
      const userKey = getUserStorageKey(currentUserId, 'user');
      localStorage.setItem(userKey, JSON.stringify(userNotifications));
    }
  }, [userNotifications, currentUserId]);

  useEffect(() => {
    if (currentUserId) {
      const doctorKey = getUserStorageKey(currentUserId, 'doctor');
      localStorage.setItem(doctorKey, JSON.stringify(doctorNotifications));
    }
  }, [doctorNotifications, currentUserId]);

  // Function to initialize notifications for a user
  const initializeForUser = useCallback((userId: string) => {
    if (userId !== currentUserId) {
      setCurrentUserId(userId);
      loadUserNotifications(userId);
    }
  }, [currentUserId, loadUserNotifications]);

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

  // New method to clear all notifications and reset state
  const clearAllNotifications = useCallback(() => {
    setUserNotifications([]);
    setDoctorNotifications([]);
    setCurrentUserId(null);
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
        clearAllNotifications,
        initializeForUser, 
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