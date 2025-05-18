import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTests } from "../../hooks/tests/getTests";
import AdminPageLayout from "./AdminPageLayout";
import "../../styles/layout/tests-list-page.css";

export default function TestsListPage() {
  const { categoryId } = useParams();
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    getTests()
      .then((data) => {
        if (!data || !Array.isArray(data)) {
          setNotFound("Тесты не найдены");
          setTests([]);
          return;
        }
        const filtered = data.filter(
          (test) => String(test.categoryId) === String(categoryId)
        );
        if (filtered.length > 0) {
          setTests(filtered);
          setNotFound(null);
        } else {
          setTests([]);
          setNotFound("Тесты не найдены");
        }
      })
      .catch((err) => {
        setError(err.message || "Ошибка при загрузке тестов");
      })
      .finally(() => setLoading(false));
  }, [categoryId]);

  return (
    <AdminPageLayout title="Тесты">
      <div className="admin-content">
        <button
          className="admin-add-button"
          onClick={() => navigate(`/human-atlas/admin/test/add`)}
        >
          + Добавить тест
        </button>
        {loading ? (
          <div className="tests-list-loader">Загрузка...</div>
        ) : notFound ? (
          <div className="tests-list-empty">{notFound}</div>
        ) : (
          <div className="tests-list">
            {tests.map((test) => (
              <div
                key={test.id}
                className="test-card"
                onClick={() => navigate(`/human-atlas/admin/test/${test.id}`)}
              >
                <div className="test-card-title">{test.title}</div>
                <div className="test-card-info">
                  <span>Вопросов: {test.questionCount ?? "?"}</span>
                  <span>Время: {test.duration ?? "?"} мин</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminPageLayout>
  );
}