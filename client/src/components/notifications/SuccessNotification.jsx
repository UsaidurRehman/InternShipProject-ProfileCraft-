import React, { useEffect } from "react";
import "./SuccessNotification.css";

export default function SuccessNotification({ message, duration = 1000, onClose }) {

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className="success-notification">
      <span>{message}</span>
      <button className="close-btn" onClick={onClose}>
        X
      </button>
    </div>
  );
}
