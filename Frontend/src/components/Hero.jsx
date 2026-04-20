import React, { useState } from "react";
import "./Hero.css";

import Button from "./Button";
const Hero = ({ photo, txt_btn, title, onclick, subtitle }) => {
  return (
    <div className="hero_section">
      <div className="hero_bg">
        <img src={photo} alt="Background" />
        <div className="hero_overlay"></div>
      </div>
      
      <div className="hero_content">
        <div className="hero_text_box">
          <h1 className="hero_title">{title}</h1>
          {subtitle && <p className="hero_subtitle">{subtitle}</p>}
          <div className="hero_actions">
            <button className="primary_hero_btn" onClick={onclick}>
              {txt_btn}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
