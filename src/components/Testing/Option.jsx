export default function Option({
  option,
  index,
  type,
  isCorrect,
  onToggleCorrect,
  onChange,
  onRemove,
  disableRemove,
}) {
  return (
    <div className="option-wrapper">
      {type === "single" ? (
        <input
          type="radio"
          checked={isCorrect}
          onChange={() => onToggleCorrect(index)}
        />
      ) : (
        <input
          type="checkbox"
          checked={isCorrect}
          onChange={() => onToggleCorrect(index)}
        />
      )}
      <div className="option">
        <input
          type="text"
          value={option}
          onChange={(e) => onChange(index, e.target.value)}
          placeholder={`Вариант ответа ${index + 1}`}
          className="input-option"
        />
        <button
          className="button-delete"
          onClick={() => onRemove(index)}
          disabled={disableRemove}
        >
          ✕
        </button>
      </div>
    </div>
  );
}
