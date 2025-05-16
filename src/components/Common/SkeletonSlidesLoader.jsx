import React from "react";
import "../../styles/layout/admin-menu.css";

export default function SkeletonSlidesLoader({ count = 5 }) {
  return (
    <ul className="skeleton-list">
      {Array.from({ length: count }).map((_, index) => (
        <li key={index} className="skeleton-slide-item" />
      ))}
    </ul>
  );
}