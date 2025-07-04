import React from "react";
import { Book, Users, Microscope, Globe, Mail } from "lucide-react";
import "../styles/layout/about-project.css";
import NavBar from "../components/Common/NavBar";
import { useNotification } from "../context/NotificationContext";

const AboutPage = () => {
  const { showNotification } = useNotification();

  const organizations = [
    {
      name: "Кемеровский государственный университет",
      location: "г. Кемерово",
      type: "Образовательное учреждение",
      image: "human-atlas/kemgu-logo.png",
      ref: "https://kemsu.ru",
      fullName:
        "Федеральное государственное бюджетное образовательное учреждение высшего образования «Кемеровский государственный университет»",
    },
    {
      name: "НИИ комплексных проблем сердечно-сосудистых заболеваний",
      location: "г. Кемерово",
      type: "Научное учреждение",
      image: "human-atlas/kkod-logo.png",
      ref: "https://kemokod.ru/",
      fullName:
        "Федеральное государственное бюджетное научное учреждение «Научно-исследовательский институт комплексных проблем сердечно-сосудистых заболеваний»",
    },
    {
      name: "Кузбасский клинический онкологический диспансер им. М. С. Раппопорта",
      location: "г. Кемерово",
      type: "Клинико-диагностическое учреждение",
      image: "human-atlas/nii-kpssz-logo.png",
      ref: "https://kemcardio.ru/",
      fullName:
        "Государственное бюджетное учреждение здравоохранения «Кузбасский клинический онкологический диспансер имени М. С. Раппопорта»",
    },
    {
      name: "Кузбасское клиническое патологоанатомическое бюро",
      location: "г. Кемерово",
      type: "Патологоанатомическое учреждение",
      image: "human-atlas/patburo.png",
      ref: "https://patolog-kuzbass.ru/",
      fullName:
        "Филиал государственного бюджетного учреждения здравоохранения особого типа «Кузбасское клиническое патологоанатомическое бюро»",
    },
  ];

  const features = [
    {
      icon: <Globe />,
      title: "Открытый доступ",
      description:
        "Интерактивный цифровой ресурс с широкой доступностью для всех пользователей",
      colorClass: "features__item__icon--blue",
    },
    {
      icon: <Microscope />,
      title: "Виртуальный микроскоп",
      description:
        "Коллекция гистологических препаратов в режиме виртуального микроскопа",
      colorClass: "features__item__icon--green",
    },
    {
      icon: <Book />,
      title: "Обширный архив",
      description:
        "Электронномикроскопические изображения с подробными аннотациями",
      colorClass: "features__item__icon--purple",
    },
    {
      icon: <Users />,
      title: "Для всех уровней",
      description:
        "Подходит для студентов, преподавателей и практикующих специалистов",
      colorClass: "features__item__icon--orange",
    },
  ];

  const futurePlans = [
    {
      title: "Пополнение базы",
      description:
        "Регулярное добавление новых гистологических и электронномикроскопических изображений",
    },
    {
      title: "Тестовые задания",
      description: "Система самопроверки для закрепления полученных знаний",
    },
    {
      title: "Видеоуроки",
      description: "Обучающие материалы по ключевым темам гистологии",
    },
  ];

  const handleCopyEmail = async (e) => {
    e.preventDefault();
    const email = "Bogdanovleone@gmail.com";

    try {
      await navigator.clipboard.writeText(email);
      showNotification("Почта скопирована в буфер обмена!", "info");
    } catch (err) {
      const textArea = document.createElement("textarea");
      textArea.value = email;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      showNotification("Почта скопирована в буфер обмена!", "info");
    }
  };

  return (
    <>
      <NavBar />
      <div className="about-page">
        <div className="container">
          {/* Header */}
          <div className="header">
            <h1 className="header__title">Гистологический атлас</h1>
            <p className="header__subtitle">
              Интерактивный цифровой ресурс с открытым доступом для изучения
              микроскопического строения тканей и органов
            </p>
          </div>

          {/* Main Description */}
          <div className="main-description">
            <h2 className="main-description__title">О проекте</h2>
            <div className="main-description__content">
              <p>
                Гистологический атлас представляет собой современный
                интерактивный цифровой ресурс, предназначенный для изучения
                микроскопического строения тканей и органов человека и модельных
                животных как в норме, так и при патологии.
              </p>
              <p>
                Проект создан в помощь студентам медицинских и биологических
                специальностей, преподавателям гистологии, а также практикующим
                патоморфологам.
              </p>
              <p>
                Каждый препарат сопровождается детальной аннотацией и
                пояснительным описанием, что позволяет глубже понять особенности
                строения и патологических изменений исследуемых тканей.
              </p>
            </div>
          </div>

          {/* Features Grid */}
          <div className="features">
            {features.map((feature, index) => (
              <div key={index} className="features__item">
                <div className={`features__item__icon ${feature.colorClass}`}>
                  {feature.icon}
                </div>
                <h3 className="features__item__title">{feature.title}</h3>
                <p className="features__item__description">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* Future Plans */}
          <div className="future-plans">
            <h2 className="future-plans__title">Планы развития</h2>
            <div className="future-plans__grid">
              {futurePlans.map((plan, index) => (
                <div key={index} className="future-plans__item">
                  <h3 className="future-plans__item__title">{plan.title}</h3>
                  <p className="future-plans__item__description">
                    {plan.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Organizations */}
          <div className="organizations">
            <h2 className="organizations__title">Участники проекта</h2>
            <div className="organizations__grid">
              {organizations.map((org, index) => (
                <a href={org.ref}>
                  <div key={index} className="organizations__item">
                    <div className="organizations__item__content">
                      <div className="organizations__item__image">
                        <img src={org.image} alt={org.name} />
                      </div>
                      <div className="organizations__item__info">
                        <h3 className="organizations__item__name">
                          {org.name}
                        </h3>
                        <p className="organizations__item__type">{org.type}</p>
                        <p className="organizations__item__location">
                          {org.location}
                        </p>
                        <p className="organizations__item__full-name">
                          {org.fullName}
                        </p>
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="contact">
            <div className="contact__icon">
              <Mail />
            </div>
            <h2 className="contact__title">Свяжитесь с нами</h2>
            <p className="contact__description">
              По вопросам сотрудничества, развития проекта или внесения
              предложений обращайтесь к координатору проекта
            </p>
            <a
              href="mailto:Bogdanovleone@gmail.com"
              className="contact__button"
              onClick={handleCopyEmail}
            >
              <Mail />
              <span>Bogdanovleone@gmail.com</span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutPage;
