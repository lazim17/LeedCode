import React from "react";
import CodeEditor from "./CodeEditor/CodeEditor";
import Navbar from "./NavBar/navbar";
import { Route, Routes } from "react-router-dom";
import { Outlet } from "react-router";
import Login from "./LoginForms/Login";
import StudentDashboard from "./LoginForms/StudentDashboard";
import EmployerDashboard from "./LoginForms/EmployerDashboard";
import ChangePassword from "./LoginForms/Changepassword";
import Registration from "./LoginForms/Registration";
import HomePage from "./Homepage/HomePage";
import Generate from "./Generate/Generate";
import Exam from "./CodeEditor/Exam"


//Authentication Context
import { TokenProvider } from "./context/AuthProvider";

export default function App() {
  return (
    <TokenProvider>
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
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/employer" element={<EmployerDashboard />} />
          <Route path="/empdash" element={<EmployerDashboard />} />
          <Route path="/registerr/:employerId/:examid" element={<Registration />} />
          <Route path="/change-password/:token" element={<ChangePassword />} />
          <Route path="/exam/:examid" element={<Exam />} />





        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/question" element={<CodeEditor />} />

      </Routes>
    </TokenProvider>
  );
}
