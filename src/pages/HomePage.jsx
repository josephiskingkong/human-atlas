import Footer from "../components/MainPage/Footer";
import Navbar from "../components/MainPage/Navbar";
import Topic from "../components/MainPage/Topic";

import "../styles/layout/home-page.css";

export default function HomePage() {
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
      title: "Патологическая анатомия",
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
          <h1>Добро пожаловать в ГистоАтлас</h1>
          <p className="description-project">
            Ваш интерактивный ресурс по гистологии и патологии. Изучайте
            микроскопические структуры тканей и органов с помощью
            высококачественных изображений и описаний.
          </p>
          <button className="go-to-library">Библиотека слайдов</button>
        </div>

        <div className="topics-header">
          <h1>Разделы</h1>
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
