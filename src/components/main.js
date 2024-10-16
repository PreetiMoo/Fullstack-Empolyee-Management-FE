import React, { useState } from 'react';
import axios from 'axios';
import EmployeeForm from './employee'; 
import DepartmentForm from './department';
import EmployeeTable from './employeeTable';

const MainComponent = ({ setIsAuth }) => {
    const [refreshDepartments, setRefreshDepartments] = useState(false); 
    const [shouldRefreshEmployees, setShouldRefreshEmployees] = useState(false); 

    const handleDepartmentAdded = () => {
        setRefreshDepartments((prev) => !prev); 
    };

    const refreshEmployeeList = () => {
        setShouldRefreshEmployees((prev) => !prev);
    };

    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:8000/logout', {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
            });

            localStorage.removeItem('accessToken');

            setIsAuth(false);

            window.location.href = '/login';
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-end mb-3">
                <button onClick={handleLogout} className="btn btn-danger">Logout</button>
            </div>
            <div className="row">
                <div className="col-md-6">
                    
                    <EmployeeForm refreshEmployees={refreshEmployeeList} refreshDepartments={refreshDepartments} />
                </div>
                <div className="col-md-6">
                    
                    <DepartmentForm onDepartmentAdded={handleDepartmentAdded} />
                </div>
            </div>
            <div className="row mt-5">
                <div className="col">
                    
                    <EmployeeTable shouldRefresh={shouldRefreshEmployees} refreshDepartments={refreshDepartments} /> 

                </div>
            </div>
        </div>
    );
};

export default MainComponent;
