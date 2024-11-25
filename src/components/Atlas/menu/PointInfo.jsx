import { useSelector } from "react-redux";

export default function PointInfo() {
    const targetPoint = useSelector((state) => state.atlas.targetPoint);

    return (
        <div className="point-info-container">
            <h1>{ targetPoint.name }<br/></h1>
            <pre>
                { targetPoint.description }
            </pre>
        </div>
    );
}