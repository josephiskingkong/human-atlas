import Question from "./Question";

export default function QuestionsList({
  questions,
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
  if (questions.length === 0) {
    return null;
  }

  return (
    <div className="question-list-wrapper">
      <div>
        <h1>Вопросы теста</h1>
        <div className="drop-info">
          Перетащите вопрос, чтобы изменить порядок или используйте стрелки
        </div>
      </div>

      {questions.map((question, index) => (
        <Question
          key={index}
          question={question}
          index={index}
          questionsLength={questions.length}
          onEdit={onEdit}
          onRemove={onRemove}
          onMove={onMove}
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDragEnter={onDragEnter}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onDragEnd={onDragEnd}
        />
      ))}
    </div>
  );
}
