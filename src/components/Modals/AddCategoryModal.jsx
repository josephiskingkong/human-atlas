import React, { useState } from "react";
import ModalLayout from "./ModalLayout";
import "../../styles/components/modal.css";
import { addCategory } from "../../hooks/categories";
import { MoonLoader } from "react-spinners";
import { useNotification } from "../../context/NotificationContext";

export default function AddCategoryModal({
  onClose,
  onAddCategory,
  categoryId,
}) {
  const [loading, setLoading] = useState(false);
  const { showNotification } = useNotification();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const categoryName = e.target.elements.categoryName.value.trim();
    if (!categoryName) {
      showNotification("Введите название категории", "info");
      return;
    }

    setLoading(true);

    try {
      console.log("CATEGORY: ", categoryId);
      const newCategory = await addCategory(categoryName, categoryId);

      if (newCategory) {
        onAddCategory({ name: categoryName, id: newCategory.categoryid });
        onClose();
      } else {
        showNotification(
          "Категория не была добавлена. Проверьте данные.",
          "error"
        );
      }
    } catch (err) {
      showNotification("Ошибка при добавлении категории", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalLayout title="Добавить раздел" onClose={onClose}>
      <form onSubmit={handleSubmit} className="modal-form">
        <div className="form-group">
          <label htmlFor="categoryName">Название раздела</label>
          <input id="categoryName" type="text" placeholder="Введите название" />
        </div>
        <div className="form-group">
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? <MoonLoader size={14} color="#fff" /> : "Добавить"}
          </button>
        </div>
      </form>
    </ModalLayout>
  );
}
