import React from "react";
import ReactDOM from "react-dom";
import "./Style/ConfirmModal.css";

export default function ConfirmModal({ visible, message, onConfirm, onCancel }) {
  if (!visible) return null;

  return ReactDOM.createPortal(
    <div className="confirm-modal-overlay">
      <div className="confirm-modal">
        <p>{message || "Are you sure?"}</p>
        <div className="modal-buttons">
          <button className="modal-btn confirm-btn" onClick={onConfirm}>
            Yes
          </button>
          <button className="modal-btn cancel-btn" onClick={onCancel}>
            No
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
