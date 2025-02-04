// ConfirmationModal.tsx
import React from "react";
import { Modal, Button } from "react-bootstrap";
import { ConfirmationModalProps } from "../../../types/modal.type";

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  show,
  onHide,
  onConfirm,
  title,
  message,
}) => {
  return (
    <Modal show={show} onHide={onHide} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title className="modelTitle">{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer>
        <Button className="outlined-btn" onClick={onHide}>
          Cancel
        </Button>
        <Button className="danger-btn" onClick={onConfirm}>
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmationModal;
