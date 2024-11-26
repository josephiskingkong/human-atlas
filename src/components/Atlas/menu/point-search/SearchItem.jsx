import { useDispatch, useSelector } from "react-redux";
import Markdown from "../../../Common/Markdown";
import { setCurrMenu, setTargetPoint } from "../../../../redux/atlas/atlas-slice";

export default function SearchItem({ point }) {
    const dispatch = useDispatch();

    return (
        <div className="search-item" onPointerDown={ () => {
            dispatch(setTargetPoint({ ...point }));
            dispatch(setCurrMenu('info'));
        } }>
            <h2 className="item-title">{ point.name }</h2>
            <p className="item-description"><Markdown>{ point.description }</Markdown></p>
        </div>
    );
}