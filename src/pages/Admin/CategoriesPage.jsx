import { useEffect, useState } from "react";
import { deleteCategoryById, getMainCategories } from "../../hooks/categories";
import AddCategoryModal from "../../components/Modals/AddCategoryModal";

import "../../styles/layout/admin-menu.css";
import SkeletonHorizontalLoader from "../../components/Common/SkeletonHorizontalLoader";
import AdminPageLayout from "./AdminPageLayout";
import PanelNavigateEditableButton from "../../components/Common/PanelEditableButton";
import { useNotification } from "../../context/NotificationContext";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(null);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { showNotification } = useNotification();

  useEffect(() => {
    console.log(categories);
  }, [categories]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getMainCategories();
        if (data.length > 0) {
          setCategories(data);
        } else {
          setNotFound("Ничего не нашлось :(");
        }
      } catch (err) {
        setError(err.message || "Unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleAddCategory = (newCategory) => {
    setCategories((prevCategories) => {
      const updatedCategories = [...prevCategories, newCategory];
      return updatedCategories.sort((a, b) => a.name.localeCompare(b.name));
    });

    setNotFound(null);
  };

  if (loading) {
    return (
      <AdminPageLayout title="Разделы">
        <SkeletonHorizontalLoader count={5} />
      </AdminPageLayout>
    );
  }

  if (error) {
    return (
      <AdminPageLayout title="Разделы">
        <div className="error">{error}</div>
      </AdminPageLayout>
    );
  }

  const handleDeleteCategory = async (id) => {
    try {
      console.log("Пытаюсь удалить категорию с ID:", id);
      const result = await deleteCategoryById(id);
      console.log("Результат удаления:", result);

      if (result) {
        console.log("Категории до удаления:", categories);
        setCategories((prevCategories) => {
          const updated = prevCategories.filter(
            (category) => Number(category.id) !== Number(id) // Явное приведение типов
          );
          console.log("Категории после удаления (внутри setState):", updated);
          return updated; // Убрали лишний spread
        });
      } else {
        showNotification("Не удалось удалить категорию!", "error");
      }
    } catch (error) {
      console.error("Ошибка при удалении:", error);
      showNotification(
        "Произошла ошибка во время удаления категории! Попробуйте позже.",
        "error"
      );
    }
  };

  return (
    <AdminPageLayout title="Разделы">
      <div className="admin-content">
        <button className="admin-add-button" onClick={() => setShowModal(true)}>
          + Добавить раздел
        </button>
        {notFound ? (
          <div className="error">{notFound}</div>
        ) : (
          <ul className="categories-list">
            {categories.map((category, index) => (
              <li key={category.id} className="category-item">
                <PanelNavigateEditableButton
                  title={category.name}
                  path={`${category.id}`}
                  onDelete={handleDeleteCategory}
                />
              </li>
            ))}
          </ul>
        )}
        {showModal && (
          <AddCategoryModal
            onClose={() => setShowModal(false)}
            onAddCategory={handleAddCategory}
          />
        )}
      </div>
    </AdminPageLayout>
  );
}
