import "./Login.css";
import React, { useState, useRef, useEffect, useContext } from "react";
import axios from "axios"; // Import Axios
import TokenContext from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";

export default function StudentLogin() {
  //ref for Username and Password
  const userRef = useRef();
  const pwRef = useRef();
  const { token, role, setToken, setRole } = useContext(TokenContext);
  const navigate = useNavigate();

  //Username, Password and Error Message State
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  //Show Password
  const [show, setShow] = useState(false);

  //Default Focus on User Input useEffect
  useEffect(() => {
    userRef.current.focus();
    if (token) {
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
        const { token, role } = response.data;

        //Setting Context for Authentication
        setToken(token);
        setRole(role);
        console.log(role);
        localStorage.setItem("token", token);
        localStorage.setItem("status", "logged in");
        localStorage.setItem("Username", loginData.username);
        if (role == "student") {
          navigate("/student");
        } else if (role == "admin") {
          navigate("/employer");
        }
      }
    } catch (error) {
      setError(error.response.data.message);
    }
  };
  return (
    <div className="container-login">
      <div className="login-card">
        <div className="left">
          <form>
            <div className="text">
              <h2>Welcome Back</h2>
              <p>
                Enter your username and password to log in to your dashboard
              </p>
            </div>
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
              type={show ? "text" : "password"}
              value={loginData.password}
              onChange={(e) =>
                setLoginData({ ...loginData, password: e.target.value })
              }
              ref={pwRef}
            />
            <div className="checkbox">
              <input
                type="checkbox"
                className="tick"
                value={show}
                onChange={() => {
                  setShow(!show);
                }}
              />
              <label>Show Password</label>
            </div>
            <input
              type="button"
              className="submit-button"
              onClick={handleLogin}
              value={"Log In"}
            />
            <div className="error">
              <p>{error}</p>
            </div>
          </form>
        </div>
        <div className="right"></div>
      </div>
    </div>
  );
}
