import React, { useImperativeHandle, forwardRef, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import OpenSeadragon from "openseadragon";
import PointMarker from "./PointMarker";

const AtlasViewer = forwardRef(({ slideData, onViewerReady }, ref) => {
  const osdViewer = useRef(null);
  const viewerRef = useRef(null);
  const overlaysRef = useRef([]); // Хранилище для контейнеров точек

  const addPoint = (point) => {
    const overlayContainer = document.createElement("div");
    overlayContainer.className = "overlay-container";

    overlaysRef.current.push(overlayContainer);

    osdViewer.current.addOverlay({
      element: overlayContainer,
      location: new OpenSeadragon.Point(point.x, point.y),
      placement: OpenSeadragon.Placement.CENTER,
    });

    const root = createRoot(overlayContainer);
    root.render(<PointMarker info={point.info} />);
  };

  const togglePoints = (hidden) => {
    overlaysRef.current.forEach((overlay) => {
      overlay.style.display = hidden ? "none" : "block";
    });
  };

  useImperativeHandle(ref, () => ({
    addPoint,
    togglePoints,
  }));

  useEffect(() => {
    if (osdViewer.current) return;

    osdViewer.current = OpenSeadragon({
      id: viewerRef.current.id,
      prefixUrl: "https://openseadragon.github.io/openseadragon/images/",
      tileSources: slideData.dziPath,
      crossOriginPolicy: "Anonymous",
    });

    osdViewer.current.addHandler("open", () => {
      slideData.points.forEach(addPoint);
      if (onViewerReady) {
        onViewerReady();
      }
    });

    return () => {
      if (osdViewer.current) {
        osdViewer.current.destroy();
        osdViewer.current = null;
      }

      overlaysRef.current.forEach((overlay) => overlay.remove());
      overlaysRef.current = [];
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