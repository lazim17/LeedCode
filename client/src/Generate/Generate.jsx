// Generate.jsx
import React, { useState } from "react";
import './Generate.css';

function Generate() {
  const [body, setBody] = useState("");
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [taskStatus, setTaskStatus] = useState(null);
  const [taskId, setTaskId] = useState(null); // New state for task_id

  const generateQuestions = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await fetch("/generateq", {
        method: "POST",
        body: JSON.stringify({ body }),
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200) {
        const data = await response.json();
        setQuestions(data.questions);
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setLoading(false);
    }
  };

  const processQuestions = async () => {
    try {
      setLoading(true);
      const response = await fetch("/qinfo", {
        method: "POST",
        body: JSON.stringify({ questions }),
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200) {
        const data = await response.json();
        console.log(data.task_id);
        setTaskId(data.task_id)
      }
    } catch (error) {
      console.error("Error processing questions:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkStatus = async () => {
    try {
      setLoading(true);
  
      // Assuming taskId is a state variable
      const response = await fetch(`/check_status/${taskId}`);
      
      if (response.ok) {  // Checking if the response status is in the range 200-299
        const data = await response.json();
        setTaskStatus(data.status);
        console.log(taskStatus)
      } else {
        // Handle non-successful response (e.g., display an error message)
        console.error(`Error checking task status. Server response: ${response.status}`);
      }
    } catch (error) {
      console.error("Error checking task status:", error);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="generator-container body">
      <div className="generator-canvas">
        <h1>Question Generator</h1>
        <form onSubmit={generateQuestions}>
          <textarea
            className="form-control"
            placeholder="Enter Job Description"
            rows="6"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
          ></textarea>
          <button className="btn btn-primary mt-2" type="submit">
            Generate Questions
          </button>
        </form>
        <h3>Generated Questions</h3>
        {loading && <p>Loading...</p>}
        {questions.length > 0 && (
          <ul>
            {questions.map((question, index) => (
              <li key={index}>{question}</li>
            ))}
          </ul>
        )}
        {questions.length > 0 && (
          <>
            <button
              className="btn btn-success mt-2"
              onClick={processQuestions}
              disabled={loading}
            >
              Process Questions
            </button>
            
            <div>
              <p>Task Status: {taskStatus}</p>
              <button
                className="btn btn-info mt-2"
                onClick={checkStatus}
                
              >
                Check Status
              </button>
            </div>
            
          </>
        )}
      </div>
    </div>
  );
}

export default Generate;
