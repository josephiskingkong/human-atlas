import { useParams } from "react-router-dom";
import AdminPageLayout from "./AdminPageLayout";
import SlideItem from "../../components/Common/SlideItem";

import { useEffect, useState, useCallback } from "react";
import { getOrgansByCategoryId } from "../../hooks/organs/getOrgan";
import SkeletonSlidesLoader from "../../components/Common/SkeletonSlidesLoader";
import AddSlideModal from "../../components/Modals/AddSlideModal";

export default function SlidesPage() {
  const { categoryid } = useParams();
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [notFound, setNotFound] = useState(null);

  const fetchSlides = useCallback(async () => {
    try {
      const data = await getOrgansByCategoryId(categoryid);
      if (data.length > 0) {
        setSlides(data);
        setNotFound(null);
      } else {
        setNotFound("Ничего не найдено :(");
      }
    } catch (err) {
      setError(err.message || "Unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }, [categoryid]);

  useEffect(() => {
    fetchSlides();
  }, [fetchSlides]);

  useEffect(() => {
    const hasProcessingSlides = slides.some(
      (slide) => slide.status === "PROCESSING"
    );

    if (hasProcessingSlides) {
      const interval = setInterval(() => {
        fetchSlides();
      }, 2500);

      return () => clearInterval(interval);
    }
  }, [slides, fetchSlides]);

  const handleAddSlide = (newSlide) => {
    setSlides((prevSlides) => [...prevSlides, newSlide]);
  };

  const handleDeleteSlide = (id) => {
    setSlides((prevSlides) => prevSlides.filter((slide) => slide.id !== id));
  };

  if (loading) {
    return (
      <AdminPageLayout title="Разделы">
        <div className="slides-grid">
          <SkeletonSlidesLoader count={6} />
        </div>
      </AdminPageLayout>
    );
  }

  if (error) {
    return (
      <AdminPageLayout title="Разделы">
        <div className="error">{error}</div>
      </AdminPageLayout>
    );
  }

  return (
    <AdminPageLayout title="Слайды">
      <div className="admin-content">
        <button className="admin-add-button" onClick={() => setShowModal(true)}>
          + Добавить слайд
        </button>
        {notFound ? (
          <div className="error">{notFound}</div>
        ) : (
          <div className="slides-grid">
            {slides.map((slide) => (
              <SlideItem
                key={slide.id}
                id={slide.id}
                title={slide.name}
                status={slide.status}
                img={`https://tiles.humanatlas.top/${slide.id}/${slide.id}_files/9/0_0.webp`}
                path={`/admin/slide/${slide.id}`}
                onDelete={handleDeleteSlide}
              />
            ))}
          </div>
        )}
      </div>
      {showModal && (
        <AddSlideModal
          onClose={() => setShowModal(false)}
          onAddSlide={handleAddSlide}
          categoryId={categoryid}
        />
      )}
    </AdminPageLayout>
  );
}
