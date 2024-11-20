import React, { useState } from "react";

export default function TogglePointsCheckbox({ togglePointsVisibility }) {
  const [pointsHidden, setPointsVisible] = useState(false);

  const handleToggle = () => {
    setPointsVisible(!pointsHidden);
    togglePointsVisibility(!pointsHidden);
  };

  return (
    <label className="toggle-points-checkbox float-menu-button">
      <input
        type="checkbox"
        checked={pointsHidden}
        onChange={handleToggle}
      />
      <span className="custom-checkbox"></span>
      <span className="checkbox-label">Скрыть точки</span>
    </label>
  );
}