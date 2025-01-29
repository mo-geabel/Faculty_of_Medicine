import React from "react";
import "./Home.css";
import Hero from "../../public/assets/Hero1.jpg";
import { Link } from "react-router-dom";
const Home = () => {
  return (
    <div className="container">
      <div className="item-1">
        <div className="title">
          <p>Announcement </p>
          <Link to={"/announcement"}>See More</Link>
        </div>
        <div className="card">
          <div className="photo">
            <img src={Hero} alt="" />
          </div>
          <div className="card-content">hello</div>
        </div>
        <div className="card">
          <div className="photo">
            <img src={Hero} alt="" />
          </div>
          <div className="card-content">hello</div>
        </div>
      </div>
      <div className="item-2">
        <div className="title">
          <p>Achievments </p>
          <Link to={"/announcement"}>See More</Link>
        </div>
        <div className="card">
          <div className="photo">
            <img src={Hero} alt="" />
          </div>
          <div className="card-content">hello</div>
        </div>
        <div className="card">
          <div className="photo">
            <img src={Hero} alt="" />
          </div>
          <div className="card-content">hello</div>
        </div>
      </div>
    </div>
  );
};

export default Home;
