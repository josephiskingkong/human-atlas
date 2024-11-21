import Breadcrumbs from "../../components/Common/Breadcrumbs";
import NavBar from "../../components/Common/NavBar";

import "../../styles/layout/admin-menu.css";

export default function CategoriesPage() {
  return (
    <>
      <NavBar />
      <div className="admin-wrapper">
        <div className="admin-container">
          <div className="admin-header">
            <Breadcrumbs />
            <div className="menu-title">Разделы</div>
          </div>
          <div className="admin-content">
          </div>
        </div>
      </div>
    </>
  );
}