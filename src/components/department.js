import React, { useState } from 'react';
import axios from 'axios';

const DepartmentForm = ({ onDepartmentAdded }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [errorMessage, setErrorMessage] = useState(''); 
    const [successMessage, setSuccessMessage] = useState(''); 

    const handleCreateDepartment = async (e) => {
        e.preventDefault();
        setErrorMessage(''); 
        setSuccessMessage(''); 

        const accessToken = localStorage.getItem('accessToken'); 

        if (!accessToken) {
            setErrorMessage('No access token found. Please log in.');
            return;
        }

        try {
            
            await axios.post('http://localhost:8000/dept/add', 
                { name, description }, 
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`, 
                    },
                }
            );

            setName('');
            setDescription('');

            if (onDepartmentAdded) {
                onDepartmentAdded();
            }

            
            setSuccessMessage('Department created successfully!');

            
            setTimeout(() => {
                setSuccessMessage('');
            }, 3000);

        } catch (error) {
            console.error('Error creating department:', error);
            setErrorMessage('Error creating department. Please try again.'); 
        }
    };

    return (
      <div className="employee-form-container">
      <h2>Add Department</h2>
        <form onSubmit={handleCreateDepartment}>
            <div className="form-group">
                <label htmlFor="name"> Name</label>
                <input
                    type="text"
                    className="form-control"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                    className="form-control"
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                ></textarea>
            </div>
            <button type="submit" className="btn btn-primary">Create Department</button>
           
            {errorMessage && <div className="alert alert-danger mt-3">{errorMessage}</div>}
            
            {successMessage && <div className="alert alert-success mt-3">{successMessage}</div>}
        </form>
        </div>
    );
};

export default DepartmentForm;
