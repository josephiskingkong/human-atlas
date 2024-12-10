import { useSelector } from "react-redux";
import Markdown from "../../Common/Markdown";
import "../../../styles/components/menu/point-info.css";

export default function PointInfo() {
    const targetPoint = useSelector((state) => state.atlas.targetPoint);

    return (
        <div className="point-info-container">
            <h1>{ targetPoint.name }<br/></h1>
            <div className="markdown-wrapper">
                <Markdown>{ targetPoint.description }</Markdown>
            </div>
        </div>
    );
}