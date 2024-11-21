import React from "react";
import { Link, useLocation } from "react-router-dom";
import '../../styles/components/common.css';

function Breadcrumbs() {
  const location = useLocation();

  const pathSegments = location.pathname.split("/").filter(Boolean);

  const segmentNames = {
    "admin": "Админ-панель",
    "slide": "Слайд",
    "categories": "Разделы"
  };

  const crumbs = pathSegments.map((segment, index) => {
    const path = `/${pathSegments.slice(0, index + 1).join("/")}`;
    const isLast = index === pathSegments.length - 1;
    const name = segmentNames[segment] || decodeURIComponent(segment);

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