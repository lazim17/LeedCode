import React, { useContext, useEffect } from "react";
import AuthContext from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";

export default function StudentDashboard() {
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  var username = localStorage.getItem("Username")

  useEffect(()=>{
    if(!auth){
      navigate('/login')
    }
  })
  return (
    <div className="body">
      <h3>Welcome {username} </h3>
    </div>
  );
}
