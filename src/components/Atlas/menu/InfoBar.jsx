import { useEffect, useState } from "react";
import SearchBar from "./SearchBar";
import { getCategoryById } from "../../../hooks/categories";
import { useDispatch, useSelector } from "react-redux";
import { use } from "react";
import { setCurrMenu } from "../../../redux/atlas/atlas-slice";
import { useNotification } from "../../../context/NotificationContext";

export default function InfoBar({ title, category, currMenu, closeButton }) {
  const slide = useSelector((state) => state.atlas.slideDetails);
  const activeTool = useSelector((state) => state.atlas.activeTool);
  const [categoryName, setCategoryName] = useState(category);
  const { showNotification } = useNotification();

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchCategory = async () => {
      const mockCategory = await getCategoryById(category);

      setCategoryName(mockCategory.name);
    };

    fetchCategory();
  }, [category]);

  const handleTitleClick = () => {
    if (activeTool === "Курсор") {
      if (!slide.description) {
        showNotification("У слайда нет описания", "error");
        return;
      }

      dispatch(setCurrMenu("infoSlide"));
    }
    if (activeTool === "Редактировать точку") {
      dispatch(setCurrMenu("menuSlide"));
    }
  };

  return (
    <div className="info-bar-container">
      {closeButton}
      <SearchBar></SearchBar>
      {currMenu !== "close" && (
        <div className="info-container">
          <div className="organ-title" onClick={handleTitleClick}>
            {title}
          </div>
          <div className="organ-category">{categoryName}</div>
        </div>
      )}
    </div>
  );
}
