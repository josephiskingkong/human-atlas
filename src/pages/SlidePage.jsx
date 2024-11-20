import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import AtlasViewer from "../components/Atlas/AtlasViewer";
import LoadingSpinner from "../components/Common/LoadingSpinner";
import { getPointsByOrganId } from "../hooks/points/getPoints";
import { TILES_URL } from "../config/constants";
import { getOrganByOrganId } from "../hooks/organs/getOrgan";
import "../styles/components/atlas-viewer.css";
import TogglePointsCheckbox from "../components/Atlas/TogglePointsCheckbox";
import arrow from "../assets/images/arrow.svg";

import "../styles/layout/slide-page.css";
import Zoombar from "../components/Atlas/ZoomBar";
import ToolBar from "../components/Atlas/ToolBar";
import PointMenu from "../components/Atlas/PointMenu";

const SlidePage = () => {
  const { id } = useParams();
  const viewerRef = useRef(null);
  const [slideData, setSlideData] = useState(null);
  const [loadingData, setLoadingData] = useState(true);
  const [viewerReady, setViewerReady] = useState(false);

  useEffect(() => {
    const fetchSlideData = async () => {
      try {
        const points = await getPointsByOrganId(id);
        const organ = await getOrganByOrganId(id);

        if (!points || !organ) {
          console.error("Error fetching points or organ data");
          return;
        }

        const dziPath = `${TILES_URL}/${id}/${id}.dzi`;

        setSlideData({
          points,
          dziPath,
          organ,
        });
      } catch (error) {
        console.error("Error fetching slide data:", error);
      } finally {
        setLoadingData(false);
      }
    };

    fetchSlideData();
  }, [id]);

  const togglePointsVisibility = (hidden) => {
    if (viewerRef.current) {
      viewerRef.current.togglePoints(hidden);
    }
  };

  const handleViewerReady = () => {
    setViewerReady(true);
  };

  return (
    <div className="slide-page-container">
      {slideData && (
        <>
          <button className="go-back-button">
            <img src={arrow} alt="arrow" />
          </button>

          <AtlasViewer
            ref={viewerRef}
            slideData={slideData}
            onViewerReady={handleViewerReady}
            className="atlas-viewer"
          />
          <TogglePointsCheckbox
            togglePointsVisibility={togglePointsVisibility}
          />
          <Zoombar />

          <div className="overlay-menu-grid">
            <div className="toolbar-layout">
              <ToolBar />
            </div>
            <div className="point-menu-layout">
              <PointMenu organ={slideData.organ} />
            </div>
          </div>
        </>
      )}

      {(loadingData || !viewerReady) && <LoadingSpinner />}
    </div>
  );
};

export default SlidePage;