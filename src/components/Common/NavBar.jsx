import { useState, useEffect, useRef } from "react";
import "../../styles/components/navbar.css";
import "../../styles/layout/admin-menu.css";
import LoginModal from "../Modals/LoginModal";
import ConfirmationModal from "../Modals/ConfirmationModal";
import Cookies from "js-cookie";

import exitIcon from "../../assets/images/exit.svg";
import profileIcon from "../../assets/images/profile.svg";
import { useNavigate } from "react-router-dom";

export default function NavBar() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userCookie = Cookies.get("user");
    if (userCookie) {
      try {
        const parsedUser = JSON.parse(userCookie);
        setUser(parsedUser);
      } catch (error) {
        console.error("Ошибка парсинга куки с пользователем:", error);
      }
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleLoginClick = () => {
    setShowLoginModal(true);
  };

  const handleCloseModal = () => {
    setShowLoginModal(false);
  };

  const handleLogout = () => {
    Cookies.remove("user");
    Cookies.remove("accessToken");
    setUser(null);
    setIsDropdownOpen(false);
  };

  const handleLoginSuccess = (userData, accessToken) => {
    Cookies.set("user", JSON.stringify(userData), { secure: true });
    Cookies.set("accessToken", accessToken, { secure: true });
    setUser(userData);
    setShowLoginModal(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const confirmLogout = () => {
    setShowConfirmationModal(true);
  };

  const closeConfirmationModal = () => {
    setShowConfirmationModal(false);
  };

  const handleConfirmLogout = () => {
    handleLogout();
    setShowConfirmationModal(false);
  };

  const handleGoToMainPage = () => {
    navigate("/")
  }

  return (
    <div className="navbar-wrapper">
      <div className="navbar-container">
        <div className="navbar-logo" onClick={handleGoToMainPage}>Гисто Атлас</div>
        <ul className="navbar-buttons">
          {user ? (
            <div className="profile-info" ref={dropdownRef}>
              <span onClick={toggleDropdown} className="profile-name">
                {user.firstName}
              </span>
              {isDropdownOpen && (
                <div className="dropdown-menu">
                  <button className="dropdown-item">
                    <img src={profileIcon} alt="profile" /> Профиль
                  </button>
                  <button
                    className="dropdown-item red-text"
                    onClick={confirmLogout}
                  >
                    <img src={exitIcon} alt="exit" /> Выйти
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="profile-button">
              <button className="login-button" onClick={handleLoginClick}>
                Войти
              </button>
            </div>
          )}
        </ul>
      </div>

      {showLoginModal && (
        <LoginModal
          onClose={handleCloseModal}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      <ConfirmationModal
        isOpen={showConfirmationModal}
        onClose={closeConfirmationModal}
        onConfirm={handleConfirmLogout}
        title="Подтвердите выход"
        message="Вы уверены, что хотите выйти из аккаунта?"
        actionName="Выйти"
        actionColor="red"
      />
    </div>
  );
}