import { useState } from "react";
import { ClockLoader, MoonLoader } from "react-spinners";
import "../../styles/components/slide-item.css";
import { useNavigate } from "react-router-dom";
import { deleteOrganById } from "../../hooks/organs/deleteOrgan";
import ConfirmationModal from "../Modals/ConfirmationModal";
import { useNotification } from "../../context/NotificationContext";
import editSlide from "../../hooks/organs/edit";
import EditSlideModal from "../Modals/EditSlideModal";

export default function SlideItem({
  img,
  title,
  status,
  path,
  id,
  categoryId,
  onEdit,
  onDelete,
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const handleEditSlide = async (id, newName, newCategoryId) => {
    try {
      await editSlide(id, newName, newCategoryId);
    } catch (error) {
      showNotification("Не удалось редактировать слайд", "error");
    } finally {
      onEdit(id, newName, newCategoryId);
      setShowEditModal(false);
    }

    showNotification("Слайд отредактирован!", "success");
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteOrganById(id);
      if (onDelete) {
        onDelete(id);
      }
    } catch (error) {
      console.error("Error deleting slide:", error);
      showNotification("Не удалось удалить слайд", "error");
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
              <>
                <button
                  className="slide-edit-button"
                  onClick={() => setShowEditModal(true)}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <MoonLoader size={12} color="#fff" />
                  ) : (
                    "Изменить"
                  )}
                </button>
                <button
                  className="slide-delete-button"
                  onClick={() => setShowConfirmModal(true)}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <MoonLoader size={12} color="#fff" />
                  ) : (
                    "Удалить"
                  )}
                </button>
              </>
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
      <EditSlideModal
        isOpen={showEditModal}
        id={id}
        categoryId={categoryId}
        slideName={title}
        onClose={() => setShowEditModal(false)}
        onSave={handleEditSlide}
      />
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleDelete}
        title="Подтвердите удаление"
        actionName="Удалить"
        actionColor="red"
        message={`Вы уверены, что хотите удалить слайд "${title}"?`}
      />
    </div>
  );
}
