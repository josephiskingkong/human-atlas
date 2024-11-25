import React, {
  useImperativeHandle,
  forwardRef,
  useEffect,
  useRef,
} from "react";
import { createRoot } from "react-dom/client";
import OpenSeadragon from "openseadragon";
import "../../service/osd-scalebar/openseadragon-scalebar";
import PointMarker from "./PointMarker";
import { Provider, useDispatch, useSelector } from "react-redux";
import store from "../../redux/atlas/atlas-store";
import { setActiveTool, setCurrMenu, setTargetPoint } from "../../redux/atlas/atlas-slice";
import { addPointToBack, editPoint } from "../../hooks/points";
import { getOrganByOrganId } from "../../hooks/organs";

const AtlasViewer = forwardRef(({ slideData, onViewerReady }, ref) => {
  const activeTool = useSelector((state) => state.atlas.activeTool);
  const targetPoint = useSelector((state) => state.atlas.targetPoint);
  const dispatch = useDispatch();

  const osdViewer = useRef(null);
  const viewerRef = useRef(null);
  const overlays = useRef([]);
  const pointsData = useRef([]);

  const addPoint = (point) => {
    const overlayContainer = document.createElement("div");

    overlays.current.push({ point, container: overlayContainer });
    console.log(osdViewer);

    osdViewer.current.addOverlay({
      element: overlayContainer,
      location: new OpenSeadragon.Point(point.x, point.y),
      placement: OpenSeadragon.Placement.CENTER,
    });

    const root = createRoot(overlayContainer);
    root.render(<Provider store={ store }><PointMarker point={point} osdViewer={ osdViewer }/></Provider>);
  };

  const removeOverlay = () => {
    overlays.current.forEach(({ point, container }) => {
      if (point.id === targetPoint.id) {
        osdViewer.current.removeOverlay(container);
      }
    });

    console.log("REMOVE OVERLAY", targetPoint);

    overlays.current = overlays.current.filter(({ point }) => point.id !== targetPoint.id);
  };

  const removeOverlays = () => {
    overlays.current.forEach(({ container }) => {
      osdViewer.current.removeOverlay(container);
    });
    overlays.current = [];
  };

  const showOverlay = () => {
    pointsData.current.forEach((point) => {
      if (point.id === targetPoint.id) {
        console.log("SHOW OVERLAY", point);
        addPoint(point);
      }
    });
  }

  const showOverlays = () => {
    pointsData.current.forEach((point) => addPoint(point));
  };

  const togglePoints = (hidden) => {
    if (hidden) {
      removeOverlays();
    } else {
      showOverlays();
    }
  };

  useImperativeHandle(ref, () => ({
    togglePoints,
  }));

  useEffect(() => {
    pointsData.current = slideData.points;

    osdViewer.current = OpenSeadragon({
      id: viewerRef.current.id,
      prefixUrl: "https://openseadragon.github.io/openseadragon/images/",
      tileSources: slideData.dziPath,
      crossOriginPolicy: "Anonymous",
      zoomInButton: "zoom-in",
      zoomOutButton: "zoom-out",
    });

    addScalebar();

    console.log("OSD");
    console.log(osdViewer);

    osdViewer.current.addHandler("canvas-click", (e) => { e.preventDefaultAction = true });

    osdViewer.current.addHandler("open", () => {
      pointsData.current.forEach((point) => addPoint(point));
      if (onViewerReady) {
        onViewerReady();
      }
    });

    return () => {
      if (osdViewer.current) {
        osdViewer.current.destroy();
        osdViewer.current = null;
      }
      overlays.current.forEach(({ container }) => container.remove());
      overlays.current = [];

      console.log("END");
    };
  }, []);

  async function addScalebar() {
    console.log("MPP");

    const organ = await getOrganByOrganId(slideData.organ.id);

    const mpp_x = Number(organ.mpp_x);
    const pixelsPerMeter = 1 / (mpp_x * 1e-6);

    osdViewer.current.scalebar({
      type: OpenSeadragon.ScalebarType.MICROSCOPY,
      pixelsPerMeter: pixelsPerMeter,
      color: "#4670B4",
      fontColor: "#4670B4",
      backgroundColor: "rgba(255, 255, 255, 0.5)",
      barThickness: 1,
      location: OpenSeadragon.ScalebarLocation.TOP_LEFT,
      xOffset: 200,
      yOffset: 35,
      minWidth: "200px",
      maxWidth: "100px",
      stayInsideImage: false
    });
  }

  useEffect(() => {
    if (targetPoint.status === 'del') {
      pointsData.current = pointsData.current.filter((point) =>
        point.id !== targetPoint.id
      );

      console.log("ZDES");

      removeOverlay();
    }

    const { status, ...targetWithoutStatus } = targetPoint;

    pointsData.current = pointsData.current.map((point) => 
      point.id === targetPoint.id ? { ...point, ...targetWithoutStatus } : point
    );

    console.log("TARGET", targetPoint);
  }, [targetPoint])

  useEffect(() => {
    async function canvasClick(e) {
      e.preventDefaultAction = true;
      console.log("CANVAS-CLICK", activeTool);
      if (activeTool === "Добавить точку") {
        const position = osdViewer.current.viewport.pointFromPixel(e.position);

        const res = await addPointToBack(position.x, position.y, slideData.organ.id, '', '');
        console.log("POINT ID", res.point_id);

        const newPoint = {
          description: '',
          id: res.point_id,
          name: '',
          organid: slideData.organ.id,
          x: position.x,
          y: position.y,
        }

        addPoint(newPoint);
        pointsData.current.push(newPoint);
        dispatch(setTargetPoint(newPoint));
        dispatch(setCurrMenu('menu'));
        dispatch(setActiveTool("Курсор"));
      }

      if (activeTool === "Переместить точку") {
        console.log("PEREMESTIL", targetPoint);
        if (targetPoint.status === 'move') {
          console.log("MOVE");
          const position = osdViewer.current.viewport.pointFromPixel(e.position);

          editPointMove(targetPoint.id, position.x, position.y);
          dispatch(setTargetPoint({ ...targetPoint, x: position.x, y: position.y }));
          console.log(targetPoint);
        }
      }
    }

    if (!osdViewer.current) return;

    if (activeTool === "Переместить точку") {
      dispatch(setCurrMenu('close'));
    } else if (targetPoint.status === 'move') {
      console.log("REMOVE STATUS", targetPoint);
      editPointMove(targetPoint.id, targetPoint.x, targetPoint.y);
      dispatch(setTargetPoint({ ...targetPoint, status: '' }));
    }

    osdViewer.current.addHandler("canvas-click", canvasClick);

    return () => {
      console.log("remove HANDLERS");
      osdViewer.current.removeHandler("canvas-click", canvasClick);
    };
  }, [activeTool, targetPoint])

  const editPointMove = async (id, x, y) => {
    const res = await editPoint({ id, x, y });
    console.log(res);
    console.log("position", x, y);
  }

  useEffect(() => {
    removeOverlay();
    showOverlay();
    
    slideData.points = pointsData.current;
  }, [pointsData.current]);

  return (
    <div className="map-container">
      <div
        id="openseadragon1"
        ref={viewerRef}
        className="openseadragon-viewer"
      ></div>
    </div>
  );
});

export default AtlasViewer;