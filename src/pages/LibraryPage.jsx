import React, { useState, useEffect } from "react";
import Footer from "../components/MainPage/Footer";
import Navbar from "../components/Common/NavBar";
import SearchBar from "../components/MainPage/SearchBar";
import { search as fuseSearch } from "../service/fuse/search";

import "../styles/layout/library-page.css";
import { getOrgansDone } from "../hooks/organs/getOrgan";
import CategoryFilter from "../components/MainPage/CategoryFilter";
import {
  getCategoriesByParentId,
  getMainCategories,
} from "../hooks/categories";
import { useNavigate, useSearchParams } from "react-router-dom";
import { TILES_URL } from "../config/constants";

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
      mockSlides = await getOrgansDone();

      if (category) {
        subCategories = await getCategoriesByParentId(category);
        const hasSub = Array.isArray(subCategories) && subCategories.length > 0;

        mockSlides.filter((slide) => slide.id === category);

        if (hasSub) {
          setCurrentFilter([category, "all"]);
          mockCategories.push(subCategories);
        } else {
          setCurrentFilter([category]);
        }
      }

      setSlides(mockSlides);
      setCategoriesMatrix(mockCategories);
      setFilteredSlides(mockSlides);
      setIsLoading(false);
    };

    fetchSlides();
  }, [searchParams]);

  useEffect(() => {
    let cancelled = false;

    const applyFilter = async () => {
      if (!slides || slides.length === 0) {
        if (!cancelled) {
          setFilteredSlides([]);
          setIsLoading(false);
        }
        return;
      }

      let filtered = [...slides];
      const last = currentFilter[currentFilter.length - 1];

      if (last === "all") {
        if (currentFilter.length > 1) {
          const rootCategoryId = currentFilter[currentFilter.length - 2];

          const collectDescendantIds = async (rootId) => {
            const result = new Set();
            const queue = [rootId];

            while (queue.length) {
              const parentId = queue.pop();
              const subs = await getCategoriesByParentId(parentId);
              if (Array.isArray(subs) && subs.length > 0) {
                for (const c of subs) {
                  if (!result.has(c.id)) {
                    result.add(c.id);
                    queue.push(c.id);
                  }
                }
              }
            }

            return result;
          };

          const descendants = await collectDescendantIds(rootCategoryId);
          const allowed = new Set([rootCategoryId, ...descendants]);
          filtered = filtered.filter((slide) => allowed.has(slide.categoryid));
        }
      } else {
        filtered = filtered.filter((slide) => last === slide.categoryid);
      }

      if (searchQuery.trim() !== "") {
        filtered = fuseSearch(filtered, searchQuery);
      }

      if (!cancelled) {
        setFilteredSlides(filtered);
        setIsLoading(false);
      }
    };

    applyFilter();
    return () => {
      cancelled = true;
    };
  }, [searchQuery, slides, currentFilter]);

  const handleCategoryChange = async (category, level) => {
    setIsLoading(true);

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
                        src={`${TILES_URL}/${slide.id}/${slide.id}_files/9/0_0.webp`}
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
