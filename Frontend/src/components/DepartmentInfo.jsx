import React, { useState } from "react";
import About from "../assets/about.jpg";
import Hero from "./Hero";
import a_logo from "../assets/a_logo.png";
import { Link } from "react-router-dom";
import "./DepartmentInfo.css";
import Popup from "./Popup";

const DepartmentInfo = () => {
  const [showSeeMore, setShowSeeMore] = useState(false);
  const [showDepartmentPopup, setShowDepartmentPopup] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedLeader, setSelectedLeader] = useState(null);

  const scrollToSection = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  const Leaderships = [
    {
      id: 1,
      img: a_logo,
      name: "Professor John Smith, MD, PhD",
      postion: "Head of the Department",
      Specialization:
        "Dr. Smith is an expert in cardiology and has published extensively on heart disease and preventive cardiology. He is committed to improving patient outcomes through innovative research and education.",
    },
    {
      id: 2,
      img: a_logo,
      name: "Professor Jane Doe, MD, MPH",
      postion: "Co-Head of the Department",
      Specialization:
        "Dr. Doe specializes in public health and epidemiology. She focuses on health disparities and has led several initiatives aimed at improving healthcare access for underserved populations.",
    },
  ];

  const departments = [
    {
      name: "Pediatric Intensive Care",
      beds: 15,
      details:
        "The Pediatric Intensive Care Unit (PICU) is dedicated to providing intensive care for critically ill children, including those with severe infections, heart conditions, and post-operative care.",
    },
    {
      name: "Pediatric Hematology and Oncology",
      beds: 20,
      details:
        "This department specializes in treating children with blood disorders such as leukemia, anemia, and other hematologic conditions, as well as pediatric cancers like lymphoma and brain tumors.",
    },
    {
      name: "Emergency",
      beds: 20,
      details:
        "The Emergency department provides urgent care to patients experiencing life-threatening conditions, including accidents, heart attacks, and other medical emergencies.",
    },
    {
      name: "Pediatrics",
      beds: 50,
      details:
        "Pediatrics involves the medical care of infants, children, and adolescents. This department focuses on treating common childhood illnesses and providing preventive care.",
    },
    {
      name: "Cardiology",
      beds: 25,
      details:
        "Cardiology is the branch of medicine focused on diagnosing and treating heart conditions. This department provides care for heart diseases, arrhythmias, and other cardiovascular issues.",
    },
    {
      name: "Neurology",
      beds: 18,
      details:
        "Neurology specializes in diagnosing and treating diseases of the nervous system, including brain disorders, epilepsy, and neurodegenerative diseases.",
    },
    {
      name: "Orthopedics",
      beds: 40,
      details:
        "Orthopedics focuses on the diagnosis, treatment, and prevention of musculoskeletal system disorders, including bone fractures, joint issues, and spinal disorders.",
    },
  ];

  const handleSeeMore = () => {
    setShowSeeMore(true);
  };

  const handleDepartmentPopup = (department) => {
    setSelectedDepartment(department);
    setShowDepartmentPopup(true);
    setSelectedLeader(null); // Ensure no leader data is displayed when showing department
  };

  const handleLeaderPopup = (leader) => {
    setSelectedLeader(leader);
    setShowDepartmentPopup(true);
    setSelectedDepartment(null); // Ensure no department data is displayed when showing leader
  };

  const closePopup = () => {
    setShowSeeMore(false);
    setShowDepartmentPopup(false);
    setSelectedDepartment("");
    setSelectedLeader(null);
  };

  return (
    <div className="info_page">
      <Hero
        onclick={scrollToSection}
        photo={About}
        title="Department Excellence"
        subtitle="Dedicated to advancing healthcare through innovative research, world-class education, and compassionate clinical practice."
        txt_btn="Discover Our Mission"
      />

      <div className="info_sections">
        {/* Section 1: Vision & Philosophy */}
        <section className="info_section section_padding">
          <div className="section_container">
            <div className="glass_inner_panel">
              <div className="panel_header">
                <h2 className="section_title">Science & Humanity</h2>
                <p className="subtitle_text">Our Vision for Modern Medicine</p>
              </div>
              <div className="panel_body">
                <p className="main_intro_text">
                  The Department of Medical Sciences is dedicated to advancing the
                  field of healthcare through innovative research. We prepare the 
                  next generation of healthcare professionals equipped to meet 
                  the challenges of modern medicine.
                </p>
                <div className="action_footer">
                  <button className="premium_action_btn" onClick={handleSeeMore}>
                    Read Full Vision Statement
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Strategic Pillars Grid */}
        <section className="pillars_info_section section_padding alt_bg">
          <div className="section_container">
            <h2 className="section_title centered">Core Competencies</h2>
            <div className="info_grid">
              <div className="info_card">
                <div className="card_icon">🔬</div>
                <h3>Research Excellence</h3>
                <p>At the forefront of cancer biology and cardiovascular health research.</p>
              </div>
              <div className="info_card">
                <div className="card_icon">🏥</div>
                <h3>Clinical Training</h3>
                <p>Extensive hands-on experience through partnerships with leading hospitals.</p>
              </div>
              <div className="info_card">
                <div className="card_icon">🤝</div>
                <h3>Interdisciplinary</h3>
                <p>Collaborative approach with pharmacy, nursing, and biomedical fields.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Faculty Leadership */}
        <section className="leadership_section section_padding">
          <div className="section_container">
            <h2 className="section_title centered">Department Leadership</h2>
            <div className="leadership_grid">
              {Leaderships.map((leader) => (
                <div key={leader.id} className="leader_card">
                  <div className="leader_avatar">
                    <img src={leader.img} alt={leader.name} />
                  </div>
                  <div className="leader_info">
                    <h3>{leader.name}</h3>
                    <span className="leader_rank">{leader.postion}</span>
                    <button
                      className="leader_details_btn"
                      onClick={() => handleLeaderPopup(leader)}
                    >
                      Academic Bio
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 4: Academic Departments */}
        <section className="dept_explorer_section section_padding alt_bg">
          <div className="section_container">
            <h2 className="section_title centered">Medical Departments</h2>
            <div className="dept_button_grid">
              {departments.map((department) => (
                <button
                  key={department.name}
                  className="dept_explorer_btn"
                  onClick={() => handleDepartmentPopup(department)}
                >
                  <span className="dept_name">{department.name}</span>
                  <span className="dept_arrow">→</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Section 5: Connect & Explore (Navigation Action Bar) */}
        <section className="info_links_section section_padding">
          <div className="section_container">
             <div className="links_action_bar">
               <div className="action_item">
                 <h4>Join Us</h4>
                 <p className="underline_link">How to Apply?</p>
               </div>
               <div className="action_item">
                 <h4>Network</h4>
                 <Link to="/faculty-member">Faculty Members</Link>
               </div>
               <div className="action_item">
                 <h4>Support</h4>
                 <Link to="/assistant">Academic Assistants</Link>
               </div>
               <div className="action_item emergency">
                 <h4>Emergency</h4>
                 <Link to="/emergency">Register Status</Link>
               </div>
             </div>
          </div>
        </section>
      </div>

      {/* Popups */}
      <Popup
        show={showSeeMore}
        onClose={closePopup}
        title="Department Details"
        content="The Department of Medical Sciences is dedicated to advancing the field of healthcare through innovative research, education, and clinical practice. Our mission is to prepare the next generation of healthcare professionals and researchers who are equipped to meet the challenges of modern medicine..."
      />

      <Popup
        show={showDepartmentPopup}
        onClose={closePopup}
        title={
          selectedDepartment
            ? selectedDepartment.name
            : selectedLeader
            ? selectedLeader.name
            : ""
        }
        content={
          selectedDepartment ? (
            <>
              {selectedDepartment.details}
              <br />
              <br />
              <strong>Number of beds:</strong> {selectedDepartment.beds}
            </>
          ) : selectedLeader ? (
            <>
              <strong>Specialization:</strong> {selectedLeader.Specialization}
            </>
          ) : null
        }
      />
    </div>
  );
};

export default DepartmentInfo;
