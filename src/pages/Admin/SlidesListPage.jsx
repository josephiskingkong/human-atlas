import { useParams } from "react-router-dom";
import AdminPageLayout from "./AdminPageLayout";
import SlideItem from "../../components/Common/SlideItem";

import { useEffect, useState, useCallback } from "react";
import { getOrgansByCategoryId } from "../../hooks/organs/getOrgan";
import SkeletonSlidesLoader from "../../components/Common/SkeletonSlidesLoader";
import AddSlideModal from "../../components/Modals/AddSlideModal";
import AddCategoryModal from "../../components/Modals/AddCategoryModal";
import PanelNavigateEditableButton from "../../components/Common/PanelEditableButton";
import {
  deleteCategoryById,
  getCategoriesByParentId,
} from "../../hooks/categories";
import { useNotification } from "../../context/NotificationContext";

export default function SlidesPage() {
  const { categoryid, subcategoryid } = useParams();
  const [categories, setCategories] = useState([]);
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModalSlide, setShowModalSlide] = useState(false);
  const [showModalCategory, setShowModalCategory] = useState(false);
  const [notFoundSlides, setNotFoundSlides] = useState(null);
  const [notFoundCategories, setNotFoundCategorites] = useState(null);
  const { showNotification } = useNotification();

  const fetchSlides = useCallback(async () => {
    setLoading(true);
    setSlides([]);
    setNotFoundSlides(null);

    try {
      const data = await getOrgansByCategoryId(categoryid);
      if (data.length > 0) {
        setSlides(data);
      } else {
        setNotFoundSlides("Ничего не найдено :(");
      }
    } catch (err) {
      setError(err.message || "Unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }, [categoryid]);

  const fetchCategories = useCallback(async () => {
    setCategories([]);
    setNotFoundCategorites(null);

    try {
      const data = await getCategoriesByParentId(categoryid);
      if (data.length > 0) {
        setCategories(data);
      } else {
        setNotFoundCategorites("Нет подкатегорий.");
      }
    } catch (err) {
      setError(err.message || "Unexpected error occurred.");
    }
  }, [categoryid]);

  useEffect(() => {
    fetchSlides();
    fetchCategories();
  }, [fetchSlides, fetchCategories]);

  useEffect(() => {
    const hasProcessingSlides = slides.some(
      (slide) => slide.status === "PROCESSING"
    );

    if (hasProcessingSlides) {
      const interval = setInterval(() => {
        fetchSlides();
      }, 2500);

      return () => clearInterval(interval);
    }
  }, [slides, fetchSlides]);

  const handleAddSlide = (newSlide) => {
    setSlides((prevSlides) => [...prevSlides, newSlide]);
  };

  const handleDeleteSlide = (id) => {
    setSlides((prevSlides) => prevSlides.filter((slide) => slide.id !== id));
  };

  if (loading) {
    return (
      <AdminPageLayout title="Разделы">
        <div className="slides-grid">
          <SkeletonSlidesLoader count={6} />
        </div>
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

  const handleAddCategory = (newCategory) => {
    setCategories((prevCategories) => {
      const updatedCategories = [...prevCategories, newCategory];
      return updatedCategories.sort((a, b) => a.name.localeCompare(b.name));
    });
    setNotFoundSlides(null);
  };

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
    <AdminPageLayout title="Слайды">
      <div className="admin-content">
        <button
          className="admin-add-button"
          onClick={() => setShowModalCategory(true)}
        >
          + Добавить раздел
        </button>
        <button
          className="admin-add-button"
          onClick={() => setShowModalSlide(true)}
        >
          + Добавить слайд
        </button>
        {notFoundCategories ? (
          <></>
        ) : (
          <ul className="categories-list">
            {categories.map((category, index) => (
              <li key={category.id} className="category-item">
                <PanelNavigateEditableButton
                  title={category.name}
                  path={`/admin/categories/${category.id}`}
                  onDelete={handleDeleteCategory}
                />
              </li>
            ))}
          </ul>
        )}
        {notFoundSlides ? (
          <div className="error">{notFoundSlides}</div>
        ) : (
          <div className="slides-grid">
            {slides.map((slide) => (
              <SlideItem
                key={slide.id}
                id={slide.id}
                title={slide.name}
                status={slide.status}
                img={`https://tiles.humanatlas.top/${slide.id}/${slide.id}_files/9/0_0.webp`}
                path={`/admin/slide/${slide.id}`}
                onDelete={handleDeleteSlide}
              />
            ))}
          </div>
        )}
      </div>
      {showModalSlide && (
        <AddSlideModal
          onClose={() => setShowModalSlide(false)}
          onAddSlide={handleAddSlide}
          categoryId={categoryid}
        />
      )}
      {showModalCategory && (
        <AddCategoryModal
          onClose={() => setShowModalCategory(false)}
          onAddCategory={handleAddCategory}
          categoryId={categoryid}
        />
      )}
    </AdminPageLayout>
  );
}
