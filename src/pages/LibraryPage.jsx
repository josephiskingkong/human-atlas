import React, { useState, useEffect } from "react";
import Footer from "../components/MainPage/Footer";
import Navbar from "../components/Common/NavBar";
import SearchBar from "../components/MainPage/SearchBar";
import { search as fuseSearch } from "../service/fuse/search";

import "../styles/layout/library-page.css";
import { getOrgansDone } from "../hooks/organs/getOrgan";
import CategoryFilter from "../components/MainPage/CategoryFilter";
import { getMainCategories } from "../hooks/categories";
import { useNavigate } from "react-router-dom";

const HistologySlideLibrary = () => {
  const [slides, setSlides] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentFilter, setCurrentFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSlides, setFilteredSlides] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchSlides = async () => {
      const mockSlides = await getOrgansDone();
      const mockCategories = await getMainCategories();

      setSlides(mockSlides);
      setCategories(mockCategories);
      setFilteredSlides(mockSlides);
      setIsLoading(false);
    };

    fetchSlides();
  }, []);

  useEffect(() => {
    if (!slides || slides.length === 0) {
      setFilteredSlides([]);
      return;
    }

    let filtered = [...slides];

    if (currentFilter !== "all") {
      filtered = filtered.filter((slide) => slide.categoryid === currentFilter);
    }

    if (searchQuery.trim() === "") {
      setFilteredSlides(filtered);
      return;
    }

    const fuseResults = fuseSearch(filtered, searchQuery);
    setFilteredSlides(fuseResults);
  }, [searchQuery, slides, currentFilter]);

  const handleCategoryChange = (category) => {
    setCurrentFilter(category);
  };

  return (
    <div className="histology-page">
      <Navbar />

      <main className="main">
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        <CategoryFilter
          categories={categories}
          handleCategoryChange={handleCategoryChange}
          currentFilter={currentFilter}
        />
        {isLoading ? (
          <div className="loader">
            <div className="loader__spinner"></div>
          </div>
        ) : (
          <>
            <div className="results">
              <p className="results__count">
                {filteredSlides.length === 0
                  ? "Слайды не найдены"
                  : `Найдено слайдов: ${filteredSlides.length}`}
              </p>
            </div>

            <div className="slides-grid">
              {filteredSlides.map((slide) => (
                <div
                  key={slide.id}
                  className="slide-card"
                  onClick={() => {
                    navigate(`/slide/${slide.id}`);
                  }}
                >
                  <div className="slide-card__image-container">
                    <img
                      src={`https://tiles.humanatlas.top/${slide.id}/${slide.id}_files/9/0_0.webp`}
                      alt={slide.name}
                      className="slide-card__image"
                    />
                  </div>
                  <div className="slide-card__content">
                    <h3 className="slide-card__title">{slide.name}</h3>
                    <p className="slide-card__category">{slide.category}</p>
                  </div>
                </div>
              ))}
            </div>

            {filteredSlides.length === 0 && !isLoading && (
              <div className="no-results">
                <p className="no-results__title">
                  По вашему запросу ничего не найдено
                </p>
                <p className="no-results__message">
                  Попробуйте изменить запрос или очистить поиск
                </p>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default HistologySlideLibrary;
