import React from "react";

export default function EmployerLogin() {
  return (
    <div className="container-login body">
      <div className="login-card">
        <form>
          <h3>Login as Employer</h3>
          <input type="text" placeholder="Username" />
          <input type="password" placeholder="Password" />
          <input type="button" value={"Submit"} />
        </form>
      </div>
    </div>
  );
}
