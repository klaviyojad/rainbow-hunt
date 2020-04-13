import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import FocusTrap from 'focus-trap-react';

const Modal = props => {
    const { isModalOpen, setIsModalOpen, size = 'medium', toggleScroll, children } = props;

    const toggleModalOpen = () => {
        setIsModalOpen(false);
        toggleScroll();
    };

    return ReactDOM.createPortal(
        <div>
            {isModalOpen && (
                <FocusTrap>
                    <div
                        role="presentation"
                        className="modal-overlay"
                        onKeyDown={e => {
                            if (e.key === 'Escape') {
                                toggleModalOpen();
                            }
                        }}
                    >

                        <div className={`modal-content-container modal-${size}`}>

                            <div className="modal-topbar">
                                <span
                                    className="Icon"
                                    role="button"
                                    aria-label="Close Modal"
                                    tabIndex={0}
                                    onClick={toggleModalOpen}
                                    onKeyPress={e => {
                                        if (e.key === 'Enter') {
                                            toggleModalOpen();
                                        }
                                    }}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20px"
                                        height="20px"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="#000000"
                                        strokeWidth="2"
                                        strokeLinecap="square"
                                        strokeLinejoin="inherit"
                                    >
                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                    </svg>
                                </span>
                            </div>
                            <div className="modal-content">{children}</div>
                        </div>

                    </div>
                </FocusTrap>
            )}
        </div>,
        document.getElementById('modalAnchor')
    );
};

Modal.propTypes = {
    isModalOpen: PropTypes.bool.isRequired,
    setIsModalOpen: PropTypes.func.isRequired,
    size: PropTypes.oneOf(['small', 'medium', 'large']),
    toggleScroll: PropTypes.func.isRequired
};

export { Modal };
