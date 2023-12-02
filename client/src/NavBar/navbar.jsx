// Navbar.js
import React, { useContext,useEffect } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import "./navbar.css";
import TokenContext, { TokenProvider } from "../context/AuthProvider";
import HomePage from "../Homepage/HomePage";

const Navbar = () => {
  const location = useLocation();
  const { token, role, setToken, setRole } = useContext(TokenContext);
  const navigate = useNavigate();

  // Conditionally render the navbar except on the /question route
  const renderNavbar = location.pathname !== "/question";

  const handleLogout = async () => {
    if (token) {
      setToken(null);
      localStorage.removeItem("token");
      localStorage.setItem("status", "logged out");
      localStorage.removeItem("Username");
      navigate("/");
    }
  };
  useEffect(() => {
    if (role) {
      console.log("User Role:", role);
    }
  });


  return (
    <div>
      {renderNavbar && (
        <nav className="navbar">
          <ul>
            <li>
              <h1 className="logo">
                <Link to={"/"}>LEEDCODE</Link>
              </h1>
            </li>
            {role === "student" && token && (
              <li className="editor">
                <Link to="/question">Code Editor (Beta)</Link>
              </li>
            )}
            {role === "admin" && token && (
              <li className="generate">
                <Link to="/generate">Create Exam (Beta)</Link>
              </li>
            )}
            <li className="login">
              {token &&
                (role === "student" ? (
                  <Link to="/student">{localStorage.getItem("Username")[0].toUpperCase()}</Link>
                ) : (
                  role === "admin" && (
                    <Link to="/employer">
                      {localStorage.getItem("Username")[0].toUpperCase()}
                    </Link>
                  )
                ))}
              {!token && <Link to="/login">Login</Link>}
            </li>
            <li>
            {token && (
                  <input
                    type="button"
                    onClick={handleLogout}
                    className="logout"
                    value="Logout"
                    name="logout"
                  ></input>
              )}
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default Navbar;
