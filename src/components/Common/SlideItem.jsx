import { ClockLoader, MoonLoader } from "react-spinners";
import "../../styles/components/slide-item.css";
import { useNavigate } from "react-router-dom";

export default function SlideItem({ img, title, status, path }) {
    
  const renderStatus = () => {
    switch (status) {
      case "PROCESSING":
        return (
            <div className="slide-status">
                <ClockLoader size={16} color="#EDB337" />
                <span>В процессе</span>
            </div>
        );
      case "DONE":
        return <div></div>;
      case "ERROR":
        return (
            <div className="slide-status slide-error">
                <span>✕ Ошибка</span>
            </div>
        );
      default:
        return <span>Неизвестно</span>;
    }
  };

  const navigate = useNavigate();

  const handleClick = () => {
      navigate(path);
  };

  return (
    <div className="slide-item">
      <div className="slide-container">
        <div className="slide-content">
          <div className="slide-header">
            {renderStatus()}
            { status !== "PROCESSING" && <button className="slide-delete-button">Удалить</button> }
          </div>
          <div className="slide-info">
            <div className="slide-title">{title}</div>
            <button className="slide-edit-button" onClick={handleClick}>Редактировать</button>
          </div>
        </div>
      </div>
      <img className="slide-background" src={img} alt="img" />
    </div>
  );
}