import Cookies from "js-cookie";
import { ENDPOINT } from "./constants";

let showSessionExpiredModal = null;

export const setSessionExpiredHandler = (handler) => {
  showSessionExpiredModal = handler;
};

const handleSessionExpired = () => {
  Cookies.remove("user");
  Cookies.remove("accessToken");
  if (typeof showSessionExpiredModal === "function") {
    showSessionExpiredModal();
  } else {
    console.error("Session expired handler is not set");
  }
};

export const apiRequest = async (url, options = {}) => {
  const csrfToken = localStorage.getItem("csrfToken");

  const headers = {
    "Content-Type": "application/json",
    "X-XSRF-TOKEN": csrfToken,
    ...options.headers,
  };

  try {
    const response = await fetch(`${ENDPOINT}${url}`, {
      ...options,
      headers,
      credentials: "include",
    });

    if (response.status === 401) {
      handleSessionExpired();
      return;
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error);
    }

    return await response.json();
  } catch (error) {
    console.error("Ошибка API:", error);
    throw error;
  }
};