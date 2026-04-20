import React from "react";
import "./Footer.css";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer_main">
      <div className="footer_container">
        {/* Brand Section */}
        <div className="footer_section footer_brand">
          <div className="footer_logo_text">
            Faculty<span>Portal</span>
          </div>
          <p className="brand_description">
            Empowering the next generation of medical professionals through 
            innovative digital learning and scholarly excellence.
          </p>
          <div className="social_gateways">
            <a href="#" aria-label="Facebook">FB</a>
            <a href="#" aria-label="Twitter">TW</a>
            <a href="#" aria-label="LinkedIn">LN</a>
            <a href="#" aria-label="Instagram">IG</a>
          </div>
        </div>

        {/* Academic Hub */}
        <div className="footer_section">
          <h4>Academic Hub</h4>
          <ul className="footer_links">
            <li><Link to="/quizz">Scholarly Assessment</Link></li>
            <li><Link to="/calendar">Academic Calendar</Link></li>
            <li><Link to="/assistant">The Collective</Link></li>
            <li><Link to="/">Announcement Feed</Link></li>
          </ul>
        </div>

        {/* Institutional */}
        <div className="footer_section">
          <h4>Institutional</h4>
          <ul className="footer_links">
            <li><Link to="/department-info">Research Laboratory</Link></li>
            <li><Link to="/department-info">Medical Library</Link></li>
            <li><Link to="/">Faculty Board</Link></li>
            <li><Link to="/privacy-policy">Privacy & Ethics</Link></li>
          </ul>
        </div>

        {/* Contact Gateway */}
        <div className="footer_section">
          <h4>Support Gateway</h4>
          <div className="contact_card_minimal">
            <div className="contact_item">
              <div className="contact_icon_box">📍</div>
              <div className="contact_text">
                <strong>Medical Campus</strong>
                Administrative Building, North Sector
              </div>
            </div>
            <div className="contact_item">
              <div className="contact_icon_box">✉️</div>
              <div className="contact_text">
                <strong>Official Inquiry</strong>
                support@faculty.med.edu
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer_bottom_refined">
        <div className="bottom_content">
          <p className="copyright_text">
            &copy; {new Date().getFullYear()} Faculty of Medicine Portal. All Academic Rights Reserved.
          </p>
          <div className="legal_links">
            <a href="#">Terms of Service</a>
            <a href="#">Ethics Board</a>
            <a href="#">Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
