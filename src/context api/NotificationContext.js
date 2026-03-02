
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const NotificationContext = createContext();
export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [hasUnseenNotifications, setHasUnseenNotifications] = useState(false);

  useEffect(() => {
    const anyUnseen = notifications.some((n) => !n.seen);
    setHasUnseenNotifications(anyUnseen);
  }, [notifications]);

  const fetchNotifications = async () => {
    const userId = localStorage.getItem("userid");
    if (!userId) return;
    try {
      const res = await axios.get(
        `http://localhost:5000/notifications/getNotificationByUserId/${userId}`
      );
      setNotifications(res.data || []);
      console.log(res.data)
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  };

  const addNotification = async (message, source) => {
    const userId = localStorage.getItem("userid");
    if (!userId) return;
    try {
      const newNotification = {
        id: Date.now(),
        message,
        source,
        seen: false,
      };

      setNotifications((prev) => [newNotification, ...prev.slice(0, 9)]);

      await axios.post("http://localhost:5000/notifications/addNotofication", {
        userId,
        message,
        source,
      });
    } catch (error) {
      console.error("Failed to save notification:", error);
    }
  };

  const markAllAsSeen = async () => {
    const userId = localStorage.getItem("userid");
    if (!userId) return;
    try {
      const updated = notifications.map((n) => ({ ...n, seen: true }));
      setNotifications(updated);
      setHasUnseenNotifications(false);

      await axios.put(`http://localhost:5000/notifications/markAllSeen/${userId}`);
    } catch (err) {
      console.error("Failed to mark notifications as seen:", err);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        hasUnseenNotifications,
        addNotification,
        fetchNotifications,
        markAllAsSeen,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
