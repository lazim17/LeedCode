// RegistrationForm.jsx
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

const RegistrationForm = () => {
  const { examid } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    // Add more form fields as needed
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    // You can make an API request to send registration data to your server

    console.log('Form Submitted:', formData);
  };

  return (
    <div>
        <br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br>
      <h2>Registration Form for Exam {examid}</h2>
      <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
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

export default RegistrationForm;
