import React from "react";
import "./Pop.css"; // Import your CSS styles
import { format } from "date-fns"; // Import date-fns to format the dates

const Pop = ({ isOpen, onClose, assistant }) => {
  if (!isOpen) return null; // Don't render the Pop if it's not open

  // Helper function to format the date or return "Not set" if null
  const formatDateTime = (date) => {
    return date ? format(new Date(date), "MMMM d, yyyy h:mm aa") : "Not set";
  };

  return (
    <div className="Pop-overlay">
      <div className="Pop-content">
        <button className="close-button" onClick={onClose}>
          X
        </button>
        <img src={assistant.img} alt={assistant.name} />
        <h2>{assistant.name}</h2>

        <p>
          <strong>Phone:</strong> {assistant.phone}
        </p>
        <p>
          <strong>Email:</strong> {assistant.email}
        </p>
        <p>
          <strong>Address:</strong> {assistant.address}
        </p>
      </div>
    </div>
  );
};

export default Pop;
