import React, { useState } from "react";
import logo from "../assets/a_logo.png";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import useLoginhook from "../hook/useLoginhook";

const Login = ({ setUserRole, assistants, Members, setActiveUser }) => {
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [userRole, setUserRoleState] = useState(null); // Local state to manage role display
  const navigate = useNavigate();
  const { User, dispatch } = useLoginhook();
  const handleLogin = async () => {
    try {
      // Send login request to the server
      const response = await fetch(`${import.meta.env.VITE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      // Parse the server response
      const data = await response.json();

      // Handle unsuccessful response
      if (!response.ok) {
        return setLoginError(data.error || "Login failed. Please try again.");
      }

      // Prepare user object from the response
      const user = {
        name: data.name,
        email: data.email,
        token: data.token,
        role: data.role,
      };

      // Dispatch login action
      dispatch({
        type: "LOGIN",
        payload: user,
      });

      // Store user token in localStorage
      localStorage.setItem("user", JSON.stringify(user));

      // Reset input fields
      setemail("");
      setPassword("");

      // Handle user role and navigation
      if (data.role === "Member") {
        setUserRole(0);
        setUserRoleState(0);
        navigate("/assistant"); // Redirect to Member page
      } else if (data.role === "Assistant") {
        setUserRole(1);
        setUserRoleState(1);
        navigate("/assistant"); // Redirect to Assistant page
      } else {
        setLoginError("Invalid role or user type.");
        setUserRoleState(null);
      }
    } catch (error) {
      // Handle unexpected errors
      console.error("Error during login:", error);
      setLoginError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="login_cont">
      <div className="login_overlay"></div>
      <div className="glass_card">
        <div className="login_header">
          <div className="lg">
            <img src={logo} alt="Faculty Logo" />
          </div>
          <h1>Welcome Back</h1>
          <p>Please enter your credentials to access the Medical Portal</p>
        </div>

        <div className="login_form">
          <div className="f_input">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="e.g. name@faculty.edu"
              value={email}
              onChange={(e) => setemail(e.target.value)}
            />
          </div>
          <div className="f_input">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="login_btn" onClick={handleLogin}>
            Sign In
          </button>

          {loginError && <p className="error_msg">{loginError}</p>}

          <div className="login_footer">
            <Link to="/" className="visitor_link">
              Continue as Visitor
            </Link>
          </div>
        </div>

        {userRole !== null && (
          <div className="role_badge">
            {userRole === 0
              ? "Logged in as Faculty Member"
              : userRole === 1
              ? "Logged in as Assistant"
              : "Guest Access"}
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
