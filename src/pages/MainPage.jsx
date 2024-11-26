import NavBar from "../components/Common/NavBar";
import PanelNavigateButton from "../components/Common/PanelNavigateButton";

import "../styles/layout/main-page.css";

const MainPage = () => {
  return (
    <>
      <NavBar />
      <div className="main-page-wrapper">
        <div className="main-page-container">
          <div className="main-header">
            <div className="main-title">Главная страница</div>
          </div>
          <PanelNavigateButton title="Админ-панель" path="/admin" />
        </div>
      </div>
    </>
  );
};

export default MainPage;
