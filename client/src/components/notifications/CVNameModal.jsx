import React, { useState } from "react";
import "./CVNameModal.css";

export default function CVNameModal({ defaultName = "", onSave, onClose }) {
  const [cvName, setCvName] = useState(defaultName);

  const handleSave = () => {
    if (!cvName.trim()) {
      alert("CV name cannot be empty!");
      return;
    }
    onSave(cvName.trim());
  };

  return (
    <div className="cv-modal-overlay">
      <div className="cv-modal">
        <h2>Enter CV Name</h2>
        <input
          type="text"
          value={cvName}
          onChange={(e) => setCvName(e.target.value)}
          placeholder="Enter CV name"
          className="cv-name-input"
        />
        <div className="cv-modal-buttons">
          <button className="cv-save-btn" onClick={handleSave}>Save</button>
          <button className="cv-cancel-btn" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
