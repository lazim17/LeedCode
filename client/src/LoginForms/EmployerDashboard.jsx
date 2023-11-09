import React, { useContext, useEffect } from "react";
import TokenContext from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";

export default function EmployerDashboard() {
  const { token } = useContext(TokenContext);
  const navigate = useNavigate();

  var username = localStorage.getItem("Username")

  useEffect(()=>{
    if(!token){
      navigate('/login')
    }
  })
  return (
    <div className="body">
        <h1>admin</h1>
      <h3>Welcome {username} </h3>
    </div>
  );
}
