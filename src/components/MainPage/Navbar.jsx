import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

import "../../styles/components/navbar-mainpage.scss";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 639);
      if (window.innerWidth > 639) {
        setIsMenuOpen(false);
      }
    };

    checkIfMobile();

    window.addEventListener("resize", checkIfMobile);

    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="navbar">
      <h2 onClick={() => navigate("/human-atlas/home")}>ГистоАтлас</h2>

      {isMobile ? (
        <div className="navbar__mobile">
          <button
            className="navbar__toggle-btn"
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Закрыть меню" : "Открыть меню"}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {isMenuOpen && (
            <div className="navbar__dropdown">
              <div className="sections sections--mobile">
                <p onClick={() => navigate("/human-atlas/library")}>Атлас</p>
                <p onClick={() => navigate("/human-atlas/tests")}>
                  Тестирование
                </p>
                <p onClick={() => navigate("/human-atlas/about")}>О проекте</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="sections">
          <p onClick={() => navigate("/human-atlas/library")}>Атлас</p>
          <p onClick={() => navigate("/human-atlas/tests")}>Тестирование</p>
          <p onClick={() => navigate("/human-atlas/about")}>О проекте</p>
        </div>
      )}
    </div>
  );
}
