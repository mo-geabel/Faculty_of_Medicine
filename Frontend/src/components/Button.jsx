import React from "react";
import "./Button.css"; // Import your CSS

const Button = ({ text, onClick, disabled }) => {
  return (
    <div className="btn1">
      <button className="btn1" onClick={onClick}>
        {text}
      </button>
    </div>
  );
};

export default Button;
