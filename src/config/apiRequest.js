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
  const accessToken = Cookies.get("accessToken");

  const headers = {
    ...options.headers,
  };

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  try {
    const response = await fetch(`${ENDPOINT}${url}`, {
      ...options,
      headers,
      credentials: "include",
    });

    if (response.status === 401) {
      handleSessionExpired();
    }

    let responseData = null;

    try {
      responseData = await response.json();
    } catch (parseError) {
      console.error("Failed to parse JSON:", parseError);
    }

    if (!response.ok) {
      const errorMessage = responseData?.message || response.statusText || "Unknown error";
      throw new Error(`Request failed: ${errorMessage}`);
    }

    return responseData;
  } catch (error) {
    console.error("API request error:", error);
    throw error;
  }
};