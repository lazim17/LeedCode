import React, { useContext, useEffect } from "react";
import AuthContext from "../context/AuthProvider";
import { Navigate, useNavigate } from "react-router-dom";

export default function StudentDashboard() {
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  function renderdash(){
    return (
      <div className="body">
        <h3>Welcome {auth.loginData.username} </h3>
      </div>
    );
  }
  useEffect(() => {
    if (auth.success !== true) {
      navigate('/')
      
    } else {
      renderdash()
    }
  }, [auth]);
}
