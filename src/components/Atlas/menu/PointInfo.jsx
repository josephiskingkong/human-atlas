import { useSelector } from "react-redux";

export default function PointInfo() {
    const targetPoint = useSelector((state) => state.atlas.targetPoint);

    return (
        <div className="point-info-container">
            <pre>
                <h1>{ targetPoint.name }<br/></h1>
                { targetPoint.description }
            </pre>
        </div>
    );
}