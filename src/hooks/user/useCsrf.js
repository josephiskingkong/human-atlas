import { useState, useEffect } from "react";
import { apiRequest } from "../../config/apiRequest";

const useCsrfToken = () => {
  const [csrfToken, setCsrfToken] = useState(localStorage.getItem("csrfToken") || "");

  const fetchCsrfToken = async () => {
    try {
      const data = await apiRequest("/v1/csrf-token");

      setCsrfToken(data.csrfToken);
      localStorage.setItem("csrfToken", data.csrfToken);
    } catch (error) {
      console.error("Error fetching CSRF token:", error);
    }
  };

  useEffect(() => {
    fetchCsrfToken(); 

    const interval = setInterval(fetchCsrfToken, 55 * 60 * 1000);

    return () => clearInterval(interval); 
  }, []);

  return csrfToken;
};

export default useCsrfToken;