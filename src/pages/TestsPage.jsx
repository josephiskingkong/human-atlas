import React, { useState, useEffect } from "react";
import "../styles/layout/tests-page.css";
import SearchBar from "../components/MainPage/SearchBar";
import Navbar from "../components/MainPage/Navbar";
import Footer from "../components/MainPage/Footer";
import CategoryFilter from "../components/MainPage/CategoryFilter";
import { getTests } from "../hooks/tests/getTests";

const TestList = () => {
  const [tests, setTests] = useState([]);
  const [filteredTests, setFilteredTests] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentFilter, setCurrentFilter] = useState("all");
  const [categories, setCategories] = useState([]);
  const [activeCardId, setActiveCardId] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    getTests()
      .then((data) => {
        setTests(data);
        setFilteredTests(data);
        const uniqueCategories = [...new Set(data.map((test) => test.category))];
        const categoriesData = uniqueCategories.map((category) => {
          const categoryObj = data.find((test) => test.category === category);
          return {
            id: category,
            name: categoryObj.categoryName,
          };
        });
        setCategories(categoriesData);
      })
      .catch(() => {
        setTests([]);
        setFilteredTests([]);
        setCategories([]);
      });
  }, []);

  useEffect(() => {
    let filtered = tests;

    if (currentFilter !== "all") {
      filtered = filtered.filter((test) => test.category === currentFilter);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (test) =>
          test.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          test.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredTests(filtered);
  }, [searchQuery, currentFilter, tests]);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIfMobile();

    window.addEventListener("resize", checkIfMobile);

    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const handleCategoryChange = (category) => {
    setCurrentFilter(category);
  };

  const handleCardClick = (testId) => {
    if (isMobile) {
      setActiveCardId(activeCardId === testId ? null : testId);
    }
  };

  const handleTestSelect = (test, e) => {
    if (e) {
      e.stopPropagation();
    }

    alert(`Вы выбрали тест: ${test.title}`);
    setActiveCardId(null);
  };

  return (
    <>
      <Navbar />

      <div className="test-list-container">
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        <CategoryFilter
          categories={categories}
          handleCategoryChange={handleCategoryChange}
          currentFilter={currentFilter}
        />

        <div className="test-list">
          {filteredTests.length === 0 ? (
            <div className="no-results">
              Тесты не найдены. Попробуйте изменить параметры поиска.
            </div>
          ) : (
            filteredTests.map((test) => (
              <div
                key={test.id}
                className={`test-card ${
                  activeCardId === test.id ? "active" : ""
                }`}
                onClick={() => handleCardClick(test.id)}
              >
                <div className="test-title">{test.title}</div>
                <div className="test-category">{test.categoryName}</div>
                <div className="test-info">
                  <span>
                    <i className="far fa-clock"></i> {test.duration}
                  </span>
                  <span>
                    <i className="far fa-question-circle"></i> {test.questionCount}{" "}
                    вопросов
                  </span>
                </div>

                <div
                  className={`test-action ${
                    activeCardId === test.id ? "visible" : ""
                  }`}
                >
                  <button
                    className="start-btn"
                    onClick={(e) => handleTestSelect(test, e)}
                  >
                    Начать тест
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default TestList;