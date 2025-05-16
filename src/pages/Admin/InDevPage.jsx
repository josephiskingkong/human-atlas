import { useNavigate } from "react-router-dom";
import "../../styles/layout/indev-page.css";
import dev from '../../assets/images/dev.svg'

export default function InDevPage() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1); 
    } else {
      navigate("/human-atlas/admin"); 
    }
  };

  return (
    <div className="indev-wrapper">
      <div className="indev-container">
        <div className="indev-header">
          <img src={dev} alt="Development" className="indev-icon"/>
          <div className="indev-title">Раздел находится в разработке</div>
          <div className="indev-description">
            Вернитесь сюда немного позже
          </div>
        </div>
        <button className="indev-button" onClick={handleGoBack}>
          Вернуться назад
        </button>
      </div>
    </div>
  );
}