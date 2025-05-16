import "../../styles/components/category-filters.css";

export default function CategoryFilter({
  currentFilter,
  handleCategoryChange,
  categories,
}) {
  return (
    <div className="category-filters">
      <button
        className={`category-filter ${currentFilter === "all" ? "active" : ""}`}
        onClick={() => handleCategoryChange("all")}
      >
        Все категории
      </button>

      {categories.map((category) => (
        <button
          key={category.id}
          className={`category-filter ${
            currentFilter === category.id ? "active" : ""
          }`}
          onClick={() => handleCategoryChange(category.id)}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}
