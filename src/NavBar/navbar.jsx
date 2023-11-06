// Navbar.js
import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import "./navbar.css";
import AuthContext, { AuthProvider } from "../context/AuthProvider";

const Navbar = () => {
  const location = useLocation();
  const { auth } = useContext(AuthContext);

  // Conditionally render the navbar except on the /question route
  const renderNavbar = location.pathname !== "/question";

  function Button() {
    if (auth) {
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
              <h2>LeedCode</h2>&nbsp;
              <p>( Pun Intended )</p>
            </li>
            <li>
              <Link to="/question">Code Editor (Only for now)</Link>
            </li>
            <li>
              <Link to="/generate">Generate Questions</Link>
            </li>
            <li className="login">
              {auth &&
              (
                <Link to='/student'>{localStorage.getItem("Username")}</Link>
              )
              }
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default Navbar;
