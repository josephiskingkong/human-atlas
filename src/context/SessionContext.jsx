import React, { createContext, useState, useContext } from "react";
import Cookies from "js-cookie";

const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
  const [isSessionExpired, setIsSessionExpired] = useState(false);

  const handleSessionExpired = () => {
    Cookies.remove("user");
    Cookies.remove("accessToken");
    setIsSessionExpired(true);
  };

  const closeSessionModal = () => {
    setIsSessionExpired(false);
    window.location.reload();
  };

  return (
    <SessionContext.Provider value={{ handleSessionExpired }}>
      {isSessionExpired && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2>Сессия истекла</h2>
            </div>
            <div className="modal-content">
              <div className="modal-form">
                <div className="form-group">
                  <p>Ваша сессия истекла. Пожалуйста, войдите снова.</p>
                  <button className="submit-button" onClick={closeSessionModal}>
                    ОК
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => useContext(SessionContext);
