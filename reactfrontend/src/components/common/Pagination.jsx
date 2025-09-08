import React from 'react';

const Pagination = ({ currentPage, pageSize, total, onPageChange, onPageSizeChange }) => {
    const totalPages = Math.ceil(total / pageSize);

    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        pages.push(1);

        let startPage = Math.max(2, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 3);

        if (endPage === totalPages - 1) {
            startPage = Math.max(2, endPage - maxVisiblePages + 3);
        }

        if (startPage > 2) {
            pages.push('...');
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        if (endPage < totalPages - 1) {
            pages.push('...');
        }

        if (totalPages > 1) {
            pages.push(totalPages);
        }

        return pages;
    };

    const handlePrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    return (
        <div className="pagination-container">
            <div className="pagination-controls">
                <button
                    className="pagination-button"
                    onClick={handlePrevious}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>

                <div className="pagination-pages">
                    {getPageNumbers().map((page, index) => (
                        <button
                            key={index}
                            className={`pagination-page ${page === currentPage ? 'active' : ''}`}
                            onClick={() => page !== '...' && onPageChange(page)}
                            disabled={page === '...'}
                        >
                            {page}
                        </button>
                    ))}
                </div>

                <button
                    className="pagination-button"
                    onClick={handleNext}
                    disabled={currentPage === totalPages || totalPages === 0}
                >
                    Next
                </button>
            </div>

            <div className="page-size-selector">
                <label htmlFor="pageSize">Items per page:</label>
                <select
                    id="pageSize"
                    value={pageSize}
                    onChange={(e) => onPageSizeChange(Number(e.target.value))}
                >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                </select>
            </div>
        </div>
    );
};

export default Pagination;