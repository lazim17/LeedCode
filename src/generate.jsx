import React, { useState } from 'react';

function Generate() {
  const [body, setBody] = useState('');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const generateQuestions = async (e) => {
    e.preventDefault(); // Prevent the default form submission

    try {
      setLoading(true); // Set loading to true while the fetch is in progress

      const response = await fetch('/generateq', { 
        method: 'POST',
        body: JSON.stringify({ body }),
        headers: { 'Content-Type': 'application/json' } 
      });

      if (response.status === 200) {
        const data = await response.json();
        setQuestions(data.questions);
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setLoading(false); // Reset loading state when the fetch is done
    }
  };

  return (
    <div>
      <h1>Question Generator</h1>
      <form onSubmit={generateQuestions}>
        <label htmlFor="Job Description" className="form-label">Body</label>
        <textarea
          className="form-control"
          placeholder="Enter Job Description"
          rows="6"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
        ></textarea>
        <button className="btn btn-primary mt-2" type="submit">Submit</button>
      </form>
      <h2>Generated Questions:</h2>
      {loading && <p>Loading...</p>} {/* Display loading indicator when loading is true */}     
      {questions.length > 0 && (
        <ul>
          {questions.map((question, index) => (
            <li key={index}>{question}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Generate;
