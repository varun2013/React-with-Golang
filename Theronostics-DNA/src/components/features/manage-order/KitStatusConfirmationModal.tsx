import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

interface ConfirmationModalProps {
  show: boolean;
  onHide: () => void;
  onConfirm: (reason: string) => void;
  title: string;
  message: string;
}

const KitStatusConfirmationModal: React.FC<ConfirmationModalProps> = ({
  show,
  onHide,
  onConfirm,
  title,
  message,
}) => {
  const [reason, setReason] = useState<string>("");
  const [validationError, setValidationError] = useState<string>("");

  const handleReasonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputReason = e.target.value;
    setReason(inputReason);

    // Validate reason length
    if (inputReason.length < 5) {
      setValidationError("Reason must be at least 5 characters long");
    } else if (inputReason.length > 100) {
      setValidationError("Reason must not exceed 100 characters");
    } else {
      setValidationError("");
    }
  };

  const handleConfirm = () => {
    // Check if reason is valid before confirming
    if (reason.length >= 5 && reason.length <= 100) {
      onConfirm(reason);
    } else {
      setValidationError("Please provide a valid reason (5-100 characters)");
    }
  };

  return (
    <Modal show={show} onHide={onHide} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title className="modelTitle">{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{message}</p>
        <Form.Group controlId="confirmationReason">
          <Form.Label>
            Reason for Rejection <span className="text-danger ms-1">*</span>
          </Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={reason}
            onChange={handleReasonChange}
            placeholder="Please provide a reason (5-100 characters)"
            isInvalid={!!validationError}
          />
          <Form.Control.Feedback type="invalid">
            {validationError}
          </Form.Control.Feedback>
          <div className="text-muted mt-1">{reason.length}/100 characters</div>
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button className="outlined-btn" onClick={onHide}>
          Cancel
        </Button>
        <button
          className={
            !!validationError || reason.length < 5
              ? "disabled-btn"
              : "danger-btn"
          }
          onClick={handleConfirm}
          disabled={!!validationError || reason.length < 5}
        >
          Confirm
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default KitStatusConfirmationModal;
