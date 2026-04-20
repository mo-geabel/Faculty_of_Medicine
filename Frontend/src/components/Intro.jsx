import React from "react";
import "./Intro.css";
import Homepage_photo from "../assets/hero1.jpg";
import members from "../assets/members.avif";
import Hero from "./Hero";
import intro from "../assets/intro.jpg";
import { Link } from "react-router-dom";
import About from "../assets/about.jpg";
import Blank from "./Blank";
import { Link as ScrollLink, animateScroll as scroll } from "react-scroll";
import "./Home.css";
const Intro = ({ announcements, achievements, userRole }) => {
  const scrollToContent = () => {
    const nextSection = document.querySelector(".intro_section");
    nextSection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="home_wrapper">
      <Hero
        photo={Homepage_photo}
        txt_btn="Discover Our Vision"
        title="Pioneering the Future of Medicine"
        subtitle="Uskudar University is dedicated to training the next generation of physicians with state-of-the-art facilities and world-class faculty equipment."
        onclick={scrollToContent}
      />

      {/* Section 1: Philosophy & Identity */}
      <section className="intro_section section_padding">
        <div className="section_container flex_layout">
          <div className="text_content">
            <h2 className="section_title">Our Academic Excellence</h2>
            <p className="section_text">
              As a thematic university in the fields of Behavioral and Health
              Sciences, Uskudar University has made significant contributions to
              higher education since its establishment. Our Faculty of Medicine
              is planned at the highest level of infrastructure to ensure
              future physicians are trained as both compassionate practitioners
              and rigorous scientists.
            </p>
            <Link className="premium_link" to="/assistant">Explore Our Assistants</Link>
          </div>
          <div className="image_content">
            <img src={intro} alt="Faculty Medical Suite" className="rounded_image" />
          </div>
        </div>
      </section>

      {/* Section 2: Strategic Pillars Grid */}
      <section className="pillars_section section_padding alt_bg">
        <div className="section_container">
          <h2 className="section_title centered">Foundation of Care</h2>
          <div className="pillars_grid">
            <div className="pillar_card">
              <div className="pillar_img">
                <img src={members} alt="Faculty Members" />
              </div>
              <div className="pillar_info">
                <h3>Respected Faculty</h3>
                <p>Learn from international leaders in medical research and clinical surgery.</p>
                <Link to="/faculty-member">Meet the Team</Link>
              </div>
            </div>
            
            <div className="pillar_card">
              <div className="pillar_img">
                <img src={About} alt="Department" />
              </div>
              <div className="pillar_info">
                <h3>State-of-the-art Labs</h3>
                <p>Innovative research facilities focused on the healthcare landscape of tomorrow.</p>
                <Link to="/department-info">Department Info</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Clinical Pulse (Glass Dashboard) */}
      <section className="dashboard_section section_padding">
        <div className="section_container">
          <div className="glass_panel">
            <div className="dashboard_header">
              <h2 className="section_title">Clinical Pulse</h2>
              <p>Live updates from our academic departments</p>
            </div>
            
            <div className="dashboard_grid">
              <div className="update_box">
                <div className="box_header">
                  <h3>Announcements</h3>
                  <Link to="/announcement">View All</Link>
                </div>
                <div className="update_list">
                  {announcements.slice(0, 3).map((item, idx) => (
                    <div className="update_item" key={idx}>
                      <span className="dot"></span>
                      <div>
                        <h4>{item.title}</h4>
                        <p>{item.department}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="update_box">
                <div className="box_header">
                  <h3>Achievements</h3>
                  <Link to="/announcement">View All</Link>
                </div>
                <div className="update_list">
                  {achievements.slice(0, 3).map((item, idx) => (
                    <div className="update_item" key={idx}>
                      <span className="star">★</span>
                      <h4>{item.title}</h4>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Emergency Quick Action */}
      <section className="emergency_banner">
        <div className="emergency_content">
          <h2>Medical Emergency Response</h2>
          <p>Real-time bed availability and emergency status monitoring.</p>
          <Link to="/emergency" className="emergency_btn">Open Live Status</Link>
        </div>
      </section>
    </div>
  );
};

export default Intro;
