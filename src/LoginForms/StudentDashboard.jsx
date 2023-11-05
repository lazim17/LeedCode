import React, { useContext } from "react";
import AuthContext from "../context/AuthProvider";

export default function StudentDashboard() {
  const { auth } = useContext(AuthContext);

  console.log(auth)
  return (
    <div className="body">
      <h3>Welcome Arjun</h3>
    </div>
  );
}
