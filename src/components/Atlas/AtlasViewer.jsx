import React, {
  useImperativeHandle,
  forwardRef,
  useEffect,
  useRef,
} from "react";
import { createRoot } from "react-dom/client";
import OpenSeadragon from "openseadragon";
import PointMarker from "./PointMarker";

const AtlasViewer = forwardRef(({ slideData, onViewerReady }, ref) => {
  const osdViewer = useRef(null);
  const viewerRef = useRef(null);
  const overlays = useRef([]);
  const pointsData = useRef([]);

  const addPoint = (point) => {
    const overlayContainer = document.createElement("div");
    overlayContainer.className = "overlay-container";

    overlays.current.push({ point, container: overlayContainer });

    osdViewer.current.addOverlay({
      element: overlayContainer,
      location: new OpenSeadragon.Point(point.x, point.y),
      placement: OpenSeadragon.Placement.CENTER,
    });

    const root = createRoot(overlayContainer);
    root.render(<PointMarker info={point.info} />);
  };

  const removeOverlays = () => {
    overlays.current.forEach(({ container }) => {
      osdViewer.current.removeOverlay(container);
    });
    overlays.current = [];
  };

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
    if (osdViewer.current) return;

    pointsData.current = slideData.points;

    osdViewer.current = OpenSeadragon({
      id: viewerRef.current.id,
      prefixUrl: "https://openseadragon.github.io/openseadragon/images/",
      tileSources: slideData.dziPath,
      crossOriginPolicy: "Anonymous",
      zoomInButton: "zoom-in",
      zoomOutButton: "zoom-out",
    });

    osdViewer.current.addHandler("canvas-click", (event) => {
        event.preventDefaultAction = true; 
    });

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
    };
  }, [slideData, onViewerReady]);

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
