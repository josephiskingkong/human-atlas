import Option from "./Option";

export default function OptionsEditor({
  options,
  type,
  correctOptionIndex,
  correctOptionIndexes,
  onOptionChange,
  onSetCorrectOption,
  onToggleCorrectOption,
  onAddOption,
  onRemoveOption,
}) {
  return (
    <div className="options-wrapper">
      <label>Варианты ответов:</label>
      <div className="options">
        {options.map((option, index) => (
          <Option
            key={index}
            option={option}
            index={index}
            type={type}
            isCorrect={
              type === "single"
                ? index === correctOptionIndex
                : correctOptionIndexes.includes(index)
            }
            onToggleCorrect={
              type === "single" ? onSetCorrectOption : onToggleCorrectOption
            }
            onChange={onOptionChange}
            onRemove={onRemoveOption}
            disableRemove={options.length <= 2}
          />
        ))}
      </div>
      <button className="button-add" onClick={onAddOption}>
        + Добавить вариант ответа
      </button>
    </div>
  );
}
