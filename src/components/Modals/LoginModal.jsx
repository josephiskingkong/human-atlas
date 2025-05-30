import React, { useState } from "react";
import ReactDOM from "react-dom";
import "../../styles/components/modal.css";
import ModalLayout from "./ModalLayout";
import { userLogin, userRegister } from "../../hooks/user/auth";
import { useNotification } from "../../context/NotificationContext";

export default function LoginModal({ onClose, onLoginSuccess }) {
  const [isRegistering, setIsRegistering] = useState(false);

  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [registerName, setRegisterName] = useState("");
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  const [errors, setErrors] = useState({});

  const { showNotification } = useNotification();

  const usernameRegex = /^[a-z0-9_.]{1,64}$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

  const validateField = (field, value) => {
    const newErrors = { ...errors };

    switch (field) {
      case "loginUsername":
      case "registerUsername":
        if (!value.trim()) {
          newErrors[field] = "Имя пользователя обязательно";
        } else if (!usernameRegex.test(value)) {
          newErrors[field] =
            "Имя пользователя должно содержать только строчные буквы, цифры, точки или подчеркивания, максимум 64 символа";
        } else {
          delete newErrors[field];
        }
        break;
      case "loginPassword":
        if (!value.trim()) {
          newErrors[field] = "Пароль обязателен";
        } else {
          delete newErrors[field];
        }
        break;
      case "registerPassword":
        if (!value.trim()) {
          newErrors[field] = "Пароль обязателен";
        } else if (!passwordRegex.test(value)) {
          newErrors[field] =
            "Пароль должен содержать не менее 8 символов, включая буквы и цифры";
        } else {
          delete newErrors[field];
        }
        break;
      case "registerName":
        if (!value.trim()) {
          newErrors[field] = "Имя и фамилия обязательны";
        } else if (value.trim().split(" ").length !== 2) {
          newErrors[field] = "Укажите имя и фамилию через пробел";
        } else {
          delete newErrors[field];
        }
        break;
      default:
        break;
    }

    setErrors(newErrors);
  };

  const handleInputChange = (field, value) => {
    switch (field) {
      case "loginUsername":
        setLoginUsername(value);
        break;
      case "loginPassword":
        setLoginPassword(value);
        break;
      case "registerName":
        setRegisterName(value);
        break;
      case "registerUsername":
        setRegisterUsername(value);
        break;
      case "registerPassword":
        setRegisterPassword(value);
        break;
      default:
        break;
    }
    validateField(field, value);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (Object.keys(errors).length > 0) return;

    try {
      const response = await userLogin(loginUsername, loginPassword);
      if (!response || response.error) {
        if (response.error === "INVALID_CREDENTIALS") return showNotification("Неверный логин или пароль", "error");
        showNotification(
          response?.error_message || "Произошла ошибка при входе",
          "error"
        );
        return;
      }

      const { message, user, accessToken } = response;
      onLoginSuccess(user, accessToken);

      showNotification("Вы успешно вошли", "success");
      onClose();
    } catch (error) {
      
      showNotification("Произошла ошибка при входе. Попробуйте снова", "error");
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (Object.keys(errors).length > 0) return;

    try {
      const response = await userRegister(
        registerUsername,
        registerPassword,
        registerName
      );
      if (!response || response.error) {
        showNotification(
          response?.error_message || "Произошла ошибка при регистрации",
          "error"
        );
        return;
      }

      const { user, accessToken } = response;
      onLoginSuccess(user, accessToken);
      showNotification("Вы успешно зарегистрировались", "success");
      onClose();
    } catch (error) {
      showNotification(
        "Произошла ошибка при регистрации. Попробуйте снова",
        "error"
      );
    }
  };

  return ReactDOM.createPortal(
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <ModalLayout
        title={isRegistering ? "Регистрация" : "Вход"}
        onClose={onClose}
      >
        {isRegistering ? (
          <form className="registration-form" onSubmit={handleRegisterSubmit}>
            <div className={`form-group ${errors.registerName ? "error" : ""}`}>
              <label htmlFor="name">Имя и фамилия</label>
              <input
                id="name"
                type="text"
                placeholder="Введите имя и фамилию"
                value={registerName}
                onChange={(e) =>
                  handleInputChange("registerName", e.target.value)
                }
              />
              {errors.registerName && (
                <p className="error-text">{errors.registerName}</p>
              )}
            </div>
            <div
              className={`form-group ${errors.registerUsername ? "error" : ""}`}
            >
              <label htmlFor="username">Имя пользователя</label>
              <input
                id="username"
                type="text"
                placeholder="Введите имя пользователя"
                value={registerUsername}
                onChange={(e) =>
                  handleInputChange("registerUsername", e.target.value)
                }
              />
              {errors.registerUsername && (
                <p className="error-text">{errors.registerUsername}</p>
              )}
            </div>
            <div
              className={`form-group ${errors.registerPassword ? "error" : ""}`}
            >
              <label htmlFor="password">Пароль</label>
              <input
                id="password"
                type="password"
                placeholder="Введите пароль"
                value={registerPassword}
                onChange={(e) =>
                  handleInputChange("registerPassword", e.target.value)
                }
              />
              {errors.registerPassword && (
                <p className="error-text">{errors.registerPassword}</p>
              )}
            </div>
            <button type="submit" onClick={handleRegisterSubmit} className="submit-button">
              Зарегистрироваться
            </button>
            <p className="switch-form-text">
              Уже есть аккаунт?{" "}
              <button
                type="button"
                className="switch-form-button"
                onClick={() => setIsRegistering(false)}
              >
                Войти
              </button>
            </p>
          </form>
        ) : (
          <form className="login-form" onSubmit={handleLoginSubmit}>
            <div
              className={`form-group ${errors.loginUsername ? "error" : ""}`}
            >
              <label htmlFor="username">Имя пользователя</label>
              <input
                id="username"
                type="text"
                placeholder="Введите имя пользователя"
                value={loginUsername}
                onChange={(e) =>
                  handleInputChange("loginUsername", e.target.value)
                }
              />
              {errors.loginUsername && (
                <p className="error-text">{errors.loginUsername}</p>
              )}
            </div>
            <div
              className={`form-group ${errors.loginPassword ? "error" : ""}`}
            >
              <label htmlFor="password">Пароль</label>
              <input
                id="password"
                type="password"
                placeholder="Введите пароль"
                value={loginPassword}
                onChange={(e) =>
                  handleInputChange("loginPassword", e.target.value)
                }
              />
              {errors.loginPassword && (
                <p className="error-text">{errors.loginPassword}</p>
              )}
            </div>
            <button type="submit" className="submit-button">
              Войти
            </button>
            <p className="switch-form-text">
              Нету аккаунта?{" "}
              <button
                type="button"
                className="switch-form-button"
                onClick={() => setIsRegistering(true)}
              >
                Создать
              </button>
            </p>
          </form>
        )}
      </ModalLayout>
    </div>,
    document.getElementById("modal-root")
  );
}
