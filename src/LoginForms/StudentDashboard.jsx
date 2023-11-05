import React, { useContext } from "react";
import AuthContext from "../context/AuthProvider";
import { Link } from "react-router-dom";
import LoginSelect from "./LoginSelect";

export default function StudentDashboard() {
  const { auth } = useContext(AuthContext);
  if (auth.loginData != undefined){
    return (
      <div className="body">
        <h3>Welcome {auth.loginData.username} </h3>
      </div>
    );
  }
  else{
    <Link to={<LoginSelect/>}/>
  }
  
}
