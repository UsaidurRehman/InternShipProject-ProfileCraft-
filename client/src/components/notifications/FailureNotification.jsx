import React, { useEffect } from "react";
import "./FailureNotification.css";

export default function FailureNotification({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 1000); // auto close after 3 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="failure-notification">
      <div className="failure-icon">❌</div>
      <div className="failure-message">{message}</div>
      <button className="failure-close" onClick={onClose}>
        X
      </button>
    </div>
  );
}
