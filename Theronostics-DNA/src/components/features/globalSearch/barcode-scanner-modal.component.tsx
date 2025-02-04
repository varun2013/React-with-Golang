import React from "react";
import { Button, Modal } from "react-bootstrap";
import CommonScanner from "../../common/scanner/Scanner";
interface BarcodeScannerModalProps {
  show: boolean;
  onHide: () => void;
  handleScan: (result: any) => void;
}
const BarcodeScannerModal: React.FC<BarcodeScannerModalProps> = ({ show, onHide, handleScan }) => {
  return (
    <>
      <Modal
        show={show}
        onHide={onHide}
        backdrop="static"
        keyboard={false}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title className="modelTitle">Scan Barcode</Modal.Title>
        </Modal.Header>
        <Modal.Body>
         <CommonScanner onScan={handleScan} />

          <div className="d-flex justify-content-end w-100 btn_wrap mt-3">
            <Button className="outlined-btn" onClick={() => onHide()}>
              Cancel
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default BarcodeScannerModal;
