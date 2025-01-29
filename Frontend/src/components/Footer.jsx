import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <div className="footer">
      <footer>
        <div className="footer-content">
          <div className="footer-section about">
            <h4>About Us</h4>
            <p>
              Your company description goes here. Briefly talk about your
              mission and values.
            </p>
          </div>

          <div className="footer-section contact-info">
            <h4>Contact</h4>
            <p>Email: contact@yourcompany.com</p>
            <p>Phone: +1 (123) 456-7890</p>
          </div>

          <div className="footer-section social-media">
            <h4>Follow Us</h4>
            <a href="#">Facebook</a>
            <a href="#">Twitter</a>
            <a href="#">Instagram</a>
          </div>

          <div className="footer-section footer-links">
            <h4>Quick Links</h4>
            <ul>
              <li>
                <a href="/department-info">About Us</a>
              </li>
              <li>
                <a href="/contact">Contact</a>
              </li>
              <li>
                <a href="/privacy-policy">Privacy Policy</a>
              </li>
              <li>
                <a href="/terms-of-service">Terms of Service</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2024 Mohammed Geabel. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
