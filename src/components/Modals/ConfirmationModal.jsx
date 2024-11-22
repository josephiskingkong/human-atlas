import React from "react";
import "../../styles/components/confirmation-modal.css";

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container confirmation">
        <h2>{title}</h2>
        <p>{message}</p>
        <div className="modal-actions">
          <button className="modal-button cancel-button" onClick={onClose}>
            Отмена
          </button>
          <button className="modal-button confirm-button" onClick={onConfirm}>
            Удалить
          </button>
        </div>
      </div>
    </div>
  );
}
