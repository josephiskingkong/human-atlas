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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const handleProfileClick = () => {
    navigate("/human-atlas/profile");
  };

  const handleLogout = () => {
    Cookies.remove("user");
    Cookies.remove("accessToken");
    setUser(null);
    setIsDropdownOpen(false);
    window.location.reload();
  };

  const handleLoginSuccess = (userData, accessToken) => {
    Cookies.set("user", JSON.stringify(userData), {
      secure: true,
      sameSite: "None",
      path: "/",
    });
    Cookies.set("accessToken", accessToken, {
      secure: true,
      sameSite: "None",
      path: "/",
    });
    setUser(userData);
    setShowLoginModal(false);
    window.location.reload();
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
    navigate("/human-atlas/");
  };

  // --- Новый код для мобильного меню ---
  const handleMobileMenuToggle = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  const handleMobileNavigate = (path) => {
    setMobileMenuOpen(false);
    navigate(path);
  };

  return (
    <div className="navbar-wrapper">
      <div className="navbar-container">
        <div className="navbar-logo" onClick={handleGoToMainPage}>
          Гистологический Атлас
        </div>
        <ul className="navbar-buttons">
          <div className="sections">
            <p onClick={() => navigate("/human-atlas/library")}>Атлас</p>
            <p onClick={() => navigate("/human-atlas/tests")}>Тестирование</p>
            <p onClick={() => navigate("/human-atlas/about")}>О проекте</p>
          </div>
          <button
            className="navbar-mobile-toggle"
            onClick={handleMobileMenuToggle}
            aria-label="Открыть меню"
          >
            ☰
          </button>
          {user ? (
            <div className="profile-info" ref={dropdownRef}>
              <span onClick={toggleDropdown} className="profile-name">
                {user.isAdmin ? <span className="admin-logo">A</span> : ""}
                {user.firstName}
              </span>
              {isDropdownOpen && (
                <div className="dropdown-menu">
                  <button
                    className="dropdown-item"
                    onClick={handleProfileClick}
                  >
                    <img src={profileIcon} alt="profile" /> Профиль
                  </button>
                  {user.isAdmin && (
                    <button
                      className="dropdown-item"
                      onClick={() => navigate("/human-atlas/admin")}
                    >
                      <span className="admin-logo">A</span> Админ-панель
                    </button>
                  )}
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

      {/* Мобильное меню */}
      {mobileMenuOpen && (
        <div className="navbar-mobile-menu">
          <div className="sections">
            <p onClick={() => handleMobileNavigate("/human-atlas/library")}>
              Атлас
            </p>
            <p onClick={() => handleMobileNavigate("/human-atlas/tests")}>
              Тестирование
            </p>
            <p onClick={() => handleMobileNavigate("/human-atlas/about")}>
              О проекте
            </p>
            {user ? (
              <>
                <p onClick={() => handleMobileNavigate("/human-atlas/profile")}>
                  Профиль
                </p>
                {user.isAdmin && (
                  <p onClick={() => handleMobileNavigate("/human-atlas/admin")}>
                    Админ-панель
                  </p>
                )}
                <p className="red-text" onClick={confirmLogout}>
                  Выйти
                </p>
              </>
            ) : (
              <p
                onClick={() => {
                  setShowLoginModal(true);
                  setMobileMenuOpen(false);
                }}
              >
                Войти
              </p>
            )}
          </div>
        </div>
      )}

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
