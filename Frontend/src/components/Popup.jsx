import React from "react";
import "./Popup.css";

const Popup = ({ show, onClose, title, content }) => {
  if (!show) return null;

  return (
    <div className="popup_overlay" onClick={onClose}>
      <div className="popup_glass_box" onClick={(e) => e.stopPropagation()}>
        <div className="popup_header_bar">
          <h3 className="popup_title_text">{title}</h3>
          <button className="popup_close_icon" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="popup_body_content">
          <div className="popup_text_wrapper">{content}</div>
        </div>
        <div className="popup_footer_bar">
          <button className="popup_primary_btn" onClick={onClose}>Close Details</button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
