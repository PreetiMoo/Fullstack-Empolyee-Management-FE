import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './employee.css'; 

const EmployeeForm = ({ refreshDepartments, refreshEmployees }) => {
  const [departments, setDepartments] = useState([]);
  const [employee, setEmployee] = useState({
    name: '',
    departmentId: '',
    address: '',
  });
  const [errorMessage, setErrorMessage] = useState(''); 
  const [successMessage, setSuccessMessage] = useState(''); 

  
  useEffect(() => {
    const fetchDepartments = async () => {
      const accessToken = localStorage.getItem('accessToken'); 

      if (!accessToken) {
        console.error('No access token found');
        return;
      }

      try {
        const response = await axios.get('http://localhost:8000/dept/readAll', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setDepartments(response.data); 
      } catch (error) {
        console.error('Error fetching departments:', error);
        setErrorMessage('Error fetching departments. Please try again.');
      }
    };

    fetchDepartments();
  }, [refreshDepartments]);

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee((prevEmployee) => ({
      ...prevEmployee,
      [name]: value,
    }));
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setErrorMessage(''); 
    setSuccessMessage(''); 

    const accessToken = localStorage.getItem('accessToken'); 

    if (!accessToken) {
      setErrorMessage('No access token found. Please log in.');
      return;
    }

    try {
      
      await axios.post('http://localhost:8000/emp/add', employee, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setEmployee({ name: '', departmentId: '', address: '' });

      setSuccessMessage('Employee added successfully!');

      refreshEmployees();

      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);

    } catch (error) {
      console.error('Error adding employee:', error);
      setErrorMessage('Error adding employee. Please try again.');
    }
  };

  return (
    <div className="employee-form-container">
      <h2>Add Employee</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={employee.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="departmentId">Department</label>
          <select
            id="departmentId"
            name="departmentId"
            value={employee.departmentId}
            onChange={handleChange}
            required
          >
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="address">Address</label>
          <input
            type="text"
            id="address"
            name="address"
            value={employee.address}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Add Employee</button>

        {errorMessage && <div className="alert alert-danger mt-3">{errorMessage}</div>}
        
        {successMessage && <div className="alert alert-success mt-3">{successMessage}</div>}
      </form>
    </div>
  );
};

export default EmployeeForm;
