import React, { useState } from "react";
import logo from "../../public/assets/a_logo.png";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import useLoginhook from "../../hook/useLoginhook";

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
      const response = await fetch(`/api/login/`, {
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
      <div className="login">
        <div className="lg">
          <img src={logo} alt="logo" />
        </div>
        <div className="f_input">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setemail(e.target.value)}
          />
        </div>
        <div className="f_input">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          style={{
            background: "#1369ce",
            color: "white",
            cursor: "pointer",
            transition: "background-color 0.3s",
            width: "270px",
            margin: "5px",
            borderRadius: "10px",
          }}
          onClick={handleLogin}
        >
          Login
        </button>
        {loginError && <p className="error">{loginError}</p>}
        <div className="f_input">
          <Link to="/">
            <p>Or continue as a visitor</p>
          </Link>
        </div>
        {userRole !== null && (
          <p>
            {userRole === 0
              ? "Logged in as Faculty Member (0)"
              : userRole === 1
              ? "Logged in as Assistant (1)"
              : "Guest (2)"}
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
