import "../../styles/components/footer.css";

export default function Footer() {
  return (
    <footer>
      <div className="footer-content">
        <p>© 2025 ГистоАтлас</p>
        <div className="icons">
          <a href="https://kemsu.ru">
            <img
              src="human-atlas/kemgu-logo.png"
              alt="Кемеровский государственный университет"
            />
          </a>
          <a href="https://kemokod.ru/">
            <img
              src="human-atlas/kkod-logo.png"
              alt="ГБУЗ Кузбасский клинический онкодиспансер им. М.С. Раппопорта"
            />
          </a>
          <a href="https://kemcardio.ru/">
            <img src="human-atlas/nii-kpssz-logo.png" alt="НИИ КПССЗ" />
          </a>
          <a href="https://patolog-kuzbass.ru/">
            <img src="human-atlas/patburo.png" alt="ККПАБ" />
          </a>
        </div>
      </div>
    </footer>
  );
}
