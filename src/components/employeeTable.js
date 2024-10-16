import React, { useEffect, useState } from 'react';
import axios from 'axios';

const EmployeeTable = ({ shouldRefresh, refreshDepartments }) => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [employeeName, setEmployeeName] = useState('');
    const [deptId, setDeptId] = useState('');
    const [departments, setDepartments] = useState([]);

    const fetchEmployees = async (name = '', departmentId = '') => {
        setLoading(true);
        try {
            const token = localStorage.getItem('accessToken');
            const params = {};
            if (name) params.employee_name = name;
            if (departmentId) params.dept_id = departmentId;

            const response = await axios.get('http://localhost:8000/emp/readAll', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: params,
            });
            setEmployees(response.data);
        } catch (err) {
            setError('Error fetching data');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchDepartments = async () => {
        try {
            const response = await axios.get('http://localhost:8000/dept/readAll', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
            });
            setDepartments(response.data);
        } catch (err) {
            console.error('Error fetching departments:', err);
        }
    };

    useEffect(() => {
        fetchDepartments();
        fetchEmployees(); 
    }, []);

    
    useEffect(() => {
        fetchEmployees();
    }, [shouldRefresh]);

    useEffect(() => {
        fetchDepartments();
    }, [refreshDepartments]);

    const handleSearchChange = (e) => {
        setEmployeeName(e.target.value);
    };

    const handleDeptChange = (e) => {
        setDeptId(e.target.value);
    };

    const handleClearFilters = () => {
        setEmployeeName('');
        setDeptId('');
        fetchEmployees(); 
    };

    const handleSearchClick = () => {
        fetchEmployees(employeeName, deptId); 
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    const employeesWithDeptNames = employees.map(emp => {
        const department = departments.find(dept => dept.id === emp.departmentId);
        return {
            ...emp,
            departmentName: department ? department.name : 'N/A',
        };
    });

    return (
        <div className="employee-form-container mt-4">
            <h2>Employee List</h2>
            <div className="form-row mb-3">
                <div className="col">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search by Name"
                        value={employeeName}
                        onChange={handleSearchChange}
                    />
                </div>
                <div className="col">
                    <select
                        className="form-control"
                        value={deptId}
                        onChange={handleDeptChange}
                    >
                        <option value="">Select Department</option>
                        {departments.map(dept => (
                            <option key={dept.id} value={dept.id}>
                                {dept.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="col">
                    <button type="button" className="btn btn-primary" onClick={handleSearchClick}>
                        Search
                    </button>
                    <button type="button" className="btn btn-secondary ml-2" onClick={handleClearFilters}>
                        Clear
                    </button>
                </div>
            </div>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Department Name</th>
                        <th>Address</th>
                    </tr>
                </thead>
                <tbody>
                    {employeesWithDeptNames.length > 0 ? (
                        employeesWithDeptNames.map(emp => (
                            <tr key={emp.id}>
                                <td>{emp.id}</td>
                                <td>{emp.name}</td>
                                <td>{emp.departmentName}</td>
                                <td>{emp.address}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="text-center">No employees found</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default EmployeeTable;
