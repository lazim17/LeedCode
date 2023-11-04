// Navbar.js
import React from "react";
import { Link,useLocation } from "react-router-dom";

const Navbar = () => {
    const location = useLocation();

  // Conditionally render the navbar except on the /question route
  const renderNavbar = location.pathname !== '/question';

  return (
    <div>
      {renderNavbar && (
        <nav>
          <ul>
            <li>
              <Link to="/question">Code Editor</Link>
            </li>
          </ul>
        </nav>
      )}
    </div>
    );
};

export default Navbar;
