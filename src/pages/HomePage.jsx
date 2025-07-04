import { useNavigate } from "react-router-dom";
import Footer from "../components/MainPage/Footer";
import Navbar from "../components/Common/NavBar";
import Topic from "../components/MainPage/Topic";

import "../styles/layout/home-page.css";

export default function HomePage() {
  const navigate = useNavigate();
  const topics = [
    {
      id: 1,
      title: "Нормальная гистология",
      description:
        "Изучение микроскопического строения нормальных тканей и органов.",
      icon: "🔬",
    },
    {
      id: 2,
      title: "Патологическая гистология",
      description:
        "Исследование структурных изменений в органах и тканях при различных заболеваниях.",
      icon: "🧫",
    },
    {
      id: 3,
      title: "Онкологические заболевания",
      description:
        "Изучение особенностей строения и развития онкологических процессов.",
      icon: "🧬",
    },
  ];

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
              key={topic.id}
              icon={topic.icon}
              title={topic.title}
              description={topic.description}
            ></Topic>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
