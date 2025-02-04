import React from "react";
import { BarcodeScannerProps } from "../../../types/kit-register.type";
import CommonScanner from "../../common/scanner/Scanner";

export const BarcodeScanner: React.FC<BarcodeScannerProps> = ({
  onScan,
  onCancel,
}) => {
  return (
    <>
      <div className="d-flex justify-content-center">
        <CommonScanner onScan={onScan} />
      </div>

      <div className="mt-5 d-flex justify-content-end">
        <button className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </>
  );
};
