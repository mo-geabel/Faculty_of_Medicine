import React from "react";
import "./Pop.css"; // Import your CSS styles
import { format } from "date-fns"; // Import date-fns to format the dates
import a_logo from "../assets/a_logo.png";

const Pop = ({ isOpen, onClose, assistant }) => {
  if (!isOpen) return null; // Don't render the Pop if it's not open

  // Helper function to format the date or return "Not set" if null
  const formatDateTime = (date) => {
    return date ? format(new Date(date), "MMMM d, yyyy h:mm aa") : "Not set";
  };

  return (
    <div className="pop_overlay" onClick={onClose}>
      <div className="pop_glass_card" onClick={(e) => e.stopPropagation()}>
        <button className="pop_close_btn" onClick={onClose}>
          ✕
        </button>
        
        <div className="pop_header">
          <div className="pop_avatar">
            <img src={a_logo} alt={assistant.name} />
          </div>
          <h2 className="pop_name">{assistant.name}</h2>
          <p className="pop_tag">Medical Faculty Professional</p>
        </div>

        <div className="pop_body">
          <div className="pop_info_item">
            <span className="info_label">Direct Line</span>
            <p className="info_value">{assistant.phone || "No phone provided"}</p>
          </div>
          <div className="pop_info_item">
            <span className="info_label">Academic Email</span>
            <p className="info_value">{assistant.email}</p>
          </div>
          <div className="pop_info_item">
            <span className="info_label">Office Address</span>
            <p className="info_value">{assistant.address || "Main Campus Medical Center"}</p>
          </div>
        </div>
        
        <div className="pop_footer">
          <button className="pop_action_btn" onClick={onClose}>Close Profile</button>
        </div>
      </div>
    </div>
  );
};

export default Pop;
