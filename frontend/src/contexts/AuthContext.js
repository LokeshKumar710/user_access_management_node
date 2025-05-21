import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../services/api'; 

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); 
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true); 
    const navigate = useNavigate();

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        if (storedToken && storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setToken(storedToken);
                setUser(parsedUser);
            } catch (e) {
                console.error("Failed to parse stored user:", e);
                localStorage.removeItem('user');
                localStorage.removeItem('token');
            }
        }
        setLoading(false);
    }, []);

    const loginUser = async (credentials) => {
        try {
            const response = await api.login(credentials);
            const { token: authToken, user: userData } = response.data;
            localStorage.setItem('token', authToken);
            localStorage.setItem('user', JSON.stringify(userData));
            setToken(authToken);
            setUser(userData);
            
            if (userData.role === 'Admin') navigate('/admin/create-software');
            else if (userData.role === 'Manager') navigate('/manager/pending-requests');
            else if (userData.role === 'Employee') navigate('/employee/request-access');
            else navigate('/dashboard'); 
            return { success: true };
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message;
            console.error('Login failed:', errorMessage);
            return { success: false, message: errorMessage };
        }
    };

    const signupUser = async (userData) => {
        try {
            await api.signup(userData);
            navigate('/login');
            return { success: true, message: 'Signup successful! Please login.'};
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message;
            console.error('Signup failed:', errorMessage);
            return { success: false, message: errorMessage };
        }
    };

    const logoutUser = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ user, token, loginUser, logoutUser, signupUser, loading, setUser, setToken }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
