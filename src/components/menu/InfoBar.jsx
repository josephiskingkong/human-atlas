import SearchBar from "./SearchBar";
import "../../styles/menu/infobar.css";

export default function InfoBar({ title, content, closeMenuHandler }) {
  return (
    <div className="info-bar">
      <SearchBar closeMenuHandler = {closeMenuHandler}></SearchBar>
      <div className="info-text-container">
        <div className="info-name">{title}</div>
        <div className="info-category">{content}</div>
      </div>
    </div>
  );
};
