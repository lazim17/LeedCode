// Navbar.js
import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./navbar.css";

const Navbar = () => {
  const location = useLocation();

  // Conditionally render the navbar except on the /question route
  const renderNavbar = location.pathname !== "/question";

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
              <Link to="/login">
                Login
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default Navbar;
