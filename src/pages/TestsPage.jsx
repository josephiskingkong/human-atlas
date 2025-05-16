import React, { useState, useEffect } from "react";
import "../styles/layout/tests-page.css";
import SearchBar from "../components/MainPage/SearchBar";
import Navbar from "../components/MainPage/Navbar";
import Footer from "../components/MainPage/Footer";
import CategoryFilter from "../components/MainPage/CategoryFilter";

const testData = [
  {
    id: 1,
    title: "Эпителиальная ткань",
    category: "normhistology",
    categoryName: "Нормальная гистология",
    duration: "30 минут",
    questions: 20,
  },
  {
    id: 2,
    title: "Соединительная ткань",
    category: "normhistology",
    categoryName: "Нормальная гистология",
    duration: "25 минут",
    questions: 15,
  },
  {
    id: 3,
    title: "Мышечная ткань",
    category: "normhistology",
    categoryName: "Нормальная гистология",
    duration: "40 минут",
    questions: 25,
  },
  {
    id: 4,
    title: "Нервная ткань",
    category: "normhistology",
    categoryName: "Нормальная гистология",
    duration: "35 минут",
    questions: 22,
  },
  {
    id: 5,
    title: "Воспаление",
    category: "pathanatomy",
    categoryName: "Патологическая анатомия",
    duration: "35 минут",
    questions: 30,
  },
  {
    id: 6,
    title: "Некроз и апоптоз",
    category: "pathanatomy",
    categoryName: "Патологическая анатомия",
    duration: "30 минут",
    questions: 20,
  },
  {
    id: 7,
    title: "Нарушения кровообращения",
    category: "pathanatomy",
    categoryName: "Патологическая анатомия",
    duration: "40 минут",
    questions: 25,
  },
  {
    id: 8,
    title: "Рак молочной железы",
    category: "oncology",
    categoryName: "Онкологические заболевания",
    duration: "45 минут",
    questions: 30,
  },
  {
    id: 9,
    title: "Колоректальный рак",
    category: "oncology",
    categoryName: "Онкологические заболевания",
    duration: "40 минут",
    questions: 25,
  },
  {
    id: 10,
    title: "Лимфома Ходжкина",
    category: "oncology",
    categoryName: "Онкологические заболевания",
    duration: "35 минут",
    questions: 20,
  },
];

const TestList = () => {
  const [tests, setTests] = useState(testData);
  const [filteredTests, setFilteredTests] = useState(testData);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentFilter, setCurrentFilter] = useState("all");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const uniqueCategories = [...new Set(tests.map((test) => test.category))];
    const categoriesData = uniqueCategories.map((category) => {
      const categoryObj = tests.find((test) => test.category === category);
      return {
        id: category,
        name: categoryObj.categoryName,
      };
    });
    setCategories(categoriesData);
  }, [tests]);

  const filterTests = () => {
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
  };

  useEffect(() => {
    filterTests();
  }, [searchQuery, currentFilter, tests]);

  const handleCategoryChange = (category) => {
    setCurrentFilter(category);
  };

  const [activeCardId, setActiveCardId] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIfMobile();

    window.addEventListener("resize", checkIfMobile);

    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

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

        {/* Список тестов */}
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
                    <i className="far fa-question-circle"></i> {test.questions}{" "}
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
