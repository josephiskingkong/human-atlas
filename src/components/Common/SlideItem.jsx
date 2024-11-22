import { useState } from "react";
import { ClockLoader, MoonLoader } from "react-spinners";
import "../../styles/components/slide-item.css";
import { useNavigate } from "react-router-dom";
import { deleteOrganById } from "../../hooks/organs/deleteOrgan";
import ConfirmationModal from "../Modals/ConfirmationModal";

export default function SlideItem({ img, title, status, path, id, onDelete }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const navigate = useNavigate();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteOrganById(id);
      if (onDelete) {
        onDelete(id);
      }
    } catch (error) {
      console.error("Error deleting slide:", error);
      alert("Не удалось удалить слайд.");
    } finally {
      setIsDeleting(false);
      setShowConfirmModal(false);
    }
  };

  const renderStatus = () => {
    switch (status) {
      case "PROCESSING":
        return (
          <div className="slide-status">
            <ClockLoader size={16} color="#EDB337" />
            <span>В процессе</span>
          </div>
        );
      case "DONE":
        return <div></div>;
      case "ERROR":
        return (
          <div className="slide-status slide-error">
            <span>✕ Ошибка</span>
          </div>
        );
      default:
        return <span>Неизвестно</span>;
    }
  };

  const handleEdit = () => {
    navigate(path);
  };

  return (
    <div className="slide-item">
      <div className="slide-container">
        <div className="slide-content">
          <div className="slide-header">
            {renderStatus()}
            {status !== "PROCESSING" && (
              <button
                className="slide-delete-button"
                onClick={() => setShowConfirmModal(true)}
                disabled={isDeleting}
              >
                {isDeleting ? <MoonLoader size={12} color="#fff" /> : "Удалить"}
              </button>
            )}
          </div>
          <div className="slide-info">
            <div className="slide-title">{title}</div>
            {status === "DONE" && (
              <button className="slide-edit-button" onClick={handleEdit}>
                Редактировать
              </button>
            )}
          </div>
        </div>
      </div>
      <img className="slide-background" src={img} alt="img" />
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleDelete}
        title="Подтвердите удаление"
        message={`Вы уверены, что хотите удалить слайд "${title}"?`}
      />
    </div>
  );
}
