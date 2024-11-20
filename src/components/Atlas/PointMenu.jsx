import InfoBar from "./InfoBar";
import '../../styles/components/point-menu.css';

export default function PointMenu({ organ, point }) {
    return (
        <div className="point-menu">
            <InfoBar title={organ.name} category="TODO" />
            <div className="point-info-container">
                
            </div>
        </div>
    )
}