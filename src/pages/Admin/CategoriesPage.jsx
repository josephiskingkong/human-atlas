import { useEffect, useState } from "react";
import Breadcrumbs from "../../components/Common/Breadcrumbs";
import NavBar from "../../components/Common/NavBar";
import { getMainCategories } from "../../hooks/categories";
import AddCategoryModal from "../../components/Common/AddCategoryModal";

import "../../styles/layout/admin-menu.css";
import SkeletonHorizontalLoader from "../../components/Common/SkeletonHorizontalLoader";
import AdminPageLayout from "./AdminPageLayout";
import PanelNavigateButton from "../../components/Common/PanelNavigateButton";
import { useLocation } from "react-router-dom";

export default function CategoriesPage() {
  const location = useLocation();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(null);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

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

  return (
    <AdminPageLayout title="Разделы">
      <div className="admin-content">
        <button className="admin-add-button" onClick={() => setShowModal(true)}>
          + Добавить категорию
        </button>
        {notFound ? (
          <div className="error">{notFound}</div>
        ) : (
          <ul className="categories-list">
            {categories.map((category, index) => (
              <li key={category.id} className="category-item">
              <PanelNavigateButton
                title={category.name}
                path={`${category.id}`}
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
