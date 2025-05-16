import React, {
  useImperativeHandle,
  forwardRef,
  useEffect,
  useRef,
  useState,
} from "react";
import { createRoot } from "react-dom/client";
import OpenSeadragon from "openseadragon";
import "../../service/osd-scalebar/openseadragon-scalebar";
import { Provider, useDispatch, useSelector } from "react-redux";
import store from "../../redux/atlas/atlas-store";
import {
  setActiveTool,
  setCurrMenu,
  setTargetPoint,
} from "../../redux/atlas/atlas-slice";
import { addPointToBack } from "../../hooks/points/addPoint";
import { editPoint } from "../../hooks/points/editPoint";
import { getOrganByOrganId } from "../../hooks/organs/getOrgan";
import { useNotification } from "../../context/NotificationContext";
import "../../styles/components/atlas-viewer.css";

import PointMarker from "./PointMarker";
import MeasureLine from "./MeasureLine";

const AtlasViewer = forwardRef(
  ({ slideData, onViewerReady, measureActive }, ref) => {
    const activeTool = useSelector((state) => state.atlas.activeTool);
    const targetPoint = useSelector((state) => state.atlas.targetPoint);
    const dispatch = useDispatch();
    const { showNotification } = useNotification();

    const osdViewer = useRef(null);
    const viewerRef = useRef(null);
    const overlays = useRef([]);
    const pointsData = useRef([]);
    const measureLinesData = useRef([]);
    const [measurePoints, setMeasurePoints] = useState([]);
    const [mpp, setMpp] = useState(1);

    useImperativeHandle(ref, () => ({
      togglePoints(hidden) {
        if (!osdViewer.current) return;
        if (hidden) {
          overlays.current.forEach(({ container }) =>
            osdViewer.current.removeOverlay(container)
          );
          overlays.current = [];
        } else {
          pointsData.current.forEach((p) => addPoint(p));
          measureLinesData.current.forEach((line) => {
            addMeasureLine(line.p1, line.p2, line.distance);
          });
        }
      },
    }));

    const addPoint = (point) => {
      const c = document.createElement("div");
      overlays.current.push({ point, container: c });
      osdViewer.current.addOverlay({
        element: c,
        location: new OpenSeadragon.Point(point.x, point.y),
        placement: OpenSeadragon.Placement.CENTER,
      });
      createRoot(c).render(
        <Provider store={store}>
          <PointMarker point={point} />
        </Provider>
      );
    };

    const addMeasureLine = (p1, p2, distance) => {
      const c = document.createElement("div");
      c.style.position = "absolute";
      c.style.width = "100%";
      c.style.height = "100%";
      c.style.pointerEvents = "none";

      // Сохраняем информацию о линии для возможного восстановления
      const lineData = { p1, p2, distance };
      measureLinesData.current.push(lineData);

      overlays.current.push({
        measureLine: true,
        container: c,
        ...lineData,
      });

      // Рендерим React-компонент внутри контейнера
      createRoot(c).render(<MeasureLine p1={p1} p2={p2} distance={distance} />);

      // Добавляем оверлей
      osdViewer.current.addOverlay({
        element: c,
        location: new OpenSeadragon.Point(0, 0),
        placement: OpenSeadragon.Placement.TOP_LEFT,
      });
    };

    const removeOverlayForPoint = (id) => {
      overlays.current.forEach(({ point, container }) => {
        if (point?.id === id) {
          osdViewer.current.removeOverlay(container);
        }
      });
      overlays.current = overlays.current.filter(
        ({ point }) => point?.id !== id
      );
    };

    const editPointMove = async (id, x, y) => {
      await editPoint({ id, x, y });
    };

    const addScalebar = async () => {
      const organ = await getOrganByOrganId(slideData.organ.id);
      const mpp_x = Number(organ?.mpp_x) || 1;
      setMpp(mpp_x);
      const ppm = 1 / (mpp_x * 1e-6);
      osdViewer.current.scalebar({
        type: OpenSeadragon.ScalebarType.MICROSCOPY,
        pixelsPerMeter: ppm,
        color: "#4670B4",
        fontColor: "#4670B4",
        backgroundColor: "rgba(255, 255, 255, 0.5)",
        barThickness: 1,
        location: OpenSeadragon.ScalebarLocation.TOP_LEFT,
        xOffset: 200,
        yOffset: 35,
        minWidth: "200px",
        maxWidth: "100px",
        stayInsideImage: false,
      });
    };

    useEffect(() => {
      pointsData.current = slideData.points || [];
      measureLinesData.current = [];
      osdViewer.current = OpenSeadragon({
        id: viewerRef.current.id,
        prefixUrl: "https://openseadragon.github.io/openseadragon/images/",
        tileSources: slideData.dziPath,
        crossOriginPolicy: "Anonymous",
        showNavigationControl: false,
      });
      addScalebar();

      osdViewer.current.addHandler(
        "canvas-click",
        (e) => (e.preventDefaultAction = true)
      );
      osdViewer.current.addHandler("open", () => {
        pointsData.current.forEach((p) => addPoint(p));
        measureLinesData.current.forEach((line) => {
          addMeasureLine(line.p1, line.p2, line.distance);
        });
        onViewerReady && onViewerReady();
      });

      return () => {
        if (osdViewer.current) osdViewer.current.destroy();
        overlays.current.forEach(({ container }) => container.remove());
        overlays.current = [];
      };
      // eslint-disable-next-line
    }, []);

    useEffect(() => {
      if (targetPoint.status === "del") {
        pointsData.current = pointsData.current.filter(
          (p) => p.id !== targetPoint.id
        );
        removeOverlayForPoint(targetPoint.id);
      } else {
        const { status, ...targetWithoutStatus } = targetPoint;
        console.log(targetWithoutStatus);
        pointsData.current = pointsData.current.map((point) =>
          point.id === targetPoint.id
            ? { ...point, ...targetWithoutStatus }
            : point
        );
      }
    }, [targetPoint]);

    useEffect(() => {
      const handler = async (e) => {
        e.preventDefaultAction = true;
        if (!osdViewer.current) return;

        const pos = osdViewer.current.viewport.pointFromPixel(e.position);
        console.log("Click coordinates:", pos); // debug

        if (activeTool === "Добавить точку") {
          const res = await addPointToBack(
            pos.x,
            pos.y,
            slideData.organ.id,
            "",
            ""
          );
          showNotification("Точка успешно добавлена", "info");
          const newP = {
            id: res.point_id,
            organid: slideData.organ.id,
            x: pos.x,
            y: pos.y,
            description: "",
            name: "",
          };
          addPoint(newP);
          pointsData.current.push(newP);
          dispatch(setTargetPoint(newP));
          dispatch(setCurrMenu("menu"));
          dispatch(setActiveTool("Курсор"));
        }

        if (
          activeTool === "Переместить точку" &&
          targetPoint.status === "move"
        ) {
          await editPointMove(targetPoint.id, pos.x, pos.y);
          dispatch(
            setTargetPoint({ ...targetPoint, x: pos.x, y: pos.y, status: "" })
          );
        }

        // --- ЛОГИКА ИЗМЕРЕНИЙ ---
        if (measureActive) {
          if (measurePoints.length === 0) {
            // Первая точка
            setMeasurePoints([pos]);

            // Создаем временную точку-маркер
            const c1 = document.createElement("div");
            c1.style.width = "10px";
            c1.style.height = "10px";
            c1.style.margin = "-3px";
            c1.style.borderRadius = "50%";
            c1.style.background = "#ff5050";
            c1.style.border = "2px solid #fff";
            c1.style.transform = "translate(-50%, -50%)";

            // Временно добавляем первую точку в оверлеи
            const tempPointOverlay = { container: c1, temp: true };
            overlays.current.push(tempPointOverlay);

            osdViewer.current.addOverlay({
              element: c1,
              location: new OpenSeadragon.Point(pos.x, pos.y),
              placement: OpenSeadragon.Placement.CENTER,
            });
          } else {
            // Вторая точка и создание измерительной линии
            const [p1] = measurePoints;
            const p2 = pos;

            // Удаляем временную точку
            const tempOverlays = overlays.current.filter((o) => o.temp);
            tempOverlays.forEach(({ container }) => {
              osdViewer.current.removeOverlay(container);
            });
            overlays.current = overlays.current.filter((o) => !o.temp);

            // Рассчитываем расстояние в миллиметрах
            const dx = p2.x - p1.x;
            const dy = p2.y - p1.y;
            const length = Math.sqrt(dx * dx + dy * dy);
            // mpp в микрометрах на пиксель, оставляем в микрометрах для точности
            const distMm = length * (mpp / 1000);
            console.log("Точки измерения:", p1, p2, "Расстояние:", distMm);
            console.log("mpp:", mpp, "Расстояние:", distMm, "мм");

            // Добавляем измерительную линию через React компонент
            addMeasureLine(p1, p2, distMm);

            // Сброс режима измерения
            setMeasurePoints([]);
            dispatch(setActiveTool("Курсор"));
          }
        }
      };

      if (osdViewer.current) {
        osdViewer.current.addHandler("canvas-click", handler);
        return () => osdViewer.current.removeHandler("canvas-click", handler);
      }
    }, [
      activeTool,
      targetPoint,
      measureActive,
      measurePoints,
      mpp,
      dispatch,
      slideData.organ.id,
      showNotification,
    ]);

    const removeOverlay = () => {
      overlays.current.forEach(({ point, container }) => {
        if (point.id === targetPoint.id) {
          osdViewer.current.removeOverlay(container);
        }
      });

      console.log("REMOVE OVERLAY", targetPoint);

      overlays.current = overlays.current.filter(
        ({ point }) => point.id !== targetPoint.id
      );
    };

    const showOverlay = () => {
      pointsData.current.forEach((point) => {
        if (point.id === targetPoint.id) {
          console.log("SHOW OVERLAY", point);
          addPoint(point);
        }
      });
    };

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
  }
);

export default AtlasViewer;
