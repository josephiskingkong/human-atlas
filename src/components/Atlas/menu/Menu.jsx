import InfoBar from "./InfoBar";
import "../../../styles/components/menu/menu.css";
import CloseMenuButton from "./CloseMenuButton";
import { useDispatch, useSelector } from "react-redux";
import PointInfo from "./PointInfo";
import PointMenu from "./point-menu/PointMenu";
import { useEffect, useState } from "react";
import { setCurrMenu } from "../../../redux/atlas/atlas-slice";
import PointSearch from "./point-search/PointSearch";
import { getCategoryById } from "../../../hooks/categories";

export default function Menu({ slideData }) {
  const currMenu = useSelector((state) => state.atlas.currMenu);

  const dispatch = useDispatch();

  const [prevMenu, setPrevMenu] = useState("info");

  useEffect(() => {
    if (currMenu === "menu") setPrevMenu("menu");
    if (currMenu === "info") setPrevMenu("info");
  }, [currMenu]);

  const closeMenuHandler = () => {
    console.log(prevMenu);
    if (currMenu === "close") {
      switch (prevMenu) {
        case "menu":
          dispatch(setCurrMenu("menu"));

          break;
        case "info":
          dispatch(setCurrMenu("info"));

          break;
        default:
          dispatch(setCurrMenu("menu"));

          break;
      }
    } else {
      if (currMenu === "menu") {
        setPrevMenu("menu");
      }

      if (currMenu === "info") {
        setPrevMenu("info");
      }

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
            {currMenu === "info" && <PointInfo />}
            {currMenu === "menu" && <PointMenu />}
            {currMenu === "search" && <PointSearch points={slideData.points} />}
          </div>
        )}
      </div>
    </div>
  );
}
