import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import dots from "../../assets/images/dots.svg";
import trash from "../../assets/images/trash.svg";
import edit from "../../assets/images/edit.svg";
import ConfirmationModal from "../Modals/ConfirmationModal";
import EditCategoryModal from "../Modals/EditCategoryModal";

export default function PanelNavigateEditableButton({
  id,
  categoryId,
  title,
  icon,
  path,
  onEdit,
  onDelete,
}) {
  const navigate = useNavigate();
  const [menuVisible, setMenuVisible] = useState(false);
  const menuRef = useRef(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

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

  const handleOnDelete = () => {
    setShowConfirmModal(true);
  };

  const handleEdit = () => {
    setShowEditModal(true);
  };

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
              <button className="dropdown-item" onClick={handleEdit}>
                <img src={edit} alt="edit" />
                Редактировать
              </button>
              <button
                className="dropdown-item"
                style={{ color: "#F02B2B" }}
                onClick={handleOnDelete}
              >
                <img src={trash} alt="trash" />
                Удалить
              </button>
            </div>
          )}
        </button>
      </button>
      <EditCategoryModal
        id={id}
        categoryId={categoryId}
        categoryName={title}
        isOpen={showEditModal}
        onSave={onEdit}
        onClose={() => setShowEditModal(false)}
      />
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={() => {
          onDelete(id);
        }}
        title="Подтвердите удаление"
        actionName="Удалить"
        actionColor="red"
        message={`Вы точно уверены, что хотите удалить категорию и ВСЕ СЛАЙДЫ внутри неё?`}
      />
    </div>
  );
}
