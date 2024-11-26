import { useEffect, useState } from "react";
import "../../styles/components/point-marker.css";
import { useDispatch, useSelector } from "react-redux";
import { setIsMenuOpen, setActiveTool, setTargetPoint, setIsInfoOpen, setCurrMenu } from "../../redux/atlas/atlas-slice";
import OpenSeadragon from "openseadragon";

export default function PointMarker({ point, osdViewer }) {
  const currMenu = useSelector((state) => state.atlas.currMenu);
  const activeTool = useSelector((state) => state.atlas.activeTool);
  const targetPoint = useSelector((state) => state.atlas.targetPoint);

  const dispatch = useDispatch();

  useEffect(() => {
    console.log("INIT", point);
  }, []);

  const pointHandler = (event) => {
    event.preventDefault();

    if (activeTool === "Редактировать точку") {
      dispatch(setCurrMenu('menu'));
      dispatch(setTargetPoint({ ...point }));
      dispatch(setActiveTool("Курсор"));
    }

    if (activeTool === "Курсор") {
      dispatch(setCurrMenu('info'));
      dispatch(setTargetPoint({ ...point }));
    }

    if (activeTool === "Переместить точку") {
      dispatch(setTargetPoint({ ...point, status: 'move' }))
    }
  }

  return (
    <div className="point-container" 
      onPointerDown={ pointHandler }
    >
      <div className={ 
        (targetPoint.id === point.id && (currMenu !== 'close' || targetPoint.status === 'move')) ? 
          "marker marker-select" : "marker"
      }>
      </div>
    </div>
  );
}
