import React, { useCallback, useState } from "react";
import { IPostOrderViewProps } from "../../../types/manage-post-order.type";
import { useDropzone } from "react-dropzone";
import CommonButton from "../../common/button/CommonButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSave,
} from "@fortawesome/free-solid-svg-icons";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { RootState } from "../../../redux/store";
import {
  closeModal,
  patientUploadReport,
  setLoader,
} from "../../../redux/action";
import ConfirmationModal from "../../common/Modal/ConfirmationModal";
import uploadIcon from "../../../assets/images/upload-icon.svg";
import { handleFetchAllKitRegisterDetails } from "../../../pages/manage-post-back-orders/manage-post-orders.event";
import { useLocation, useNavigate } from "react-router-dom";

const UploadLabReport: React.FC<IPostOrderViewProps> = ({ selectedData }) => {
  const { page, sort, sortColumn, searchText, status, perPage } =
    useAppSelector((state: RootState) => state.kitRegister);
  const loading = useAppSelector((state: RootState) => state.loader.loader);
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const validateFile = useCallback((selectedFile: File) => {
    // Check file type (PDF or XML)
    const allowedTypes = ["application/pdf", "text/xml"];
    if (!allowedTypes.includes(selectedFile.type)) {
      setError("Only PDF and XML files are allowed");
      return false;
    }

    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (selectedFile.size > maxSize) {
      setError("File size should not exceed 10MB");
      return false;
    }

    return true;
  }, []);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      // Reset previous errors
      setError(null);

      // Take only the first file (multiple: false)
      const selectedFile = acceptedFiles[0];

      // Validate the file
      if (validateFile(selectedFile)) {
        setFile(selectedFile);
      }
    },
    [validateFile]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "application/pdf": [".pdf"],
      "text/xml": [".xml"],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const handleCancel = async () => {
    setFile(null);
    setError(null);
    await dispatch(closeModal());
  };

  const handleSubmit = async () => {
    if (file) {
      if (selectedData?.file_path) {
        setShowConfirmationModal(true);
      } else {
        // Perform upload logic here
        return handleFileUpload();
      }
    }
  };

  const handleFileUpload = async () => {
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      try {
        await dispatch(setLoader(true));
        await dispatch(patientUploadReport(formData, selectedData.id));
        handleFetchAllKitRegisterDetails(
          dispatch,
          {
            currentPage: page,
            sort,
            sortColumn,
            searchText,
            status,
            perPage,
          },
          navigate,
          location
        );
        // Reset after successful upload
        handleCancel();
      } catch (err) {
        console.error("Error updating user:", err);
        return { general: "Failed to update user" };
      } finally {
        await dispatch(setLoader(false));
      }
    }
  };

  return (
    <div className="upload-container">
      <div
        {...getRootProps()}
        className={`dropzone ${isDragActive ? "drag-active" : ""} ${
          error ? "error" : ""
        }`}
      >
        <input {...getInputProps()} />
        {/* <FontAwesomeIcon icon={faFileUpload} className="upload-icon" /> */}
        <img className="mb-2" src={uploadIcon} alt="" width={70} height={70} />
        {file ? (
          <p className="file-name">{file.name}</p>
        ) : (
          <p>
            Drag & drop PDF or XML files here,
            <br />
            <span> or click to select</span>
          </p>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="d-flex justify-content-end mt-3 gap-2">
        <CommonButton
          type="button"
          className="outlined-btn"
          text="Cancel"
          onClick={handleCancel}
        />
        <CommonButton
          type="submit"
          className={!file || !!error ? "disabled-btn" : "filled-btn"}
          text="Upload"
          icon={<FontAwesomeIcon icon={faSave} />}
          onClick={handleSubmit}
          loading={loading}
          disabled={!file || !!error}
        />
      </div>
      <ConfirmationModal
        show={showConfirmationModal}
        onHide={() => setShowConfirmationModal(false)}
        onConfirm={() => {
          setShowConfirmationModal(false);
          handleFileUpload();
        }}
        title="Confirm Report Upload"
        message={`A report for this patient already exists. Uploading a new file will replace the existing report. 
    Are you sure you want to proceed?`}
      />
    </div>
  );
};

export default UploadLabReport;
