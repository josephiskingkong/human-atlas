import React, { useRef, useState } from "react";
import "../../styles/components/modal.css";
import { addCategory } from "../../hooks/categories";
import { MoonLoader } from "react-spinners";

export default function AddCategoryModal({ onClose, onAddCategory }) {
  const modalRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const handleOverlayClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const categoryName = e.target.elements.categoryName.value.trim();
    if (!categoryName) {
      alert("Введите название категории");
      return;
    }

    setLoading(true); 
    try {
      const newCategory = await addCategory(categoryName);

      if (newCategory) {
        newCategory.name = categoryName;
        newCategory.id = newCategory.categoryid;
        onAddCategory(newCategory);
        onClose();
      } else {
        alert("Категория не была добавлена. Проверьте данные и попробуйте снова.");
      }
    } catch (err) {
      console.error("Error adding category:", err);
      alert("Не удалось добавить категорию");
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-container" ref={modalRef}>
        <div className="modal-header">
          <h2>Добавить категорию</h2>
          <button className="close-button" onClick={onClose}>
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="categoryName">Название категории</label>
            <input
              id="categoryName"
              type="text"
              placeholder="Введите название"
            />
          </div>
          <div className="form-group">
            {loading ? (
                <button type="submit" className="submit-button">
                    <MoonLoader size={14} color="#fff" />
              </button>
            ) : (
              <button type="submit" className="submit-button">
                Добавить
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}