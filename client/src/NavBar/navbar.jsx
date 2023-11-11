// Navbar.js
import React, { useContext } from "react";
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

  function Button() {
    if (token) {
      <Link to="/student">Dashboard</Link>;
    } else {
      <Link to="/login">Login</Link>;
    }
  }

  return (
    <div>
      {renderNavbar && (
        <nav className="navbar">
          <ul>
            <li>
              <h1 className="logo"><Link to={'/'}>LEEDCODE</Link></h1>
            </li>
            {role === "student" && token && (
              <li>
                <Link to="/question">Code Editor (Beta)</Link>
              </li>
            )}
            {role === "admin" && token && (
              <li>
                <Link to="/generate">Generate Questions (Beta)</Link>
              </li>
            )}
            <li className="login">
              {token &&
                (role === "student" ? (
                  <Link to="/student">{localStorage.getItem("Username")}</Link>
                ) : (
                  role === "admin" && (
                    <Link to="/employer">
                      {localStorage.getItem("Username")}
                    </Link>
                  )
                ))}

              {!token && <Link to="/login">Login</Link>}
            </li>
            {token && (
              <li className="login">
                <input
                  type="button"
                  onClick={handleLogout}
                  value="logout"
                  name="logout"
                ></input>
              </li>
            )}
          </ul>
        </nav>
      )}
    </div>
  );
};

export default Navbar;
