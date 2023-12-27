import React, { useContext, useEffect,useState } from "react";
import TokenContext from "../context/AuthProvider";
import { useNavigate,Link} from "react-router-dom";


const ExamCard = ({ exam, employerId, onClick }) => {
  const registrationLink = `/registerr/${exam.userid}/${exam.exam_id}`;

  return (
    <div style={{ border: '1px solid #ddd', padding: '10px', margin: '10px', cursor: 'pointer' }} onClick={onClick}>
      <h3>{exam.role}</h3>
      <p>
        <span>Registration Link: </span>
        <Link to={registrationLink}>Register for Exam</Link>
      </p>
      {/* Add more details as needed */}
    </div>
  );
};





export default function EmployerDashboard() {
  const { token,idDictionary } = useContext(TokenContext);
  const navigate = useNavigate();
  const [examDetails, setExamDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedExam, setSelectedExam] = useState(null);

  var username = localStorage.getItem("Username")
  useEffect(() => {
    console.log(idDictionary)
  },[idDictionary]
  );

  useEffect(() => {
    // Update the endpoint to match the Flask route
const fetchExamDetails = async () => {
  try {
      const response = await fetch("/empdashboard", {
          method: "GET",
          headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
          },
      });

      if (response.ok) {
          const data = await response.json();
          setExamDetails(data.examDetails);
      } else {
          console.error(`Error: ${response.status}`);
      }
  } catch (error) {
      console.error("Error fetching exam details:", error);
  } finally {
      setLoading(false);
  }
};

  
      fetchExamDetails();
    
  }, []); // Run once on component mount
  
  
  const handleCardClick = (exam) => {
    // If the clicked card is already the selected one, set selectedExam to null
    setSelectedExam((prevExam) => (prevExam === exam ? null : exam));
};

  
  if (loading) {
    return <p>Loading...</p>;
  }

  
  
  return (
    <div className="body">
        <h1>admin</h1>
      <h3>Welcome {username} </h3>
      <br></br><br></br><br></br>

      <div>
      <h1>Exam Details</h1>
      {examDetails.length > 0 ? (
        <div>
          {examDetails.map((exam, index) => (
            <ExamCard key={index} exam={exam} onClick={() => handleCardClick(exam)} />
          ))}
        </div>
      ) : (
        <p>No exam details available.</p>
      )}

      {selectedExam && (
        <div>
          <h2>{selectedExam.role} Details</h2>
          <p>Exam ID: {selectedExam.exam_id.toString()}</p>
          <h3>Questions</h3>
          {selectedExam.questions.map((question, index) => (
            <div key={index}>
              <h4>Question {index + 1}</h4>
              <p>Text: {question.text}</p>
              <p>Examples: {question.examples}</p>
              <p>Constraints: {question.constraints}</p>
            </div>
          ))}
        </div>
      )}
    </div>
    </div>
  );
}
