import OptionsEditor from "./OptionsEditor";
import QuestionTypeSelector from "./QuestionTypeSelector";
import TextAnswerEditor from "./TextAnswerEditor";

export default function NewQuestion({
  question,
  newQuestionRef,
  isEditing,
  editingIndex,
  onQuestionTextChange,
  onQuestionTypeChange,
  onOptionChange,
  onSetCorrectOption,
  onToggleCorrectOption,
  onAddOption,
  onRemoveOption,
  onTextAnswersChange,
  onAddTextAnswer,
  onRemoveTextAnswer,
  onSubmit,
  onCancel,
}) {
  return (
    <div ref={newQuestionRef} className="newquestion-wrapper">
      <h2>
        {isEditing
          ? `Редактирование вопроса №${editingIndex + 1}`
          : "Добавить новый вопрос"}
      </h2>

      <div className="question-text-wrapper">
        <label>Текст вопроса:</label>
        <textarea
          value={question.text}
          onChange={onQuestionTextChange}
          placeholder="Введите текст вопроса"
          className="question-text"
        ></textarea>
      </div>

      <QuestionTypeSelector
        type={question.type}
        onChange={onQuestionTypeChange}
      />

      {question.type === "single" || question.type === "multiple" ? (
        <OptionsEditor
          options={question.options}
          type={question.type}
          correctOptionIndex={question.correctOptionIndex}
          correctOptionIndexes={question.correctOptionIndexes}
          onOptionChange={onOptionChange}
          onSetCorrectOption={onSetCorrectOption}
          onToggleCorrectOption={onToggleCorrectOption}
          onAddOption={onAddOption}
          onRemoveOption={onRemoveOption}
        />
      ) : (
        <TextAnswerEditor
          answers={question.textAnswers}
          onChange={onTextAnswersChange}
          onAdd={onAddTextAnswer}
          onRemove={onRemoveTextAnswer}
        />
      )}

      <div className="buttons-manage">
        <button className="button-save" onClick={onSubmit}>
          {isEditing ? "Сохранить" : "Добавить вопрос"}
        </button>

        {isEditing && (
          <button className="button-save button-cancel" onClick={onCancel}>
            Отменить
          </button>
        )}
      </div>
    </div>
  );
}
