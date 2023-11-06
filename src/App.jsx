import React from "react";
import CodeEditor from "./CodeEditor/CodeEditor";
import Navbar from "./NavBar/navbar";
import { Route, Routes } from "react-router-dom";
import { Outlet } from "react-router";
import StudentLogin from "./LoginForms/StudentLogin";
import StudentDashboard from "./LoginForms/StudentDashboard";
import EmployerLogin from "./LoginForms/EmployerLogin";
import LoginSelect from "./LoginForms/LoginSelect";
import HomePage from "./Homepage/HomePage";
import Generate from "./Generate/Generate";

//Authentication Context
import { AuthProvider } from "./context/AuthProvider";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route
          element={
            <>
              <Navbar />
              <Outlet />
            </>
          }
        >
          <Route path="/" element={<HomePage />} />
          <Route path="/generate" element={<Generate />} />
          <Route path="/login" element={<LoginSelect />} />
          <Route path="/student" element={<StudentDashboard />} />
        </Route>
        
        <Route path="/question" element={<CodeEditor />} />
        <Route path="/login/student" element={<StudentLogin />} />
        <Route path="/login/employer" element={<EmployerLogin />} />
      </Routes>
    </AuthProvider>
  );
}
