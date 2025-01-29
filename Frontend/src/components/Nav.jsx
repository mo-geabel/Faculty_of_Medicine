import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../public/assets/logo.png";
import menu from "../../public/assets//menu-icon.png";
import "./Nav.css";
import useMemberhook from "../../hook/useMemberhook";
import useLoginhook from "../../hook/useLoginhook";
import useAssistanthook from "../../hook/useAssistanthook";
import { jwtDecode } from "jwt-decode";

const Nav = ({ setUserRole, userRole }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuClick, setMenuClick] = useState(false);
  const [newPassword, setNewPassword] = useState(""); // State for new password
  const location = useLocation();
  const { Members, dispatch } = useMemberhook();
  const isSpecificPage = location.pathname === "/calendar";
  const { User, dispatch: disUser } = useLoginhook();
  const { Assistant, dispatch: disAssistant } = useAssistanthook();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.pageYOffset > 700);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setMenuClick(!menuClick);
  };

  const toggleMenu2 = () => {
    setMenuClick(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUserRole(null);
    setMenuClick(!menuClick);
  };

  const handlePasswordChange = async () => {
    if (newPassword.trim() === "") {
      alert("Password cannot be empty!");
      return;
    }

    // Update in assistants array
    if (userRole === 1) {
      const decoded = jwtDecode(User.token);
      const updatedAssistants = Assistant.map((assistant) =>
        assistant._id === decoded._id
          ? { ...assistant, password: newPassword }
          : assistant
      );

      const response = await fetch(
        `${import.meta.env.VITE_URL}/assistant/${decoded._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password: newPassword }),
        }
      );
      dispatch({
        type: "UPDATE_Assistants",
        payload: {
          data: response,
          _id: decoded._id,
        },
      });
    }
    if (userRole === 0) {
      // Update in Members array
      const decoded = jwtDecode(User.token);

      const response = await fetch(
        `${import.meta.env.VITE_URL}/Members/${decoded._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password: newPassword }),
        }
      );
      dispatch({
        type: "UPDATE_Members",
        payload: {
          data: response,
          _id: decoded._id,
        },
      });
    }

    alert("Password updated successfully!");
    setNewPassword(""); // Clear input
  };

  return (
    <div className={isScrolled || isSpecificPage ? "container1" : "hidde"}>
      <div className="logo">
        <Link to="/">
          <img onClick={toggleMenu2} src={logo} alt="logo" />
        </Link>
      </div>
      <img onClick={toggleMenu} className="men" src={menu} alt="menu icon" />
      <ul className={`menu-content ${menuClick ? "show" : ""}`}>
        <Link to="/assistant" onClick={toggleMenu}>
          <li>Assistant</li>
        </Link>
        <Link to="/faculty-member" onClick={toggleMenu}>
          <li>Faculty Member</li>
        </Link>
        <Link to="/department-info" onClick={toggleMenu}>
          <li>Department Info</li>
        </Link>
        <Link to="/announcement" onClick={toggleMenu}>
          <li>Announcement</li>
        </Link>
        <Link to="/emergency" onClick={toggleMenu}>
          <li>Emergency</li>
        </Link>
        {(userRole === 1 || userRole === 0) && (
          <Link to="/quizz" onClick={toggleMenu}>
            <li>Quizz</li>
          </Link>
        )}
        {userRole === 1 || userRole === 0 ? (
          <div className="dropdown mt-4">
            <button
              className="btn btn-primary dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {User.email}
            </button>
            <ul className="dropdown-menu dropdown-menu-dark">
              <li>
                <a
                  className="btn btn-primary"
                  data-bs-toggle="collapse"
                  href="#collapseExample"
                  role="button"
                  aria-expanded="false"
                  aria-controls="collapseExample"
                  onClick={(e) => e.stopPropagation()} // Prevent dropdown from closing
                >
                  Change Password
                </a>
                <div className="collapse" id="collapseExample">
                  <div className="card p-2">
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="form-control mb-2"
                    />
                    <button
                      className="btn btn-success"
                      onClick={handlePasswordChange}
                    >
                      Save Password
                    </button>
                  </div>
                </div>
              </li>
              <li
                style={{ fontSize: "18px", cursor: "pointer" }}
                onClick={handleLogout}
              >
                Logout
              </li>
            </ul>
          </div>
        ) : (
          <Link to="/login" onClick={toggleMenu}>
            <li>Login</li>
          </Link>
        )}
      </ul>
    </div>
  );
};

export default Nav;
