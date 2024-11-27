import Cookies from "js-cookie";
import { ENDPOINT } from "./constants";
import { TooLargeError } from "./errors";

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
  const accessToken = Cookies.get("accessToken"); 

  const headers = {
    "X-XSRF-TOKEN": csrfToken,
    ...options.headers,
  };

  const credentials = {
    credentials: "include", 
  };

  if (accessToken) {
    headers["Cookie"] = `accessToken=${accessToken}`; 
  }

  try {
    const response = await fetch(`${ENDPOINT}${url}`, {
      ...options,
      ...credentials,
      headers,
    });

    if (response.status === 401) {
      handleSessionExpired();
      return;
    }

    if (response.status === 413) {
      throw new TooLargeError();
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error);
    }

    return await response.json();
  } catch (error) {
    console.error("Ошибка API:", error);
    if (!error.message?.includes("SyntaxError: Unexpected token")) {
      throw error;
    }
  }
};