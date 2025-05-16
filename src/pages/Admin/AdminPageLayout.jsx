import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "../../components/Common/Breadcrumbs";
import NavBar from "../../components/Common/NavBar";
import Cookies from "js-cookie";
import "../../styles/layout/admin-menu.css";

export default function AdminPageLayout({ title, children }) {
  const navigate = useNavigate();

  useEffect(() => {
    const userCookie = Cookies.get("user");
    if (userCookie) {
      try {
        const user = JSON.parse(userCookie);
        if (!user.isAdmin) {
          navigate("/human-atlas/admin/home");
        }
      } catch (error) {
        console.error("Ошибка парсинга куки с пользователем:", error);
        navigate("/human-atlas/admin/home");
      }
    } else {
      navigate("/human-atlas/admin/home");
    }
  }, [navigate]);

  return (
    <>
      <NavBar />
      <div className="admin-wrapper">
        <div className="admin-container">
          <div className="admin-header">
            <Breadcrumbs />
            <div className="menu-title">{title}</div>
          </div>
          {children}
        </div>
      </div>
    </>
  );
}
