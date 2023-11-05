import React, { useState } from "react";
import axios from "axios"; // Import Axios

export default function StudentLogin() {
  const [loginData, setLoginData] = useState({ username: '', password: '' });

  const handleLogin = async () => {
    try {
      const response = await axios.post('/login', loginData); // Use the proxy setting

      if (response.status === 200) {
        const data = response.data;
        console.log(data);
      } else {
        console.error(`Error: ${response.status}`);
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="container-login body">
      <div className="login-card">
        <form>
          <h3>Login as Student</h3>
          <input
            type="text"
            value={loginData.username}
            onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
            placeholder="Username"
          />
          <input
            type="text"
            value={loginData.password}
            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
            placeholder="Password"
          />
          <input type="button" onClick={handleLogin} value={"Submit"} />
        </form>
      </div>
    </div>
  );
}
