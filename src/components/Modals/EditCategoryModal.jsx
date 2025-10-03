import React, { useState, useEffect } from "react";
import ModalLayout from "./ModalLayout";
import "../../styles/components/modal.css";
import { getCategoriesByParentId } from "../../hooks/categories";
import { useNotification } from "../../context/NotificationContext";

export default function EditCategoryModal({
  isOpen,
  id,
  categoryId,
  categoryName,
  onClose,
  onSave,
}) {
  const [categories, setCategories] = useState([]);
  const [stateCategoryName, setStateCategoryName] = useState(
    categoryName || ""
  );
  const [stateCategoryCategory, setStateCategoryCategory] = useState(
    categoryId ? Number(categoryId) : ""
  );

  const [isLoading, setIsLoading] = useState(false);
  const { showNotification } = useNotification();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategoriesByParentId();
        let filtered = (data || []).filter((cat) => cat.id !== id);

        const parentCat = data.find((cat) => cat.id === categoryId);
        if (parentCat && !filtered.find((cat) => cat.id === categoryId)) {
          filtered.unshift(parentCat);
        }

        setCategories(filtered);
      } catch (e) {
        showNotification("Ошибка при загрузке категорий!", "error");
      }
    };

    fetchCategories();
  }, [id, categoryId, showNotification]);

  useEffect(() => {
    if (isOpen) {
      setStateCategoryName(categoryName || "");
      setStateCategoryCategory(categoryId || "");
    }
  }, [isOpen, categoryName, categoryId]);

  if (!isOpen) return null;

  return (
    <ModalLayout
      title="Редактировать категорию"
      onClose={onClose}
      className="edit-category-modal"
    >
      <div className="form-group">
        <label htmlFor="categoryName">Название категории:</label>
        <input
          id="categoryName"
          type="text"
          value={stateCategoryName}
          onChange={(e) => setStateCategoryName(e.target.value)}
          placeholder="Введите название категории"
          disabled={isLoading}
          autoFocus
        />
      </div>

      <div className="form-group">
        <label htmlFor="categoryCategory">Родительская категория:</label>
        <select
          id="categoryCategory"
          value={Number(stateCategoryCategory)}
          onChange={(e) => setStateCategoryCategory(Number(e.target.value))}
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
          disabled={isLoading || !stateCategoryName.trim()}
          className="save-button"
          onClick={async () => {
            setIsLoading(true);
            await onSave(id, stateCategoryName, stateCategoryCategory);
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
