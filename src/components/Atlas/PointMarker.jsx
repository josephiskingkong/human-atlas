import { useEffect, useState } from "react";
import "../../styles/components/point-marker.css";
import { useDispatch, useSelector } from "react-redux";
import { setIsMenuOpen, setActiveTool, setTargetPoint, setIsInfoOpen } from "../../redux/atlas/atlas-slice";
import OpenSeadragon from "openseadragon";

export default function PointMarker({ point, osdViewer }) {
  const isMenuOpen = useSelector((state) => state.atlas.isMenuOpen);
  const isInfoOpen = useSelector((state) => state.atlas.isInfoOpen);
  const activeTool = useSelector((state) => state.atlas.activeTool);
  const targetPoint = useSelector((state) => state.atlas.targetPoint);

  const dispatch = useDispatch();

  useEffect(() => {
    console.log("INIT", point);
  }, []);

  const pointHandler = (event) => {
    event.preventDefault();

    if (activeTool === "Редактировать точку") {
      if (!isMenuOpen) {
        dispatch(setIsMenuOpen(true));
      }
      
      console.log("EDIT", point);

      dispatch(setTargetPoint({ ...point }));
      dispatch(setActiveTool("Курсор"));
    }

    if (activeTool === "Курсор") {
      if (!isInfoOpen) {
        dispatch(setIsInfoOpen(true));
      }

      console.log("CURSOR", point);
      dispatch(setTargetPoint({ ...point }));
    }

    if (activeTool === "Переместить точку") {
      console.log("START-MOVE");
      dispatch(setTargetPoint({ ...point, status: 'move' }))
    }
  }

  return (
    <div className="point-container" 
      onPointerDown={ pointHandler }
    >
      <div className={ (targetPoint.id === point.id && (isMenuOpen || isInfoOpen)) || (targetPoint.id === point.id && targetPoint.status === 'move') ? "marker marker-select" : "marker"}></div>
    </div>
  );
}
