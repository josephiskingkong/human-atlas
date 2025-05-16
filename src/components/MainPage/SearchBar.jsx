import { Search } from "lucide-react";

import "../../styles/components/search-bar.css";

export default function SearchBar({ searchQuery, setSearchQuery }) {
  return (
    <div className="search">
      <div className="search__container">
        <input
          type="text"
          placeholder="Поиск по названию или категории..."
          className="search__input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Search className="search__icon" size={20} />
        {searchQuery && (
          <button onClick={() => setSearchQuery("")} className="search__clear">
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
