import React from "react";
import "../../styles/components/skeleton-horizontal-loader.css";

export default function SkeletonHorizontalLoader({ count = 5 }) {
  return (
    <ul className="skeleton-list">
      {Array.from({ length: count }).map((_, index) => (
        <li key={index} className="skeleton-item" />
      ))}
    </ul>
  );
}