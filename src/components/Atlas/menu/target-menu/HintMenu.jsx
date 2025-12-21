export default function HintMenu() {
  return (
    <div className="hint-menu">
      <pre>
        <span className="span-comb">CTRL + B –</span>{" "}
        <span style={{ fontWeight: 800 }}>жирный</span>
        <br />
        <span className="span-comb">CTRL + I –</span>{" "}
        <span style={{ fontStyle: "italic" }}>курсив</span>
        <br />
        <span className="span-comb">CTRL + U –</span>{" "}
        <span style={{ textDecoration: "underline" }}>подчеркнутый</span>
        <br />
        <span style={{ fontWeight: 700 }}>[текст](ссылка)</span>{" "}
        <span className="span-other">
          – <span style={{ textDecoration: "underline" }}>гиперсылка</span>
        </span>
        <br />
        <span style={{ fontWeight: 700 }}>![описание_фото](ссылка)</span>{" "}
        <span className="span-other">- фото</span>
        <br />
        <span className="span-other">Ставьте </span>
        <span style={{ fontWeight: 800 }}># </span>
        <span className="span-other">
          в начале строки для создания заголовка
        </span>
        <br />
      </pre>
    </div>
  );
}
