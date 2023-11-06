import React, { useState, useRef, useEffect, useContext } from "react";
import axios from "axios"; // Import Axios
import AuthContext from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";

export default function StudentLogin() {
  //ref for Username and Password
  const userRef = useRef();
  const pwRef = useRef();
  const { auth, setAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  //Username, Password and Error Message State
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  //Default Focus on User Input useEffect
  useEffect(() => {
    userRef.current.focus();
    if (auth) {
      navigate("/");
    }
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

        //Setting Context for Authentication
        setAuth(true);

        localStorage.setItem("Status", true);
        localStorage.setItem("Username", loginData.username);
        navigate("/");
      }
    } catch (error) {
      setError(error.response.data.message);
    }
  };
  return (
    <div className="container-login">
      <div className="login-card">
        <form>
          <h2>LeedCode</h2>
          <h3>Sign In</h3>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            value={loginData.username}
            onChange={(e) =>
              setLoginData({ ...loginData, username: e.target.value })
            }
            required
            ref={userRef}
          />
          <label htmlFor="Password">Password</label>
          <input
            type="password"
            value={loginData.password}
            onChange={(e) =>
              setLoginData({ ...loginData, password: e.target.value })
            }
            ref={pwRef}
          />
          <input
            type="button"
            className="submit-button"
            onClick={handleLogin}
            value={"Next"}
          />
          <p>{error}</p>
        </form>
      </div>
    </div>
  );
}
