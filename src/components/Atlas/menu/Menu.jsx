import InfoBar from "./InfoBar";
import "../../../styles/components/menu/menu.css";
import CloseMenuButton from "./CloseMenuButton";
import { useDispatch, useSelector } from "react-redux";
import TargetInfo from "./TargetInfo";
import TargetMenu from "./target-menu/TargetMenu";
import { useEffect, useState } from "react";
import { setCurrMenu } from "../../../redux/atlas/atlas-slice";
import PointSearch from "./point-search/PointSearch";
import SlideMenu from "./SlideMenu";
import SlideInfo from "./SlideInfo";

export default function Menu({ slideData }) {
  const currMenu = useSelector((state) => state.atlas.currMenu);

  const dispatch = useDispatch();

  const [prevMenu, setPrevMenu] = useState("info");

  useEffect(() => {
    if (currMenu === "menu") setPrevMenu("menu");
    if (currMenu === "info") setPrevMenu("info");
  }, [currMenu]);

  const closeMenuHandler = () => {
    if (currMenu === "close") {
      dispatch(setCurrMenu(prevMenu));
    } else {
      setPrevMenu(currMenu);

      dispatch(setCurrMenu("close"));
    }
  };

  return (
    <div
      className={
        currMenu !== "close" ? "point-menu" : "point-menu point-menu-close"
      }
    >
      <div className="close-button-container">
        <CloseMenuButton currMenu={currMenu} closeHandler={closeMenuHandler} />
      </div>

      <div className="menu-content">
        <InfoBar
          title={slideData.organ.name}
          category={slideData.organ.categoryid}
          points={slideData.points}
          currMenu={currMenu}
        />
        {currMenu !== "close" && (
          <div className="menu-container">
            {currMenu === "infoSlide" && <SlideInfo />}
            {currMenu === "menuSlide" && <SlideMenu />}
            {currMenu === "info" && <TargetInfo />}
            {currMenu === "menu" && <TargetMenu />}
            {currMenu === "search" && <PointSearch points={slideData.points} />}
          </div>
        )}
      </div>
    </div>
  );
}
