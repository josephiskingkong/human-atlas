import React, { useState } from "react";
import ModalLayout from "./ModalLayout";
import '../../styles/components/confirmation-modal.css'

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  actionName,
  actionColor
}) {
  if (!isOpen) return null;

  return (
    <ModalLayout title={title} onClose={onClose}>
      <p>{message}</p>
      <div className="modal-actions">
        <button className={`modal-button cancel-button`} onClick={onClose}>
          Отмена
        </button>
        <button className={`modal-button confirm-button ${actionColor}`} onClick={onConfirm}>
          {actionName}
        </button>
      </div>
    </ModalLayout>
  );
}