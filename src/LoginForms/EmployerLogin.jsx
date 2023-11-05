import React from "react";

export default function EmployerLogin() {
  return (
    <div className="container-login">
      <div className="login-card">
        <form>
          <h2>LeedCode</h2>
          <h3>Sign In</h3>
          <label htmlFor="username">Username</label>
          <input type="text" />
          <label htmlFor="Password">Password</label>
          <input type="password"/>
          <input type="button" className="submit-button" value={"Submit"} />
        </form>
      </div>
    </div>
  );
}
