import { useNavigate } from "react-router-dom";
import "../../styles/layout/admin-menu.css";
import arrow from "../../assets/images/arrow.svg";

export default function PanelNavigateButton({ title, icon, path }) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(path);
    };

    return (
        <button className="panel-navigate-button" onClick={handleClick}>
            <div className="button-info">
            { icon && <img src={icon} alt={title} className="navigate-icon" /> }    
                <div className="navigate-title">{title}</div>
            </div>
            <img src={arrow} alt="arrow" className="navigate-arrow" />
        </button>
    );
}