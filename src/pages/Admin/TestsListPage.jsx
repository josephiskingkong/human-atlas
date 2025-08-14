import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getTests } from "../../hooks/tests/getTests";
import AdminPageLayout from "./AdminPageLayout";
import "../../styles/layout/tests-list-page.css";

export default function TestsListPage() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(null);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
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

        if (data.length > 0) {
          setTests(data);
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
  }, []);

  // Фильтрация тестов по поисковому запросу
  const filteredTests = useMemo(() => {
    if (!searchQuery.trim()) {
      return tests;
    }

    return tests.filter((test) =>
      test.title.toLowerCase().includes(searchQuery.toLowerCase().trim())
    );
  }, [tests, searchQuery]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  const renderContent = () => {
    if (loading) {
      return <div className="tests-list-loader">Загрузка...</div>;
    }

    if (error) {
      return <div className="tests-list-error">{error}</div>;
    }

    if (notFound && tests.length === 0) {
      return <div className="tests-list-empty">{notFound}</div>;
    }

    if (filteredTests.length === 0 && searchQuery.trim()) {
      return (
        <div className="tests-list-empty">
          По запросу "{searchQuery}" ничего не найдено
        </div>
      );
    }

    if (filteredTests.length === 0) {
      return <div className="tests-list-empty">Тесты не найдены</div>;
    }

    return (
      <div className="tests-list">
        {filteredTests.map((test) => (
          <div
            key={test.id}
            className="test-card"
            onClick={() => navigate(`/admin/test/${test.id}`)}
          >
            <div className="test-card-title">{test.title}</div>
            <div className="test-card-info">
              <span>Вопросов: {test.questionCount ?? "?"}</span>
              <span>Время: {test.duration ?? "?"} мин</span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <AdminPageLayout title="Тесты">
      <div className="admin-content">
        <div className="tests-header">
          {tests.length > 0 && (
            <div className="search-bar">
              <div className="search-input-container">
                <svg
                  className="search-icon"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M21 21L16.514 16.506M19 10.5C19 15.194 15.194 19 10.5 19S2 15.194 2 10.5 5.806 2 10.5 2 19 5.806 19 10.5Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <input
                  type="text"
                  className="search-input"
                  placeholder="Поиск тестов по названию..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                {searchQuery && (
                  <button
                    className="search-clear-button"
                    onClick={clearSearch}
                    type="button"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M18 6L6 18M6 6L18 18"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                )}
              </div>
              {searchQuery && (
                <div className="search-results-info">
                  Найдено: {filteredTests.length} из {tests.length}
                </div>
              )}
            </div>
          )}
          <button
            className="admin-add-button"
            onClick={() => navigate(`/admin/test/add`)}
          >
            + Добавить тест
          </button>
        </div>

        {renderContent()}
      </div>
    </AdminPageLayout>
  );
}
