import React, { useContext, useEffect, useState } from "react";
import TokenContext from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";

const AppliedExamCard = ({ appliedExam }) => {
  const { role, name, examstart } = appliedExam;
  const [isExamStarted, setIsExamStarted] = useState(false);

  useEffect(() => {
    // Check if the current date is past the examstart date
    const currentDateTime = new Date();
    const examStartDateTime = new Date(examstart);

    setIsExamStarted(currentDateTime > examStartDateTime);
  }, [examstart]);

  const handleStartExam = () => {
    // Add logic to navigate or perform actions when the "Start Exam" button is clicked
    console.log("Start Exam clicked!");
  };

  return (
    <div style={{ border: '1px solid #ddd', padding: '10px', margin: '10px', cursor: 'pointer' }}>
      <h3>{role}</h3>
      <p>
        <span>Company: </span>
        {name}
      </p>
      <p>
        <span>Date: </span>
        {examstart}
      </p>
      <button onClick={handleStartExam} disabled={!isExamStarted}>
        Start Exam
      </button>
    </div>
  );
};

export default function StudentDashboard() {
  const { token } = useContext(TokenContext);
  const navigate = useNavigate();
  const [appliedExams, setAppliedExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Update the endpoint to match the Flask route
    const fetchAppliedExams = async () => {
      try {
        const response = await fetch("/applicantdashboard", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setAppliedExams(data.appliedExams);
        } else {
          console.error(`Error: ${response.status}`);
        }
      } catch (error) {
        console.error("Error fetching applied exams:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppliedExams();
  }, []); // Run once on component mount

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="body">
      <h1>student</h1>
      <h3>Welcome {localStorage.getItem("Username")} </h3>

      <div>
        <h1>Applied Exams</h1>
        {appliedExams.length > 0 ? (
          <div>
            {appliedExams.map((appliedExam, index) => (
              <AppliedExamCard key={index} appliedExam={appliedExam} />
            ))}
          </div>
        ) : (
          <p>No applied exams available.</p>
        )}
      </div>
    </div>
  );
}
