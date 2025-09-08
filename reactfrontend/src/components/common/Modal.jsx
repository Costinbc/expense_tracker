import React, { useEffect } from 'react';

const Modal = ({
                   isOpen,
                   onClose,
                   title,
                   children,
                   size = 'medium',
                   showFooter = true,
                   onConfirm,
                   danger = false,
                   isLoading = false
               }) => {
    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === 'Escape' && isOpen && !isLoading) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);

        if (isOpen) {
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'auto';
        };
    }, [isOpen, onClose, isLoading]);

    if (!isOpen) return null;

    let sizeClass = 'modal-medium';
    if (size === 'small') sizeClass = 'modal-small';
    if (size === 'large') sizeClass = 'modal-large';

    return (
        <div className="modal-overlay" onClick={!isLoading ? onClose : undefined}>
            <div
                className={`modal-container ${sizeClass}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-header">
                    <h3 className="modal-title">{title}</h3>
                    {!isLoading && (
                        <button
                            className="modal-close"
                            onClick={onClose}
                            aria-label="Close"
                        >
                            &times;
                        </button>
                    )}
                </div>

                <div className="modal-body">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;