import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const handlePageClick = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  const renderPages = () => {
    const pages = [];
    const delta = 2; // сколько страниц показывать вокруг текущей

    let start = Math.max(2, currentPage - delta);
    let end = Math.min(totalPages - 1, currentPage + delta);

    // Добавляем первую страницу
    pages.push(
      <button
        key={1}
        onClick={() => handlePageClick(1)}
        disabled={currentPage === 1}
      >
        1
      </button>
    );

    // "..."
    if (start > 2) {
      pages.push(<span key="start-ellipsis">...</span>);
    }

    // Диапазон вокруг текущей
    for (let i = start; i <= end; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageClick(i)}
          disabled={i === currentPage}
        >
          {i}
        </button>
      );
    }

    // "..."
    if (end < totalPages - 1) {
      pages.push(<span key="end-ellipsis">...</span>);
    }

    // Добавляем последнюю страницу
    if (totalPages > 1) {
      pages.push(
        <button
          key={totalPages}
          onClick={() => handlePageClick(totalPages)}
          disabled={currentPage === totalPages}
        >
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  return (
    <div>
      <button
        onClick={() => handlePageClick(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Назад
      </button>

      {renderPages()}

      <button
        onClick={() => handlePageClick(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Вперёд
      </button>
    </div>
  );
};

export default Pagination;
