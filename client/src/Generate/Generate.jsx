// Generate.jsx
import React, { useContext, useState,useEffect } from "react";
import './Generate.css';
import TokenContext from "../context/AuthProvider";

function Generate() {
  const [body, setBody] = useState("");


  const [examId, setExamid] = useState(null);
  const [userId, setUserid] = useState(null);
  const [loading, setLoading] = useState(false);
  const {taskStatus, setTaskStatus,taskId, setTaskId} = useContext(TokenContext);
  const [questions, setQuestions] = useState(() => {
    const storedQuestions = JSON.parse(localStorage.getItem("questions")) || [];
    return storedQuestions;
  });
  const [form, setForm] = useState(() => {
    const storedFormStatus = JSON.parse(localStorage.getItem("form"));
    return storedFormStatus !== null ? storedFormStatus : null;
  });
  const { token } = useContext(TokenContext);

  const [formData, setFormData] = useState(() => {
    const storedFormData = JSON.parse(localStorage.getItem("formData")) || {
      companyName: '',
      jobRole: '',
      registrationStartDate: '',
      registrationEndDate: '',
      examStartDate: '',
    };
    return storedFormData;
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };
  

  const handleSubmit = (e) => {
    e.preventDefault();
    setForm(true)
      localStorage.setItem("form", JSON.stringify(true));
    };

    useEffect(() => {
      // Save form data to session storage whenever it changes
      localStorage.setItem("formData", JSON.stringify(formData));
    }, [formData]);
  


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
        localStorage.setItem("questions", JSON.stringify(data.questions));
        
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
      

      const response1 = await fetch("/form", {
        method: "POST",
        body: JSON.stringify({questions,formData}),
        headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

      if (response1.status === 201) {
        const data = await response1.json();
        console.log(formData)
        console.log(data.message);
        console.log(data.userid)
        setUserid(data.userid)
        console.log(userId);
        console.log(data.examid)
        setExamid(data.examid)
        console.log(examId)
        if (data.examid && data.userid) {
          const response2 = await fetch("/qinfo", {
            method: "POST",
            body: JSON.stringify({ questions, 'examid': data.examid, 'userid': data.userid }),
            headers: { "Content-Type": "application/json" },
          });

        if (response2.status === 200) {
          const data = await response2.json();
          console.log(data.task_id);
          setTaskId(data.task_id)
          localStorage.setItem("taskId",data.taskId)         
        }
      }
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
  
      const response = await fetch(`/check_status/${taskId}`);
      
      if (response.ok) {  
        const data = await response.json();
        setTaskStatus(data.status);
        localStorage.setItem("taskStatus",data.status)
        console.log(taskStatus)
      } else {
        
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
      
      {!form && (<div>
      <br></br><br></br><br></br><br></br><br></br><br></br>
      <div>
        <h2>Employer Form</h2>
        <form onSubmit={handleSubmit}>
        <label>
          Company Name:
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Job Role:
          <input
            type="text"
            name="jobRole"
            value={formData.jobRole}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Registration Start Date:
          <input
            type="date"
            name="registrationStartDate"
            value={formData.registrationStartDate}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Registration End Date:
          <input
            type="date"
            name="registrationEndDate"
            value={formData.registrationEndDate}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Exam Start Date:
          <input
            type="date"
            name="examStartDate"
            value={formData.examStartDate}
            onChange={handleChange}
          />
        </label>
        <br />
        <br />
          <button type="submit">Submit</button>
        </form>
      </div>
    </div> )}

    {questions.length == 0 && form &&(
        <>
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
        </>
        )}
        {(form && <h3>Generated Questions</h3>)}
        {loading && <p>Loading...</p>}
        {questions.length > 0 && form && (
          <ul>
            {questions.map((question, index) => (
              <li key={index}>{question}</li>
            ))}
          </ul>
        )}
        {questions.length > 0 && form && (
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
