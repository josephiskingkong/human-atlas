import React, { useRef, useState } from "react";
import "../../styles/components/modal.css";
import { addOrgan } from "../../hooks/organs/addOrgan";
import { MoonLoader } from "react-spinners";
import { useNotification } from "../../context/NotificationContext";

export default function AddSlideModal({ onClose, onAddSlide, categoryId }) {
  const modalRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState("Выберите файл .svs");
  const { showNotification } = useNotification();

  const handleOverlayClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFileName(file ? file.name : "Выберите файл .svs");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const slideName = e.target.elements.slideName.value.trim();
    const file = e.target.elements.fileInput.files[0];

    if (!slideName || !file) {
      showNotification('Введите название и выберите файл', 'error')
      return;
    }

    const fileExtension = file.name.split(".").pop().toLowerCase();
    if (fileExtension !== "svs") {
      showNotification('Введите файл с расширением .svs', 'error')
      return;
    }

    const formData = new FormData();
    formData.append("name", slideName);
    formData.append("categoryid", categoryId);
    formData.append("file", file);

    setLoading(true);
    try {
      const newSlide = await addOrgan(formData);
      if (newSlide) {
        onAddSlide(newSlide);
        onClose();
        showNotification('Слайд успешно загружен', 'info')
      } else {
        showNotification('Слайд не добавлен, проверьте данные', 'error')
      }
    } catch (err) {
      console.error("Error adding slide:", err);
      showNotification('Ошибка при добавлении слайда', 'error')
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-container" ref={modalRef}>
        <div className="modal-header">
          <h2>Добавить слайд</h2>
          <button className="close-button" onClick={onClose}>
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="slideName">Название слайда</label>
            <input id="slideName" type="text" placeholder="Введите название" />
          </div>
          <div className="form-group">
            <div className="file-input-wrapper">
              <input
                id="fileInput"
                type="file"
                accept=".svs"
                className="hidden-file-input"
                onChange={handleFileChange}
              />
              <div className="file-input-label">
                <button
                  type="button"
                  className="file-input-button"
                  onClick={() => document.getElementById("fileInput").click()}
                >
                  Обзор
                </button>
                <span className="file-input-text">{selectedFileName}</span>
              </div>
            </div>
          </div>
          <div className="form-group">
            {loading ? (
              <button type="submit" className="submit-button">
                <MoonLoader size={14} color="#fff" />
              </button>
            ) : (
              <button type="submit" className="submit-button">
                Добавить
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}