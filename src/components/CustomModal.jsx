import React from 'react';
import Modal from 'react-modal'
import '../styles/Modal.css';

Modal.setAppElement('#root') // importante para acessibilidade

export default function CustomModal(props) {
  const { 
    shouldClose, 
    isOpen, 
    onRequestClose,
    onAfterClose,
    children,
    hasBg,
    hasDelay,
    footer,
    contentRef,
    } = props

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      onAfterClose={onAfterClose}
      shouldCloseOnOverlayClick={shouldClose}
      shouldCloseOnEsc={shouldClose}
      shouldFocusAfterRender={false}
      shouldReturnFocusAfterClose={true}
      className={`modal-content-base ${hasDelay ? 'delay' : ''}`}
      overlayClassName="modal-overlay"
      closeTimeoutMS={300} // tempo da transição em ms
      contentRef={contentRef}
    >
      <div className={`modal-content ${!hasBg ? 'no-bg' : ''}`}>{children}</div>
      {footer && (<div className='modal-footer'>{footer}</div>)}
    </Modal>
  )
}