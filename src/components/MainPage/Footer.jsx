import "../../styles/components/footer.css";

export default function Footer() {
  return (
    <footer>
      <div className="footer-content">
        <div className="icons">
          <a href="https://kemsu.ru">
            <img
              src="kemgu-logo.png"
              alt="Кемеровский государственный университет"
            />
          </a>
          <a href="https://kemokod.ru/">
            <img
              src="kkod-logo.png"
              alt="ГБУЗ Кузбасский клинический онкодиспансер им. М.С. Раппопорта"
            />
          </a>
          <a href="https://kemcardio.ru/">
            <img src="nii-kpssz-logo.png" alt="НИИ КПССЗ" />
          </a>
          <a href="https://patolog-kuzbass.ru/">
            <img src="patburo.png" alt="ККПАБ" />
          </a>
        </div>
        <p>
          Работа выполнена в рамках фундаментальной темы НИИ КПССЗ №
          0419-2024-0001 при финансовой поддержке Министерства науки и высшего
          образования Российской Федерации в рамках национального проекта «Наука
          и университеты»
        </p>
        <p>© 2025 ГистоАтлас</p>
      </div>
    </footer>
  );
}
