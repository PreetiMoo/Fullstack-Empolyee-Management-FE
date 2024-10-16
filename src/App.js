import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLogin from './components/admin'; 
import MainComponent from './components/main';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';

function App() {
    const [isAuth, setIsAuth] = useState(!!localStorage.getItem('accessToken'));

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        setIsAuth(!!token);
    }, []);

    return (
        <Router>
            <div className="App">
            <div className="header">
            Employee Management System
              </div>

                <Routes>
                    <Route path="/login" element={<AdminLogin setIsAuth={setIsAuth} />} />
                    <Route
                        path="/employeeForm"
                        element={isAuth ? <MainComponent setIsAuth={setIsAuth} /> : <Navigate to="/login" replace />}
                    />
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
