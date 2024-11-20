import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import AtlasViewer from "../components/Atlas/AtlasViewer";
import LoadingSpinner from "../components/Common/LoadingSpinner";
import { getPointsByOrganId } from "../hooks/points/getPoints";
import { TILES_URL } from "../config/constants";
import { getOrganByOrganId } from "../hooks/organs/getOrgan";
import "../styles/components/atlas-viewer.css";
import TogglePointsCheckbox from "../components/Atlas/TogglePointsCheckbox";

import '../styles/layout/slide-page.css'

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
      <TogglePointsCheckbox togglePointsVisibility={togglePointsVisibility} />

      {slideData && (
        <AtlasViewer
          ref={viewerRef}
          slideData={slideData}
          onViewerReady={handleViewerReady}
        />
      )}

      {(loadingData || !viewerReady) && <LoadingSpinner />}
    </div>
  );
};

export default SlidePage;