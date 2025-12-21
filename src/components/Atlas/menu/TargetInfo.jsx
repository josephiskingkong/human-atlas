import { useSelector } from "react-redux";
import Markdown from "../../Common/Markdown";
import "../../../styles/components/menu/point-info.css";

export default function TargetInfo({ isSlide = false }) {
  const target = useSelector((state) =>
    isSlide ? state.atlas.slideDetails : state.atlas.targetPoint
  );

  return (
    <div className="point-info-container">
      <h1>
        {target.name}
        <br />
      </h1>
      <div className="markdown-wrapper">
        <Markdown>{target.description}</Markdown>
      </div>
    </div>
  );
}
