export default function TextAnswerEditor({
  answers,
  onChange,
  onAdd,
  onRemove,
}) {
  return (
    <div className="options-wrapper">
      <label>Правильные ответы:</label>
      <div className="options">
        {answers.map((answer, index) => (
          <div className="option-wrapper">
            <div key={index} className="option">
              <input
                type="text"
                value={answer}
                onChange={(e) => onChange(index, e.target.value)}
                placeholder={`Правильный ответ ${index + 1}`}
                className="input-option"
              />
              <button
                onClick={() => onRemove(index)}
                disabled={answers.length <= 1}
                className="button-delete"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
      <button className="button-add" onClick={onAdd}>
        + Добавить вариант ответа
      </button>
    </div>
  );
}
