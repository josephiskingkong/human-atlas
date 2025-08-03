import "../../styles/components/category-filters.css";

export default function CategoryFilter({
  currentFilter,
  handleCategoryChange,
  categories,
  level,
}) {
  return (
    <div className="category-filters">
      <button
        className={`category-filter ${
          String(currentFilter) === "all" ? "active" : ""
        }`}
        onClick={() => handleCategoryChange("all", level)}
      >
        Все категории
      </button>

      {categories.map((category) => (
        <button
          key={category.id}
          className={`category-filter ${
            String(currentFilter) === String(category.id) ? "active" : ""
          }`}
          onClick={() => handleCategoryChange(category.id, level)}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}
