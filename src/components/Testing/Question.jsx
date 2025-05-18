export default function Question({
  question,
  index,
  questionsLength,
  onEdit,
  onRemove,
  onMove,
  onDragStart,
  onDragOver,
  onDragEnter,
  onDragLeave,
  onDrop,
  onDragEnd,
}) {
  return (
    <div
      className="question-wrapper"
      draggable
      onDragStart={(e) => onDragStart(e, index)}
      onDragOver={(e) => onDragOver(e, index)}
      onDragEnter={(e) => onDragEnter(e, index)}
      onDragLeave={onDragLeave}
      onDrop={(e) => onDrop(e, index)}
      onDragEnd={onDragEnd}
    >
      <div className="question-header">
        <h2>Вопрос {index + 1}</h2>

        <div className="question-buttons">
          <button className="button-change" onClick={() => onEdit(index)}>
            Изменить
          </button>
          <button className="button-delete" onClick={() => onRemove(index)}>
            Удалить
          </button>
          <div className="move-buttons">
            <button onClick={() => onMove(index, "up")} disabled={index === 0}>
              ▲
            </button>
            <button
              onClick={() => onMove(index, "down")}
              disabled={index === questionsLength - 1}
            >
              ▼
            </button>
          </div>
        </div>
      </div>

      <div className="question-text">{question.text}</div>

      <div className="type-answer">
        Тип:{" "}
        {question.type === "single"
          ? "Один вариант ответа"
          : question.type === "multiple"
          ? "Несколько вариантов ответа"
          : "Текстовый ответ"}
      </div>

      <div className="answers-wrapper">
        <h2>Ответы</h2>
        {question.type === "text" ? (
          <div>
            <ul className="answers-list">
              {question.textAnswers &&
                question.textAnswers.map((answer, index) => (
                  <li key={index}>{answer}</li>
                ))}
            </ul>
          </div>
        ) : (
          <ul className="answers-list">
            {question.options.map((option, optionIndex) => (
              <li
                className={
                  (question.type === "single" &&
                    optionIndex === question.correctOptionIndex) ||
                  (question.type === "multiple" &&
                    question.correctOptionIndexes &&
                    question.correctOptionIndexes.includes(optionIndex))
                    ? "correct-option"
                    : ""
                }
                key={optionIndex}
              >
                {option}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
