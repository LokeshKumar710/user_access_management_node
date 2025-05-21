import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { user } = useAuth();

    if (!user) {
        return <p>Loading user data or please log in.</p>;
    }

    return (
        <div style={{ padding: '2rem', maxWidth: '800px', margin: 'auto' }}>
            <h2 style={{ borderBottom: '2px solid #eee', paddingBottom: '0.5rem' }}>Dashboard</h2>
            <p style={{ fontSize: '1.2rem' }}>Welcome, <strong>{user.username}</strong>! Your role is: <strong>{user.role}</strong></p>
            
            <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                {user.role === 'Admin' && (
                    <div style={cardStyle}>
                        <h3>Admin Actions</h3>
                        <ul style={listStyle}>
                            <li><Link to="/admin/create-software" style={linkStyle}>Create New Software</Link></li>
                            {/* Add more admin links here */}
                        </ul>
                    </div>
                )}

                {user.role === 'Manager' && (
                    <div style={cardStyle}>
                        <h3>Manager Actions</h3>
                        <ul style={listStyle}>
                            <li><Link to="/manager/pending-requests" style={linkStyle}>View Pending Requests</Link></li>
                             <li><Link to="/employee/my-requests" style={linkStyle}>View My Requests (as Manager)</Link></li> 
                        </ul>
                    </div>
                )}

                {user.role === 'Employee' && (
                    <div style={cardStyle}>
                        <h3>Employee Actions</h3>
                        <ul style={listStyle}>
                            <li><Link to="/employee/request-access" style={linkStyle}>Request Software Access</Link></li>
                            <li><Link to="/employee/my-requests" style={linkStyle}>View My Requests</Link></li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

const cardStyle = {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '1.5rem',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    backgroundColor: 'white',
};

const listStyle = {
    listStyleType: 'none',
    paddingLeft: 0,
};

const linkStyle = {
    textDecoration: 'none',
    color: '#007bff',
    display: 'block',
    padding: '0.5rem 0',
};

export default Dashboard;
