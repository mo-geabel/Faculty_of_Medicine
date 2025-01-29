import React from "react";
import "./Intro.css";
import Homepage_photo from "../../public/assets/Hero1.jpg";
import members from "../../public/assets/members.avif";
import Hero from "./Hero";
import intro from "../../public/assets/Intro.jpg";
import { Link } from "react-router-dom";
import About from "../../public/assets/About.jpg";
import Blank from "./Blank";
import { Link as ScrollLink, animateScroll as scroll } from "react-scroll";
import "./Home.css";
const Intro = ({ announcements, achievements, userRole }) => {
  const txt_btn = "Click Here";
  const title = "Welcome to Our Departmant";
  const scrollToSection = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };
  return (
    <>
      <Hero
        photo={Homepage_photo}
        txt_btn={txt_btn}
        title={title}
        onclick={scrollToSection}
      />
      <Blank />
      <div className="con">
        <div className="left_item">
          <div className="ite">
            <img src={intro} alt="" />
            <h2 id="titl"> Faculty of Medicine</h2>
            <p id="cont">
              As a thematic university in the fields of Behavioral and Health
              Sciences, Uskudar University, which has made significant
              contributions to higher education, was officially established on
              15 March 2018 with the aim of being premium and universal. In the
              Faculty of Medicine, future physicians are trained as both
              scientists and equipped with the necessary competencies for the
              practice of Medicine. Uskudar University has become prominent,
              especially in the field of health and has become one of the high
              education institutions, that train professionals in many fields of
              health professions in our country. The Faculty of Medicine has
              been planned and established at the highest level in terms of
              infrastructure and academic equipment....{" "}
              <Link id="link" to={"/assistant"}>
                Learn More
              </Link>
            </p>
          </div>
          <div className="ite">
            <img src={members} alt="" />
            <h2 id="titl"> Faculty Members</h2>
            <p id="cont">
              As a thematic university in the fields of Behavioral and Health
              Sciences, Uskudar University, which has made significant
              contributions to higher education, was officially established on
              15 March 2018 with the aim of being premium and universal. In the
              Faculty of Medicine, future physicians are trained as both
              scientists and equipped with the necessary competencies for the
              practice of Medicine. Uskudar University has become prominent,
              especially in the field of health and has become one of the high
              education institutions, that train professionals in many fields of
              health professions in our country. The Faculty of Medicine has
              been planned and established at the highest level in terms of
              infrastructure and academic equipment....{" "}
              <Link id="link" to={"/faculty-member"}>
                Learn More
              </Link>
            </p>
          </div>
          <div className="ite">
            <img src={About} alt="" />
            <h2 id="titl">Department of Medicine</h2>
            <p id="cont">
              The Department of Medicine at Uskudar University is dedicated to
              advancing the field of medical sciences through rigorous academic
              programs, hands-on training, and innovative research. Established
              with state-of-the-art facilities and an experienced faculty, the
              department aims to prepare future doctors with the knowledge,
              skills, and compassion essential for today’s healthcare landscape.
              Through a curriculum that integrates clinical practice and
              research, students gain a comprehensive education that positions
              them to be leaders in medicine and healthcare.
              <Link id="link" to={"/department-info"}>
                Learn More
              </Link>
            </p>
          </div>
        </div>
        <div className="right_b">
          <div className="it-1">
            <div className="titl">
              <p id="stitl">Announcement </p>
              <Link id="link" to={"/announcement"}>
                See More
              </Link>
            </div>
            {announcements.slice(0, 3).map((announcement, index) => (
              <div className="card1" key={index}>
                <div className="card-content">
                  <h5 id="stitl">{announcement.title}</h5>
                  <p>{announcement.department}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="it-1">
            <div className="titl">
              <p id="stitl">Achievments </p>
              <Link id="link" to={"/announcement"}>
                See More
              </Link>
            </div>
            {achievements.slice(0, 3).map((achievement, index) => (
              <div className="card1" key={index}>
                <div className="card-content">
                  <h5 id="stitl">{achievement.title}</h5>
                </div>
              </div>
            ))}
          </div>
          {(userRole === 0 || userRole === 1) && (
            <div className="it-1">
              <div className="titl">
                <p id="stitl">Calendar </p>
                <Link id="link" to={"/calendar"}>
                  Calendar
                </Link>
              </div>
            </div>
          )}
          <div className="it-1">
            <div className="titl">
              <p id="rtitl">Emergency </p>
              <Link id="rlink" to={"/emergency"}>
                Register
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Intro;
