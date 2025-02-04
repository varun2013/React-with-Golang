import React from 'react'
import { Scanner } from "@yudiel/react-qr-scanner";
import flashMessage from '../../../utils/notifications/antdMessageUtils';

interface CommonScannerProps {
    onScan: (result: any) => void;
  }

const CommonScanner: React.FC<CommonScannerProps> = ({
    onScan,
  }) => {
  return (
    <>
     <Scanner
        onScan={onScan}
        onError={(error: any) => {
          flashMessage("Scanner error: " + error.message, "error");
        }}
        formats={[
          "aztec",
          "code_128",
          "code_39",
          "code_93",
          "codabar",
          "databar",
          "databar_expanded",
          "data_matrix",
          "ean_13",
          "ean_8",
          "itf",
          "pdf417",
          "qr_code",
          "upc_a",
          "upc_e",
        ]}
        allowMultiple={true}
        classNames={{ container: "custom-scan-height" }}
        styles={{ container: { height: "320px" } }}
      />
    </>
  )
}

export default CommonScanner