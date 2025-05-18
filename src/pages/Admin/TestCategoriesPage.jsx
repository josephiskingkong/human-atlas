import { useEffect, useState } from "react";

import "../../styles/layout/admin-menu.css";
import SkeletonHorizontalLoader from "../../components/Common/SkeletonHorizontalLoader";
import AdminPageLayout from "./AdminPageLayout";
import PanelNavigateEditableButton from "../../components/Common/PanelEditableButton";
import { getTests } from "../../hooks/tests/getTests";

export default function TestCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getTests()
      .then((data) => {
        const uniqueCategories = [
          ...new Set(data.map((test) => test.categoryId)),
        ];

        const categoriesData = uniqueCategories.map((category) => {
          const categoryObj = data.find((test) => test.categoryId === category);
          return {
            id: category,
            name: categoryObj.categoryName,
          };
        });

        if (categoriesData.length > 0) {
          setCategories(categoriesData);
        } else {
          setNotFound("Категории не найдены");
        }
      })
      .catch((err) => {
        setError(err.message || "Произошла ошибка при загрузке категорий");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <AdminPageLayout title="Категории тестов">
        <SkeletonHorizontalLoader count={5} />
      </AdminPageLayout>
    );
  }

  if (error) {
    return (
      <AdminPageLayout title="Категории тестов">
        <div className="error">{error}</div>
      </AdminPageLayout>
    );
  }

  return (
    <AdminPageLayout title="Категории тестов">
      <div className="admin-content">
        {notFound ? (
          <div className="error">{notFound}</div>
        ) : (
          <ul className="categories-list">
            {categories.map((category) => (
              <li key={category.id} className="category-item">
                <PanelNavigateEditableButton
                  title={category.name}
                  path={`${category.id}`}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </AdminPageLayout>
  );
}
