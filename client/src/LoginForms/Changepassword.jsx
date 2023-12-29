import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const ChangePassword = () => {
  const { email } = useParams();
  const [formData, setFormData] = useState({
    username: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    // Set the username from the email prop when the component mounts
    setFormData((prevFormData) => ({
      ...prevFormData,
      username: email,
    }));
  }, [email]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Add logic to send the form data to the server to change the password
    try {
      const response = await fetch('/changepassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      // Handle the response as needed
      const data = await response.json();
      console.log(data); // Log or handle the server response
    } catch (error) {
      console.error('Error changing password:', error);
    }
  };

  return (
    <div>
        <br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br>
      <h2>Change Password</h2>
      <form onSubmit={handleSubmit}>
        <label>Username:</label>
        <input
          type="text"
          name="username"
          value={email}
          readOnly // Make the input read-only to prevent user modification
        />

        <label>Current Password:</label>
        <input
          type="password"
          name="currentPassword"
          value={formData.currentPassword}
          onChange={handleInputChange}
        />

        <label>New Password:</label>
        <input
          type="password"
          name="newPassword"
          value={formData.newPassword}
          onChange={handleInputChange}
        />

        <label>Confirm Password:</label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleInputChange}
        />

        <button type="submit">Change Password</button>
      </form>
    </div>
  );
};

export default ChangePassword;
