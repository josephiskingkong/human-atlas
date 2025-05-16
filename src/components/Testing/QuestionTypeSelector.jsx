export default function QuestionTypeSelector({ type, onChange }) {
  return (
    <div className="type-selector-wrapper">
      <label>Тип вопроса:</label>
      <div className="type-selector">
        <div className="type">
          <input
            type="radio"
            checked={type === "single"}
            onChange={() => onChange("single")}
          />
          <p>Один вариант</p>
        </div>
        <div className="type">
          <input
            type="radio"
            checked={type === "multiple"}
            onChange={() => onChange("multiple")}
          />
          <p>Несколько вариантов</p>
        </div>
        <div className="type">
          <input
            type="radio"
            checked={type === "text"}
            onChange={() => onChange("text")}
          />
          <p>Текстовый ответ</p>
        </div>
      </div>
    </div>
  );
}
