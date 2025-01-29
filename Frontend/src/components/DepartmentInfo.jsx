import React, { useState } from "react";
import About from "../../public/assets/About.jpg";
import Hero from "./Hero";
import a_logo from "../../public/assets/a_logo.png";
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
    <>
      <Hero
        onclick={scrollToSection}
        photo={About}
        title="ABOUT US"
        txt_btn="Click Here"
      />
      <div className="Department-container">
        <div className="right">
          <div className="item1">
            <h5>Department of Medical Sciences</h5>
            <p>
              The Department of Medical Sciences is dedicated to advancing the
              field of healthcare through innovative research, education, and
              clinical practice. Our mission is to prepare the next generation
              of healthcare professionals and researchers who are equipped to
              meet the challenges of modern medicine. We offer a comprehensive
              curriculum that integrates theoretical knowledge with practical
              experience, ensuring that our students are well-prepared for their
              future careers in various medical disciplines.
            </p>
            <button style={{ border: "20px" }} onClick={handleSeeMore}>
              See More
            </button>
          </div>
          <div className="item1">
            <h5>Key Areas of Focus:</h5>
            <ul>
              <li>
                Research Excellence: Our department is at the forefront of
                medical research, with ongoing projects in areas such as
                cardiovascular health, cancer biology, and public health.
              </li>
              <li>
                Clinical Training: We provide extensive clinical training
                opportunities through partnerships with leading hospitals and
                healthcare facilities, allowing students to gain hands-on
                experience.
              </li>
              <li>
                Interdisciplinary Collaboration: We emphasize collaboration
                across various fields, including biomedical engineering,
                pharmacy, and nursing, to foster a holistic approach to
                healthcare.
              </li>
            </ul>
          </div>
          <div className="item1">
            <h5>Faculty Leadership:</h5>
            {Leaderships.map((leader) => (
              <div key={leader.id} className="card-pf">
                <img src={leader.img} alt={leader.name} />
                <p id="pf-name">{leader.name}</p>
                <p id="pf-postion">{leader.postion}</p>
                <button
                  className="line-style-btn"
                  onClick={() => handleLeaderPopup(leader)}
                >
                  Look More
                </button>
              </div>
            ))}
          </div>

          {/* Department Button Links */}
          <div className="item1">
            <h5>Departments:</h5>
            {departments.map((department) => (
              <button
                key={department.name}
                className="line-style-btn m-1"
                onClick={() => handleDepartmentPopup(department)}
              >
                {department.name}
              </button>
            ))}
          </div>
        </div>
        <div className="left">
          <h5 id="info">Informations</h5>
          <div className="info">
            <p className="underline">How to Apply?</p>
            <Link to={"/faculty-member"} className="underline">
              <p>Faculty Members</p>
            </Link>
            <Link to={"/assistant"} className="underline">
              <p>Assistants</p>
            </Link>
            <Link to="/emergency" className="underline-em">
              <p>Emergency</p>
            </Link>
          </div>
        </div>
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
    </>
  );
};

export default DepartmentInfo;
