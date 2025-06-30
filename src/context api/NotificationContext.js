// import React, { createContext, useContext, useState } from "react";

// const NotificationContext = createContext();

// export const useNotification = () => useContext(NotificationContext);

// export const NotificationProvider = ({ children }) => {
//   const [notifications, setNotifications] = useState([]);

//   const addNotification = (message) => {
//     setNotifications((prev) => [
//       { id: Date.now(), message },
//       ...prev.slice(0, 2),
//     ]);
//   };

//   return (
//     <NotificationContext.Provider value={{ notifications, addNotification }}>
//       {children}
//     </NotificationContext.Provider>
//   );
// };
import React, { createContext, useContext, useState } from "react";
import axios from "axios";

const NotificationContext = createContext();
export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = async (message,source) => {
    try {
      const userId = localStorage.getItem("userid");

      if (!userId) {
        console.warn("No userId found in localStorage");
        return;
      }

      setNotifications((prev) => [
        { id: Date.now(), message,source },
        ...prev.slice(0, 2),
      ]);

      await axios.post("http://localhost:5000/notifications/addNotofication", {
        userId,
        message,
        source,
      });
    } catch (error) {
      console.error("Failed to save notification:", error);
    }
  };
  const fetchNotifications = async () => {
    try {
      const userId = localStorage.getItem("userid");
      if (!userId) return;

      const res = await axios.get(`http://localhost:5000/notifications/getNotificationByUserId/${userId}`);
      setNotifications(res.data);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  };
  return (
    <NotificationContext.Provider value={{ notifications, addNotification, fetchNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};
