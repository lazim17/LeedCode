import React, { useState } from 'react';

const EmployerForm = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    jobRole: '',
    registrationStartDate: '',
    registrationEndDate: '',
    examStartDate: '',
    // Add other fields as needed
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/form", {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200) {
        const data = await response.json();
        console.log(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
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
        {/* Add other fields as needed */}
        <br />
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default EmployerForm;
