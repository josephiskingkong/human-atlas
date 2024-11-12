import SearchBar from "./SearchBar";
import "../../styles/menu/menu.css";
import InfoBar from "./InfoBar";

export default function Menu({ title, content, closeMenuHandler }) {
  return (
    <>
      <div className="menu-wrapper">
        <InfoBar title={title} closeMenuHandler={closeMenuHandler} content={content}></InfoBar>
        <div className="menu">
          <textarea className="menu-content">{content}</textarea>
          <div className="buttons">
            <button className="primary-button">Сохранить</button>
            <button className="secondary-button">Удалить</button>
          </div>
        </div>
      </div>
    </>
  );
}
