import React, { useState, useEffect } from "react";
import ModalLayout from "./ModalLayout";
import "../../styles/components/modal.css";
import { getCategoriesByParentId } from "../../hooks/categories";

export default function EditSlideModal({
  isOpen,
  id,
  categoryId,
  slideName,
  onClose,
  onSave,
}) {
  const [categories, setCategories] = useState([]);
  const [stateSlideName, setStateSlideName] = useState(slideName || "");
  const [stateSlideCategory, setStateSlideCategory] = useState(
    categoryId || ""
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategoriesByParentId();
        setCategories(data || []);
        if (!stateSlideCategory && data.length > 0) {
          setStateSlideCategory(data[0].id);
        }
      } catch (e) {
        console.error("Ошибка при загрузке категорий", e);
      }
    };

    fetchCategories();
  }, []);

  if (!isOpen) return null;

  return (
    <ModalLayout
      title="Редактировать слайд"
      onClose={onClose}
      className="edit-category-modal"
    >
      <div className="form-group">
        <label htmlFor="slideName">Название слайда:</label>
        <input
          id="slideName"
          type="text"
          value={stateSlideName}
          onChange={(e) => setStateSlideName(e.target.value)}
          placeholder="Введите название слайда"
          disabled={isLoading}
          autoFocus
        />
      </div>

      <div className="form-group">
        <label htmlFor="slideCategory">Категория:</label>
        <select
          id="slideCategory"
          value={stateSlideCategory}
          onChange={(e) => setStateSlideCategory(e.target.value)}
          disabled={isLoading}
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className="modal-actions">
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className="cancel-button"
        >
          Отмена
        </button>
        <button
          disabled={isLoading || !stateSlideName.trim()}
          className="save-button"
          onClick={async () => {
            setIsLoading(true);
            await onSave(id, stateSlideName, stateSlideCategory);
            setIsLoading(false);
            onClose();
          }}
        >
          {isLoading ? "Сохранение..." : "Сохранить"}
        </button>
      </div>
    </ModalLayout>
  );
}
