import Breadcrumbs from "../../components/Common/Breadcrumbs";
import NavBar from "../../components/Common/NavBar";
import PanelNavigateButton from "../../components/Common/PanelNavigateButton";

import "../../styles/layout/admin-menu.css";

import sections from '../../assets/images/sections.svg'
import user from '../../assets/images/user.svg'
import test from '../../assets/images/test.svg'

export default function AdminMenu() {
  return (
    <>
      <NavBar />
      <div className="admin-wrapper">
        <div className="admin-container">
          <div className="admin-header">
            <Breadcrumbs />
            <div className="menu-title">Управление сайтом</div>
          </div>
          <div className="admin-content">
            <PanelNavigateButton title="Слайды и разделы" icon={sections} path="/admin/categories/"/>
            <PanelNavigateButton title="Пользователи (в разработке)" icon={user} path="/admin/in-dev/"/>
            <PanelNavigateButton title="Тестирование (в разработке)" icon={test} path="/admin/in-dev/"/>
          </div>
        </div>
      </div>
    </>
  );
}
