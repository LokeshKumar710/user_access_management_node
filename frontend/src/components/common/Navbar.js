import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
    const { user, logoutUser } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logoutUser();
    };

    return (
        <nav style={{ background: '#333', padding: '1rem', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
                <Link to={user ? "/dashboard" : "/login"} style={{ color: 'white', marginRight: '1rem', textDecoration: 'none', fontSize: '1.2rem' }}>Home</Link>
                {user && user.role === 'Admin' && (
                    <Link to="/admin/create-software" style={{ color: 'white', marginRight: '1rem', textDecoration: 'none' }}>Create Software</Link>
                )}
                {user && user.role === 'Manager' && (
                    <Link to="/manager/pending-requests" style={{ color: 'white', marginRight: '1rem', textDecoration: 'none' }}>Pending Requests</Link>
                )}
                {user && user.role === 'Employee' && (
                    <>
                        <Link to="/employee/request-access" style={{ color: 'white', marginRight: '1rem', textDecoration: 'none' }}>Request Access</Link>
                        <Link to="/employee/my-requests" style={{ color: 'white', marginRight: '1rem', textDecoration: 'none' }}>My Requests</Link>
                    </>
                )}
            </div>
            <div>
                {user ? (
                    <>
                        <span style={{ marginRight: '1rem' }}>Welcome, {user.username} ({user.role})</span>
                        <button onClick={handleLogout} style={{ color: '#333', background: 'white', border: 'none', cursor: 'pointer', padding: '8px 12px', borderRadius: '4px' }}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" style={{ color: 'white', marginRight: '1rem', textDecoration: 'none' }}>Login</Link>
                        <Link to="/signup" style={{ color: 'white', textDecoration: 'none' }}>Sign Up</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
