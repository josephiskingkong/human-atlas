import React, { useState, useEffect } from "react";
import Footer from "../components/MainPage/Footer";
import Navbar from "../components/MainPage/Navbar";
import SearchBar from "../components/MainPage/SearchBar";

import "../styles/layout/library-page.css";

const HistologySlideLibrary = () => {
  const [slides, setSlides] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSlides, setFilteredSlides] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Имитация загрузки данных с сервера
  useEffect(() => {
    const fetchSlides = () => {
      setIsLoading(true);
      setTimeout(() => {
        const mockSlides = [
          {
            id: 1,
            name: "Кость компактная (поперечный срез)",
            image:
              "C8Fexfhxj0Y7NAdTeXMt8klM4JIt92VrAF30vgTDxVUFK4fnBk_GppBxGMQRjvZLnfTTEzZsVC-kekgwTFApGk6SHJO9L8hGPiBMWTVpIeJcAP3ROLV8bwcE-O85_eVxI0X_1nk4vo2MIBWXRJO8CtiS6lF5KGVRsSoaH2s2dUQJ4kHO30b4bR4mQGZqSQbwSQfbtQieYT47UJOoDMjHY.webp",
            category: "Костная ткань",
          },
          {
            id: 2,
            name: "Печень (окраска гематоксилин-эозин)",
            image: "/api/placeholder/150/150",
            category: "Пищеварительная система",
          },
          {
            id: 3,
            name: "Эпителий многослойный плоский",
            image: "/api/placeholder/150/150",
            category: "Эпителиальная ткань",
          },
          {
            id: 4,
            name: "Спинной мозг (поперечный срез)",
            image: "/api/placeholder/150/150",
            category: "Нервная система",
          },
          {
            id: 5,
            name: "Лимфатический узел",
            image: "/api/placeholder/150/150",
            category: "Иммунная система",
          },
          {
            id: 6,
            name: "Сердечная мышца",
            image: "/api/placeholder/150/150",
            category: "Мышечная ткань",
          },
          {
            id: 7,
            name: "Артерия эластического типа",
            image: "/api/placeholder/150/150",
            category: "Сердечно-сосудистая система",
          },
          {
            id: 8,
            name: "Щитовидная железа",
            image: "/api/placeholder/150/150",
            category: "Эндокринная система",
          },
          {
            id: 9,
            name: "Красный костный мозг",
            image: "/api/placeholder/150/150",
            category: "Кроветворная система",
          },
          {
            id: 10,
            name: "Тонкий кишечник (ворсинки)",
            image: "/api/placeholder/150/150",
            category: "Пищеварительная система",
          },
          {
            id: 11,
            name: "Гиалиновый хрящ",
            image: "/api/placeholder/150/150",
            category: "Хрящевая ткань",
          },
          {
            id: 12,
            name: "Поджелудочная железа",
            image: "/api/placeholder/150/150",
            category: "Пищеварительная система",
          },
        ];

        setSlides(mockSlides);
        setFilteredSlides(mockSlides);
        setIsLoading(false);
      }, 800);
    };

    fetchSlides();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredSlides(slides);
      return;
    }

    const lowerCaseQuery = searchQuery.toLowerCase();
    const filtered = slides.filter(
      (slide) =>
        slide.name.toLowerCase().includes(lowerCaseQuery) ||
        slide.category.toLowerCase().includes(lowerCaseQuery)
    );

    setFilteredSlides(filtered);
  }, [searchQuery, slides]);

  return (
    <div className="histology-page">
      <Navbar />

      <main className="main">
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

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
                <div key={slide.id} className="slide-card">
                  <div className="slide-card__image-container">
                    <img
                      src={slide.image}
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
