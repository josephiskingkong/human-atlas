import separator from "../../imgs/search-bar/separator.svg";
import icon from "../../imgs/search-bar/search-icon.svg";
import "../../styles/menu/searchbar.css";

export default function SearchBar({ closeMenuHandler }) {
  return (
    <div className="search-bar-container">
      <div className="close-button" onClick={closeMenuHandler}></div>
      <input className="search-input" placeholder="Поиск" />
      <div className="group">
        <img className="line" alt="Separator" src={separator} />
        <div className="search-button">
          <img className="img" alt="Search Icon" src={icon} />
        </div>
      </div>
    </div>
  );
}