import React from 'react';

const PaginationControls = ({ pagination, onPageChange }) => {
  if (pagination.pages <= 1) return null;

  return (
    <div className="pagination">
      <button
        className="button secondary"
        disabled={pagination.page === 1}
        onClick={() => onPageChange((current) => ({ ...current, page: current.page - 1 }))}
      >
        Previous
      </button>
      <span>Page {pagination.page} of {pagination.pages}</span>
      <button
        className="button secondary"
        disabled={pagination.page === pagination.pages}
        onClick={() => onPageChange((current) => ({ ...current, page: current.page + 1 }))}
      >
        Next
      </button>
    </div>
  );
};

export default PaginationControls;
