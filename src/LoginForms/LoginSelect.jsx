import React from "react";
import { Link } from "react-router-dom";
import "./Login.css";

export default function LoginSelect() {
  return (
    <div className="login-select body">
      <h3>Select Login as</h3>
      <div className="select-container">
        <div className="option-container">
          <div className="option-details">
            <h4>Student</h4>
            <Link to="/login/student">Login as Student</Link>
          </div>
        </div>
        <div className="option-container">
          <div className="option-details">
            <h4>Employer</h4>
            <Link to="/login/employer">Login as Employer</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
