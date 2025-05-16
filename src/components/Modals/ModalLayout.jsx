import React from "react";
import "../../styles/components/modal.css";

export default function ModalLayout({ title, children, onClose, className }) {
  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onPointerDown={handleOverlayClick}>
      <div className={`modal-container ${className || ""}`}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="close-button" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="modal-content">{children}</div>
      </div>
    </div>
  );
}