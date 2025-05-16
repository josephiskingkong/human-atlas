import React, { useEffect, useState } from "react";
import NavBar from "../components/Common/NavBar";
import "../styles/layout/profile-page.css";
import { apiRequest } from "../config/apiRequest";
import { useNotification } from "../context/NotificationContext";
import LoadingSpinner from "../components/Common/LoadingSpinner";
import Breadcrumbs from "../components/Common/Breadcrumbs";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, parseISO } from "date-fns";
import { ru } from "date-fns/locale";

import camera from "../assets/images/no-avatar.png";
import InputMask from "react-input-mask";

const ProfilePage = () => {
  const [user, setUser] = useState({
    id: "",
    username: "",
    firstName: "",
    lastName: "",
    photo: "",
    dateOfBirth: "",
    phoneNumber: "",
    email: "",
    isAdmin: false,
  });
  const [loading, setLoading] = useState(true);
  const { showNotification } = useNotification();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await apiRequest("/v1/users/me", {
          method: "GET",
        });
        setUser(data.user);
      } catch (error) {
        showNotification("Ошибка при загрузке данных пользователя", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [showNotification]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleDateChange = (date) => {
    setUser((prevUser) => ({
      ...prevUser,
      dateOfBirth: date ? format(date, "yyyy-MM-dd") : "",
    }));
  };

  const handleSave = async () => {
    try {
      await apiRequest("/v1/users/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      showNotification("Данные пользователя успешно сохранены", "success");
    } catch (error) {
      showNotification("Ошибка при сохранении данных пользователя", "error");
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <NavBar />
      <div className="page-wrapper">
        <div className="page-container">
          <Breadcrumbs />
          <div className="profile-page-wrapper">
            <div className="profile-page-container">
              <div className="profile-sidebard">
                <ul className="profile-menu-list">
                  <div className="profile-menu-item-list">Основное</div>
                </ul>
              </div>
              <div className="profile-main-bar">
                <h1 style={{ fontWeight: 700 }}>
                  Профиль пользователя {user.username}
                </h1>
                <div className="profile-form">
                  <div className="form-group">
                    <div className="user-info">
                      <div className="user-photo">
                        <img src={camera} alt="camera" />
                      </div>
                      <div className="user-names">
                        <label htmlFor="firstName">Имя</label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={user.firstName}
                          onChange={handleChange}
                        />
                        <label htmlFor="lastName">Фамилия</label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          value={user.lastName}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
              <label htmlFor="dateOfBirth">Дата рождения</label>
              <DatePicker
                selected={user.dateOfBirth ? parseISO(user.dateOfBirth) : null}
                onChange={handleDateChange}
                dateFormat="dd.MM.yyyy"
                placeholderText="ДД.ММ.ГГГГ"
                locale={ru}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label htmlFor="phoneNumber">Номер телефона</label>
              <InputMask
                mask="+7 (999) 999-99-99"
                id="phoneNumber"
                name="phoneNumber"
                value={user.phoneNumber}
                onChange={handleChange}
                placeholder="+7 (999) 999-99-99"
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Электронная почта</label>
              <input
                type="email"
                id="email"
                name="email"
                value={user.email}
                onChange={handleChange}
                placeholder="example@example.com"
              />
            </div>
                  <button className="save-button" onClick={handleSave}>
                    Сохранить
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
