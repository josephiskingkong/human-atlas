import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import AtlasViewer from "../components/Atlas/AtlasViewer";
import LoadingSpinner from "../components/Common/LoadingSpinner";
import { TILES_URL } from "../config/constants";
import { getOrganByOrganId } from "../hooks/organs/getOrgan";
import { getPointsByOrganId } from "../hooks/points/getPoint";
import "../styles/components/atlas-viewer.css";
import TogglePointsCheckbox from "../components/Atlas/TogglePointsCheckbox";
import arrow from "../assets/images/arrow.svg";
import "../styles/layout/slide-page.css";
import Zoombar from "../components/Atlas/ZoomBar";
import ToolBar from "../components/Atlas/ToolBar";
import { setCurrMenu } from "../redux/atlas/atlas-slice";
import { useDispatch } from "react-redux";
import Menu from "../components/Atlas/menu/Menu";
import Cookies from "js-cookie";

const SlidePage = () => {
  const dispatch = useDispatch();
  const atlasViewerRef = useRef();

  const { id } = useParams();
  const viewerRef = useRef(null);
  const [user, setUser] = useState(null);
  const [slideData, setSlideData] = useState(null);
  const [loadingData, setLoadingData] = useState(true);
  const [viewerReady, setViewerReady] = useState(false);
  const navigate = useNavigate();
  const [measureActive, setMeasureActive] = useState(false);

  useEffect(() => {
    const userCookie = Cookies.get("user");
    if (userCookie) {
      try {
        const parsedUser = JSON.parse(userCookie);
        setUser(parsedUser);
      } catch (error) {
        console.error("Ошибка парсинга куки с пользователем:", error);
      }
    }
  }, []);

  useEffect(() => {
    const fetchSlideData = async () => {
      try {
        const points = await getPointsByOrganId(id);
        const organ = await getOrganByOrganId(id);
        if (!points || !organ) {
          return;
        }
        const dziPath = `${TILES_URL}/${id}/${id}.dzi`;
        setSlideData({ points, dziPath, organ });
      } catch (error) {
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

  const handleGoBack = () => {
  if (window.history.length > 1) {
    navigate(-1);
  } else {
    navigate("/human-atlas/");
  }
};

  return (
    <div className="slide-page-container">
      {slideData && (
        <>
          <button className="go-back-button" onClick={() => { dispatch(setCurrMenu('close')); handleGoBack(); }}>
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
                {user && user.isAdmin && (
                <ToolBar />
                )}
              </div>
            
            <div className="point-menu-layout">
              <Menu slideData={slideData} />
            </div>
          </div>
        </>
      )}

      {(loadingData || !viewerReady) && <LoadingSpinner />}
    </div>
  );
};

export default SlidePage;