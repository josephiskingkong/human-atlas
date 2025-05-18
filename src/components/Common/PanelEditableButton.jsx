import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import dots from "../../assets/images/dots.svg";
import trash from "../../assets/images/trash.svg";
import edit from "../../assets/images/edit.svg";

export default function PanelNavigateEditableButton({ title, icon, path }) {
  const navigate = useNavigate();
  const [menuVisible, setMenuVisible] = useState(false);
  const menuRef = useRef(null);

  const handleClick = () => {
    navigate(path);
  };

  const toggleMenu = (e) => {
    e.stopPropagation();
    setMenuVisible((prev) => !prev);
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setMenuVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="panel-navigate-editable">
      <button className="panel-navigate-button" onClick={handleClick}>
        <div className="button-info">
          {icon && <img src={icon} alt={title} className="navigate-icon" />}
          <div className="navigate-title">{title}</div>
        </div>

        <button className="edit-navigate-item" onClick={toggleMenu}>
          <img src={dots} alt="dots" />

          {menuVisible && (
            <div className="dropdown-menu" ref={menuRef}>
              <button className="dropdown-item">
                <img src={edit} alt="edit" />
                Редактировать
              </button>
              <button className="dropdown-item" style={{ color: "#F02B2B" }}>
                <img src={trash} alt="trash" />
                Удалить
              </button>
            </div>
          )}
        </button>
      </button>
    </div>
  );
}
