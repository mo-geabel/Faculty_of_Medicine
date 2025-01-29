import React from "react";
import "./Popup.css";

const Popup = ({ show, onClose, title, content }) => {
  if (!show) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <div className="popup-header">
          <h3>{title}</h3>
          <button className="popup-close" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="popup-content">
          <p>{content}</p>
        </div>
      </div>
    </div>
  );
};

export default Popup;
