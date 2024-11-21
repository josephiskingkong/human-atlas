import { useParams } from "react-router-dom";
import AdminPageLayout from "./AdminPageLayout";
import SlideItem from "../../components/Common/SlideItem";

import { useEffect, useState } from "react";
import { getOrgansByCategoryId } from "../../hooks/organs/getOrgan";
import SkeletonSlidesLoader from "../../components/Common/SkeletonSlidesLoader";

export default function SlidesPage() {
  const { categoryid } = useParams();
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
//   const [showModal, setShowModal] = useState(false);
  const [notFound, setNotFound] = useState(null);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const data = await getOrgansByCategoryId(categoryid);
        if (data.length > 0) {
          setSlides(data);
        } else {
          setNotFound("Ничего не найдено :(");
        }
      } catch (err) {
        setError(err.message || "Unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchSlides();
  }, [categoryid]);

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
        <button className="admin-add-button" /* </div>onClick={() => setShowModal(true) */>
          + Добавить слайд
        </button>
        {notFound ? (
          <div className="error">{notFound}</div>
        ) : (
          <div className="slides-grid">
            {slides.map((slide, index) => (
              <SlideItem
                key={slide.id}
                title={slide.name}
                status={slide.status}
                img={`https://tiles.humanatlas.top/${slide.id}/${slide.id}_files/9/0_0.webp`}
                path={`/slide/${slide.id}`}
              />
            ))}
          </div>
        )}
      </div>
    </AdminPageLayout>
  );
}
