
import React from 'react';
import { Select } from 'antd';


interface StatusSelectProps {
  value: string;
  item: any;
  handleDropdownStatusChange: (patientId: number, newStatus: string) => void;
  setReceivedConfirmationModalOpen: (open: boolean) => void;
  setReceivedPatientData: any;
}

const StatusSelect: React.FC<StatusSelectProps> = ({
  value,
  item,
  handleDropdownStatusChange,
  setReceivedConfirmationModalOpen,
  setReceivedPatientData
}) => {
  const handleChange = (newStatus: string) => {
    if (newStatus === "Received") {
      setReceivedConfirmationModalOpen(true);
      setReceivedPatientData(item)
    } else {
      handleDropdownStatusChange(item.id, newStatus);
    }
  };

  const getStatusOptions = () => {
    const statuses = value === "Not-Received"
      ? ["Not-Received", "Received", "Send", "Reject"]
      : ["Received", "Send", "Reject"];

    return statuses.map(status => ({
      value: status,
      label: status === "Send" ? "Send to lab" : status.charAt(0).toUpperCase() + status.slice(1)
    }));
  };

  return (
    <Select
      value={value === "Send" ? "Sent to lab" : value}
      onChange={handleChange}
      disabled={value !== "Not-Received" && value !== "Received"}
      size="small"
      style={{ width: '150px' }}
      className={value.toLowerCase().replace("-", "_")}
      options={getStatusOptions()}
    />
  );
};

export default StatusSelect;