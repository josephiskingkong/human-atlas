import { useNavigate } from "react-router-dom";
import Footer from "../components/MainPage/Footer";
import Navbar from "../components/Common/NavBar";
import Topic from "../components/MainPage/Topic";

import "../styles/layout/home-page.css";
import { useEffect, useState } from "react";
import { getMainCategories } from "../hooks/categories";
import { useNotification } from "../context/NotificationContext";

export default function HomePage() {
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const [topics, setTopics] = useState([
    {
      id: 1,
      name: "Нормальная гистология",
      description: "Микроскопическое строение нормальных клеток и тканей",
      icon: "🔬",
    },
    {
      id: 2,
      name: "Патологическая гистология",
      description: "Микроскопические особенности клеток и тканей при патологии",
      icon: "🧫",
    },
    {
      id: 3,
      name: "Электронная микроскопия",
      description:
        "Ультраструктурное строение клеток и тканей в норме и при патологии",
      icon: "🧬",
    },
  ]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const mainCategories = await getMainCategories();

        setTopics((prevTopics) => {
          return prevTopics.map((topic) => {
            const match = mainCategories.find((cat) => cat.name === topic.name);
            return match ? { ...topic, id: match.id } : topic;
          });
        });
      } catch (error) {
        showNotification(
          "Произошла ошибка во время получения категорий!",
          "error"
        );
      }
    }

    fetchCategories();
  }, [showNotification, topics]);

  return (
    <div>
      <Navbar />
      <main className="home-wrapper">
        <div className="header-home">
          <h1>Добро пожаловать в Гистологический Атлас</h1>
          <p className="description-project">
            Ваш интерактивный атлас по нормальной и патологической гистологии.
            Изучайте микроскопическое строение здоровых тканей и органов, а
            также изменения их структуры при различных заболеваниях с помощью
            гистологических слайдов, электронномикроскопических изображений и
            подробных описаний.
          </p>
          <button
            className="go-to-library"
            onClick={() => {
              navigate("/library");
            }}
          >
            Библиотека слайдов
          </button>
        </div>

        <div className="topics-header">
          <h1>Популярные разделы</h1>
          <p>Ознакомьтесь с отдельными темами из обширной библиотеки слайдов</p>
        </div>
        <div className="topics">
          {topics.map((topic) => (
            <Topic
              id={topic.id}
              key={topic.id}
              icon={topic.icon}
              title={topic.name}
              description={topic.description}
            ></Topic>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
