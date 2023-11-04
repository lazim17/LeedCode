import React from "react";

export default function StudentLogin() {
  return (
    <div className="container-login body">
      <div className="login-card">
        <form>
          <h3>Login as Student</h3>
          <input type="text" placeholder="Username" />
          <input type="text" placeholder="Password" />
          <input type="button" value={"Submit"} />
        </form>
      </div>
    </div>
  );
}
