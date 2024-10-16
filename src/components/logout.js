import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:8000/logout', {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
    
            localStorage.removeItem('accessToken');
    
            window.location.href = '/login';
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };
    

    return (
        <button onClick={handleLogout}>Logout</button>
    );
};

export default Logout;
