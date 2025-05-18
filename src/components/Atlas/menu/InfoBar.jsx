import { useEffect, useState } from "react";
import SearchBar from "./SearchBar";
import { getCategoryById } from "../../../hooks/categories";

export default function InfoBar({ title, category, currMenu, closeButton }) {
  const [categoryName, setCategoryName] = useState(category);

  useEffect(() => {
    const fetchCategory = async () => {
      const mockCategory = await getCategoryById(category);

      setCategoryName(mockCategory.name);
    };

    fetchCategory();
  }, [category]);

  return (
    <div className="info-bar-container">
      {closeButton}
      <SearchBar></SearchBar>
      {currMenu !== "close" && (
        <div className="info-container">
          <div className="organ-title">{title}</div>
          <div className="organ-category">{categoryName}</div>
        </div>
      )}
    </div>
  );
}
