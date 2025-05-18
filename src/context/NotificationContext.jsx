import React, { createContext, useContext, useState } from "react";
import "../styles/context/notification.css";
import infoIcon from "../assets/images/info.svg";
import errorIcon from "../assets/images/forbidden.svg";
import checkIcon from "../assets/images/check.svg";

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notification, setNotification] = useState({
    message: "",
    type: "info",
    visible: false,
  });

  const showNotification = (message, type = "info") => {
    setNotification({ message, type, visible: true });

    setTimeout(() => {
      setNotification((prev) => ({ ...prev, visible: false }));
    }, 3000);
  };

  const getIcon = () => {
    switch (notification.type) {
      case "error":
        return errorIcon;
      case "success":
        return checkIcon;
      case "info":
      default:
        return infoIcon;
    }
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <div
        className={`notification ${
          notification.visible ? "notification-visible" : "notification-hidden"
        } notification-${notification.type}`}
      >
        <img src={getIcon()} alt="icon" className="notification-icon" />
        <span>{notification.message}</span>
      </div>
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  return useContext(NotificationContext);
}