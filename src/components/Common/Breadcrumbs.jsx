import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import "../../styles/components/common.css";
import { getCategoryById } from "../../hooks/categories";
import BreadcrumbSkeletonLoader from "../Common/BreadcrumbSkeletonLoader";

function Breadcrumbs() {
  const location = useLocation();
  const { categoryid } = useParams();
  const [categoryName, setCategoryName] = useState(null);
  const [loading, setLoading] = useState(true);

  const pathSegments = location.pathname.split("/").filter(Boolean);

  const segmentNames = {
    admin: "Админ-панель",
    slide: "Слайд",
    categories: "Разделы",
    "human-atlas": "Гисто Атлас",
    "profile": "Профиль"
  };

  useEffect(() => {
    if (categoryid && !isNaN(categoryid)) {
      getCategoryById(categoryid)
        .then((category) => {
          if (category) {
            setCategoryName(category.name);
          }
        })
        .catch(() => setCategoryName(null))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [categoryid]);

  if (loading) {
    return <BreadcrumbSkeletonLoader />;
  }

  const crumbs = pathSegments.map((segment, index) => {
    const path = `/${pathSegments.slice(0, index + 1).join("/")}`;
    const isLast = index === pathSegments.length - 1;

    let name = segmentNames[segment] || decodeURIComponent(segment);
    if (isLast && categoryName && segment === categoryid) {
      name = categoryName;
    }

    return (
      <React.Fragment key={path}>
        {isLast ? (
          <span className="breadcrumb-active">{name}</span>
        ) : (
          <Link to={path} className="breadcrumb-link">{name}</Link>
        )}
        {!isLast && <span className="breadcrumb-separator"> &gt; </span>}
      </React.Fragment>
    );
  });

  return <nav className="breadcrumbs">{crumbs}</nav>;
}

export default Breadcrumbs;