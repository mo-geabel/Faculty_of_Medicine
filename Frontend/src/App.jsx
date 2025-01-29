import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Assistants from "./components/Assistant";
import FacultyMember from "./components/Faculty_Member";
import DepartmentInfo from "./components/DepartmentInfo";
import Announcement from "./components/Announcement";
import Emergency from "./components/Emergency";
import Quizz from "./components/Quizz";
import Home from "./components/Home";
import Blank from "./components/Blank";
import Intro from "./components/Intro";
import Footer from "./components/Footer";
import Carousel from "./components/Carousel";
import Login from "./components/Login";
import Cal from "./components/Cal";
import ScrollToTop from "./components/ScrollToTop";

import Homepage_photo from "../public/assets/Hero1.jpg";
import assistant_photo from "../public/assets/assistant_hero.jpg";
import Achiev from "../public/assets/Acheivment.jpg";
import a_logo from "../public/assets/a_logo.png";

import "react-calendar/dist/Calendar.css";
import useAnnouncmentContexthook from "../hook/useAnnouncementhook";
import useAchievementhook from "../hook/useAchievementhook";
import useLoginhook from "../hook/useLoginhook";
import useAssistanthook from "../hook/useAssistanthook";

function App() {
  const { User, dispatch: disUser } = useLoginhook();
  const { Assistant, dispatch: disAssistant } = useAssistanthook();
  const { announcements, dispatch: disAnnouncment } =
    useAnnouncmentContexthook();
  const { achievements, dispatch: disAchievement } = useAchievementhook();

  const [userRole, setUserRole] = useState(null);
  const [ActiveUser, setActiveUser] = useState([]);
  const [assistants, setAssistants] = useState(() => {
    const savedData = sessionStorage.getItem("assistants");
    return savedData ? JSON.parse(savedData) : [];
  });

  const { Members, dispatch: Memberdispatch } = useLoginhook();

  // Global Data Fetching Hooks
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_URL}/announcement`
        );
        const data = await response.json();
        disAnnouncment({ type: "GET_ANNOUNCEMENTS", payload: data.data });
        localStorage.setItem("announcements", JSON.stringify(data.data));
      } catch (error) {
        console.error("Error fetching announcements:", error);
      }
    };

    const fetchAchievements = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_URL}/achievement/`
        );
        const data = await response.json();
        disAchievement({ type: "GET_ACHIEVEMENTS", payload: data.data });
        localStorage.setItem("achievements", JSON.stringify(data.data));
      } catch (error) {
        console.error("Error fetching achievements:", error);
      }
    };

    fetchAnnouncements();
    fetchAchievements();
  }, [disAnnouncment, disAchievement]);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser) {
      disUser({ type: "LOGIN", payload: savedUser });
      setUserRole(savedUser.role === "Member" ? 0 : 1);
    }
  }, [disUser]);

  useEffect(() => {
    const fetchAssistants = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_URL}/assistant`);
        const data = await response.json();
        disAssistant({ type: "GET_Assistants", payload: data });
      } catch (error) {
        console.error("Error fetching assistants:", error);
      }
    };
    fetchAssistants();
  }, [disAssistant]);

  // Persist Data
  useEffect(() => {
    sessionStorage.setItem("assistants", JSON.stringify(assistants));
  }, [assistants]);

  useEffect(() => {
    sessionStorage.setItem("Members", JSON.stringify(Members));
  }, [Members]);

  return (
    <div className="App">
      <Nav
        setUserRole={setUserRole}
        userRole={userRole}
        ActiveUser={ActiveUser}
        assistants={assistants}
        setAssistants={setAssistants}
        Members={Members}
      />
      <ScrollToTop />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Intro
                achievements={achievements}
                announcements={announcements}
                userRole={userRole}
              />
              <Blank />
              <Footer />
            </>
          }
        />
        <Route
          path="/assistant"
          element={
            <>
              <Assistants
                userRole={userRole}
                assistants={assistants}
                setAssistants={setAssistants}
              />
              <Blank />
              <Footer />
            </>
          }
        />
        <Route
          path="/faculty-member"
          element={
            <>
              <FacultyMember Members={Members} />
              <Blank />
              <Footer />
            </>
          }
        />
        <Route
          path="/department-info"
          element={
            <>
              <DepartmentInfo />
              <Blank />
              <Footer />
            </>
          }
        />
        <Route
          path="/announcement"
          element={
            <>
              <Carousel
                img={Homepage_photo}
                img2={assistant_photo}
                img3={Achiev}
              />
              <Blank />
              <Announcement userRole={userRole} />
              <Blank />
              <Footer />
            </>
          }
        />
        <Route
          path="/emergency"
          element={
            <>
              <Emergency userRole={userRole} />
              <Blank />
              <Footer />
            </>
          }
        />
        <Route
          path="/quizz"
          element={
            <>
              <Quizz userRole={userRole} />
              <Blank />
              <Footer />
            </>
          }
        />
        <Route
          path="/login"
          element={
            <Login
              Members={Members}
              assistants={assistants}
              userRole={userRole}
              setUserRole={setUserRole}
              setActiveUser={setActiveUser}
            />
          }
        />
        <Route
          path="/calendar"
          element={
            <Cal
              setAssistants={setAssistants}
              assistants={assistants}
              userRole={userRole}
            />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
