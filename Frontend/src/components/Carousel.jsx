import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // Ensure Bootstrap's JS is included
import "./Carousel.css";

const Carousel = ({ img, img2, img3 }) => {
  return (
    <div id="carouselExampleIndicators" className="carousel slide">
      <ol className="carousel-indicators">
        <li
          data-target="#carouselExampleIndicators"
          data-bs-slide-to="0"
          className="active"
        ></li>
        <li data-target="#carouselExampleIndicators" data-bs-slide-to="1"></li>
        <li data-target="#carouselExampleIndicators" data-bs-slide-to="2"></li>
      </ol>
      <div className="carousel-inner">
        <div className="carousel-item active">
          <img className="d-block w-100" src={img} alt="First slide" />
          <div className="carousel-caption d-none d-md-block">
            <h5>See our First Slide</h5>
            <p>Description for the first slide.</p>
          </div>
        </div>
        <div className="carousel-item">
          <img className="d-block w-100" src={img2} alt="Second slide" />
          <div className="carousel-caption d-none d-md-block">
            <h5>See our Second Slide</h5>
            <p>Description for the second slide.</p>
          </div>
        </div>
        <div className="carousel-item">
          <img className="d-block w-100" src={img3} alt="Third slide" />
          <div className="carousel-caption d-none d-md-block">
            <h5>See our Third Slide</h5>
            <p>Description for the third slide.</p>
          </div>
        </div>
      </div>
      <a
        className="carousel-control-prev"
        href="#carouselExampleIndicators"
        role="button"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </a>
      <a
        className="carousel-control-next"
        href="#carouselExampleIndicators"
        role="button"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </a>
    </div>
  );
};

export default Carousel;
