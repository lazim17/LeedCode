import React, { useState, useRef, useEffect } from "react";
import axios from "axios"; // Import Axios

export default function StudentLogin() {
  //ref for Username and Password
  const userRef = useRef();
  const pwRef = useRef();

  //Username, Password and Error Message State
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  //Default Focus on User Input useEffect
  useEffect(() => {
    userRef.current.focus();
  }, []);
  //Error Message Reset useEffect
  useEffect(() => {
    setError("");
  }, [loginData.username, loginData.password]);

  const handleLogin = async () => {
    try {
      const response = await axios.post("/login", loginData); // Use the proxy setting

      if (response.status === 200) {
        const data = response.data;
        console.log(data);
      }
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  return (
    <div className="container-login body">
      <div className="login-card">
        <form>
          <h3>Login as Student</h3>
          <input
            type="text"
            value={loginData.username}
            onChange={(e) =>
              setLoginData({ ...loginData, username: e.target.value })
            }
            placeholder="Username"
            required
            ref={userRef}
          />
          <input
            type="password"
            value={loginData.password}
            onChange={(e) =>
              setLoginData({ ...loginData, password: e.target.value })
            }
            placeholder="Password"
            ref={pwRef}
          />
          <input type="button" onClick={handleLogin} value={"Submit"} />
          <p>{error}</p>
        </form>
      </div>
    </div>
  );
}
