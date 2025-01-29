import React, { useState } from "react";
import "./Hero.css";

import Button from "./Button";
const Hero = ({ photo, txt_btn, title, onclick }) => {
  return (
    <div className="hero">
      <div className="img">
        <img src={photo} alt="" />
      </div>
      <div className="text">
        <h1>{title} </h1>
        <div className="btn-container">
          <Button onClick={onclick} text={txt_btn} />
        </div>
      </div>
    </div>
  );
};

export default Hero;
