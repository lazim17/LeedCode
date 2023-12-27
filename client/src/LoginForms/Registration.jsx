import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

const Registration = () => {
  const { employerId, examid } = useParams();
  const [formData, setFormData] = useState({
    fname: '',
    lname: '',
    email: '',
    // Add more form fields as needed
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegistration = async () => {
    try {
      const response = await fetch("/studentregs", {
        method: "POST",
        body: JSON.stringify({
          examid,
          employerId,
          formData,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (response.ok) {
        console.log("Application submitted successfully");
        // Optionally, you can navigate to another page or show a success message.
      } else {
        console.error("Error submitting application:", response.statusText);
        // Handle error as needed
      }
    } catch (error) {
      console.error("Error submitting application:", error.message);
      // Handle error as needed
    }
  };

  return (
    <div>
      <br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br>
      <h2>Registration Form for Exam {examid}</h2>
      <form onSubmit={handleRegistration}>
        <label>First Name:</label>
        <input
          type="text"
          name="fname"
          value={formData.fname}
          onChange={handleInputChange}
        />

        <label>Last Name:</label>
        <input
          type="text"
          name="lname"
          value={formData.lname}
          onChange={handleInputChange}
        />

        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
        />

        {/* Add more form fields as needed */}

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Registration;
