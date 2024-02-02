import React from "react";
import { useParams } from "react-router-dom";

const Exam = () => {
  const { examid } = useParams();

  const handleBeginExam = () => {
    console.log(`Begin Exam clicked for Exam ID: ${examid}`);
    // Add any additional logic or redirect as needed
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <h1>Exam Page</h1>
      <p>Exam ID: {examid}</p>
      <div style={{ textAlign: "center" }}>
        <button
          style={{
            fontSize: "1.5em", // Adjust the font size to make the button larger
            padding: "15px 30px", // Adjust the padding to make the button larger
          }}
          onClick={handleBeginExam}
        >
          Begin Exam
        </button>
      </div>
    </div>
  );
};

export default Exam;
