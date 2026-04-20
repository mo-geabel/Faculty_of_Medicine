import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";
import menu from "../assets/menu-icon.png";
import "./Nav.css";
import useMemberhook from "../hook/useMemberhook";
import useLoginhook from "../hook/useLoginhook";
import useAssistanthook from "../hook/useAssistanthook";
import { jwtDecode } from "jwt-decode";

const Nav = ({ setUserRole, userRole }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuClick, setMenuClick] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false); // New state for dropdown
  const [newPassword, setNewPassword] = useState(""); // State for new password
  const location = useLocation();
  const { Members, dispatch } = useMemberhook();
  const isQuizPage = location.pathname === "/quizz"; // New condition
  const isSpecificPage = location.pathname === "/calendar" || isQuizPage;
  const { User, dispatch: disUser } = useLoginhook();
  const { Assistant, dispatch: disAssistant } = useAssistanthook();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.pageYOffset > 50); // Faster sticky transition
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
    disUser({ type: "LOGOUT" });
    setUserRole(null);
    setMenuClick(false);
    setDropdownOpen(false);
  };

  const handlePasswordChange = async () => {
    if (newPassword.trim() === "") {
      alert("Password cannot be empty!");
      return;
    }

    try {
      const decoded = jwtDecode(User.token);
      const url = userRole === 1 
        ? `${import.meta.env.VITE_URL}/assistant/${decoded._id}`
        : `${import.meta.env.VITE_URL}/Members/${decoded._id}`;

      const response = await fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: newPassword }),
      });

      if (!response.ok) throw new Error("Failed to update password");

      alert("Password updated successfully!");
      setNewPassword("");
    } catch (err) {
      alert("Error updating password: " + err.message);
    }
  };

  return (
    <nav className={`navbar_main ${isScrolled || isSpecificPage ? "scrolled" : ""}`}>
      <div className="nav_container">
        <div className="nav_logo">
          <Link to="/" onClick={toggleMenu2}>
            <img src={logo} alt="Faculty Logo" />
            <span className="logo_text">Medicine Portal</span>
          </Link>
        </div>

        <div className="mobile_toggle" onClick={toggleMenu}>
          <div className={`hamburger ${menuClick ? "active" : ""}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        <ul className={`nav_menu ${menuClick ? "active" : ""}`}>
          <li className="nav_item"><Link to="/assistant" onClick={toggleMenu}>Assistant</Link></li>
          <li className="nav_item"><Link to="/faculty-member" onClick={toggleMenu}>Faculty Member</Link></li>
          <li className="nav_item"><Link to="/department-info" onClick={toggleMenu}>Info</Link></li>
          <li className="nav_item"><Link to="/announcement" onClick={toggleMenu}>Announcements</Link></li>
          <li className="nav_item"><Link to="/emergency" onClick={toggleMenu}>Emergency</Link></li>
          {(userRole === 1 || userRole === 0) && (
            <li className="nav_item"><Link to="/quizz" onClick={toggleMenu}>Quizz</Link></li>
          )}
          
          <li className="nav_user_segment">
            {User && User.email ? (
              <div className={`user_profile ${dropdownOpen ? "open" : ""}`}>
                <div className="user_trigger" onClick={() => setDropdownOpen(!dropdownOpen)}>
                  <span className="user_email">{User.email}</span>
                </div>
                <div className="user_dropdown">
                  <div className="pw_change_box">
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="New Password"
                    />
                    <button onClick={handlePasswordChange}>Change</button>
                  </div>
                  <button className="logout_btn" onClick={handleLogout}>Logout Account</button>
                </div>
              </div>
            ) : (
              <div className="login_action_box">
                <Link to="/login" className="portal_access_btn" onClick={toggleMenu}>
                  <span className="btn_glow"></span>
                  <span className="btn_text">Sign In</span>
                </Link>
              </div>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Nav;
