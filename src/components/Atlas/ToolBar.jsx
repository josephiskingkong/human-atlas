import React, { useState, useEffect } from "react";
import { setActiveTool } from "../../redux/atlas/atlas-slice";

import cursor from "../../assets/images/cursor.svg";
import addPoint from "../../assets/images/add-point.svg";
import pencil from "../../assets/images/pencil.svg";
import move from "../../assets/images/move-point.svg";
import divider from "../../assets/images/divider.svg";

import "../../styles/components/toolbar.css";
import { useDispatch, useSelector } from "react-redux";

function ToolButton({ icon, name, hotkey, isActive = false, onClick }) {
  const [isHovered, setIsHovered] = useState(false);

  const modifierKey = /Mac/i.test(navigator.platform) ? "CMD" : "CTRL";

  return (
    <div
      className="tool-button-container"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button
        className={`tool-button ${isActive ? "active-tool" : ""}`}
        onClick={onClick}
        title={`${name} (${modifierKey} + ${hotkey.toUpperCase()})`}
        aria-pressed={isActive}
      >
        <img src={icon} alt={name} />
      </button>
      {isHovered && (
        <div className="tooltip">
          {name}{" "}
          <span className="hotkey-name">
            {modifierKey} + {hotkey.toUpperCase()}
          </span>
        </div>
      )}
    </div>
  );
}

export default function ToolBar() {
  const activeTool = useSelector((state) => state.atlas.activeTool);
  const dispatch = useDispatch();

  const tools = [
    { icon: cursor, name: "Курсор", hotkey: "b" },
    { icon: addPoint, name: "Добавить точку", hotkey: "p" },
    { icon: pencil, name: "Редактировать точку", hotkey: "e" },
    { icon: move, name: "Переместить точку", hotkey: "m" },
  ];

  const handleToolChange = (name) => {
    console.log(name);
    dispatch(setActiveTool(name));
  };

  const handleKeyDown = (event) => {
    const isCtrlOrCmd = event.ctrlKey || event.metaKey;
    if (!isCtrlOrCmd) return;

    const tool = tools.find((tool) => tool.hotkey === event.key.toLowerCase());
    if (tool) {
      event.preventDefault();
      handleToolChange(tool.name);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="toolbar-wrapper">
      <div className="toolbar-container">
        <div className="buttons-container">
          {tools.map((tool) => (
            <ToolButton
              key={tool.name}
              icon={tool.icon}
              name={tool.name}
              hotkey={tool.hotkey}
              isActive={activeTool === tool.name}
              onClick={() => handleToolChange(tool.name)}
            />
          ))}
        </div>
        <img src={divider} alt="divider" className="divider" />
        <button className="saveAndExit">Сохранить и выйти</button>
      </div>
    </div>
  );
}
