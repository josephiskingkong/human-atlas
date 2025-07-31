import React, { useState, useEffect } from "react";
import Footer from "../components/MainPage/Footer";
import Navbar from "../components/Common/NavBar";
import SearchBar from "../components/MainPage/SearchBar";
import { search as fuseSearch } from "../service/fuse/search";

import "../styles/layout/library-page.css";
import { getOrgansByCategoryId, getOrgansDone } from "../hooks/organs/getOrgan";
import CategoryFilter from "../components/MainPage/CategoryFilter";
import {
  getCategoriesByParentId,
  getMainCategories,
} from "../hooks/categories";
import { useNavigate, useSearchParams } from "react-router-dom";

const HistologySlideLibrary = () => {
  const [slides, setSlides] = useState([]);
  const [categoriesMatrix, setCategoriesMatrix] = useState([]);
  const [currentFilter, setCurrentFilter] = useState(["all"]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSlides, setFilteredSlides] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchSlides = async () => {
      let mockSlides;
      let subCategories;
      const mockCategories = [];
      const category = searchParams.get("category");

      mockCategories.push(await getMainCategories());

      console.log("Категории", mockCategories);

      if (category) {
        subCategories = await getCategoriesByParentId(category);
        const hasSub = Array.isArray(subCategories) && subCategories.length > 0;

        mockSlides = await getOrgansByCategoryId(category);

        if (hasSub) {
          setCurrentFilter([category, "all"]);
          mockCategories.push(subCategories);
        } else setCurrentFilter([category]);
      } else {
        console.log("нету категории");
        mockSlides = await getOrgansDone();
      }

      console.log("slideeeee", mockSlides);

      setSlides(mockSlides);
      setCategoriesMatrix(mockCategories);
      setFilteredSlides(mockSlides);
      setIsLoading(false);
    };

    fetchSlides();
  }, [searchParams]);

  useEffect(() => {
    if (!slides || slides === undefined || slides.length === 0) {
      setFilteredSlides([]);
      return;
    }

    let filtered = [...slides];

    if (currentFilter[currentFilter.length - 1] !== "all") {
      filtered = filtered.filter((slide) =>
        currentFilter.includes(slide.categoryid)
      );
    }

    if (searchQuery.trim() === "") {
      setFilteredSlides(filtered);
      return;
    }

    const fuseResults = fuseSearch(filtered, searchQuery);
    setFilteredSlides(fuseResults);
  }, [searchQuery, slides, currentFilter]);

  const handleCategoryChange = async (category, level) => {
    const isNotLastLevel = level < currentFilter.length - 1;
    const subCategories = await getCategoriesByParentId(category);
    const hasSub = Array.isArray(subCategories) && subCategories.length > 0;

    setCategoriesMatrix((prev) => {
      let newMatrix = [...prev.slice(0, level + 1)];

      if (hasSub && !(category === "all" && isNotLastLevel))
        newMatrix = [...newMatrix, subCategories];

      return newMatrix;
    });

    setCurrentFilter((prev) => {
      let newFilter = [...prev.slice(0, level + 1)];
      newFilter[level] = category;

      if (hasSub && !(category === "all" && isNotLastLevel))
        newFilter = [...newFilter, "all"];

      return newFilter;
    });
  };

  useEffect(() => {
    console.log(categoriesMatrix);
    console.log(currentFilter);
  }, [categoriesMatrix, currentFilter]);

  useEffect(() => {
    console.log("Slides data:", slides);
    console.log("Filtered slides:", filteredSlides);
  }, [slides, filteredSlides]);

  return (
    <div className="histology-page">
      <Navbar />

      <main className="main">
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        {categoriesMatrix.map((categoriesLevel, index) => (
          <CategoryFilter
            key={index}
            categories={categoriesLevel}
            handleCategoryChange={handleCategoryChange}
            currentFilter={currentFilter[index]}
            level={index}
          />
        ))}

        {isLoading ? (
          <div className="loader">
            <div className="loader__spinner"></div>
          </div>
        ) : (
          <>
            <div className="results">
              <p className="results__count">
                {filteredSlides === undefined || filteredSlides.length === 0 ? (
                  <></>
                ) : (
                  `Найдено слайдов: ${filteredSlides.length}`
                )}
              </p>
            </div>

            <div className="slides-grid">
              {Array.isArray(filteredSlides) && filteredSlides.length > 0 ? (
                filteredSlides.map((slide) => (
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
                ))
              ) : (
                <></>
              )}
            </div>

            {!filteredSlides || (filteredSlides.length === 0 && !isLoading) ? (
              <div className="no-results">
                <p className="no-results__title">
                  По вашему запросу ничего не найдено
                </p>
                <p className="no-results__message">
                  Попробуйте изменить запрос или очистить поиск
                </p>
              </div>
            ) : null}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default HistologySlideLibrary;
