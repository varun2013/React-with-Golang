import React from "react";
import { Modal } from "react-bootstrap";
import { ModalProps } from "../../../types/modal.type";

const CommonModal: React.FC<ModalProps> = ({
  show,
  onHide,
  title,
  children,
}) => {
  return (
    <Modal show={show} onHide={onHide} backdrop="static" keyboard={false}  size="lg">
      <Modal.Header closeButton>
        <Modal.Title className="modelTitle">{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{children}</Modal.Body>
    </Modal>
  );
};

export default CommonModal;
