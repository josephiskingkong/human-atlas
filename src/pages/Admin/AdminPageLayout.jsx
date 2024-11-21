import Breadcrumbs from "../../components/Common/Breadcrumbs";
import NavBar from "../../components/Common/NavBar";
import "../../styles/layout/admin-menu.css";

export default function AdminPageLayout({ title, children }) {
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
  