import { useEffect, useState } from "react";
import NavBar from "../components/Common/NavBar";
import PanelNavigateButton from "../components/Common/PanelNavigateButton";
import Cookies from "js-cookie";

import "../styles/layout/main-page.css";

const MainPage = () => {
  const [user, setUser] = useState(null);

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

  return (
    <>
      <NavBar />
      <div className="main-page-wrapper">
        <div className="main-page-container">
          <div className="main-header">
            <div className="main-title">Главная страница</div>
          </div>
          {user?.isAdmin && (
            <PanelNavigateButton title="Админ-панель" path="/admin" />
          )}
        </div>
      </div>
    </>
  );
};

export default MainPage;
