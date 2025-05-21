import React, { useState, useEffect } from 'react';
import * as api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const MyRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user } = useAuth();

    useEffect(() => {
        const fetchRequests = async () => {
            if (!user) return; 
            try {
                setLoading(true);
                setError('');
                const response = await api.getMyRequests();
                setRequests(response.data.sort((a,b) => new Date(b.requestedAt) - new Date(a.requestedAt)));
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch your requests.');
            } finally {
                setLoading(false);
            }
        };
        fetchRequests();
    }, [user]);

    if (loading) return <p style={{ textAlign: 'center', padding: '2rem' }}>Loading your requests...</p>;
    if (error) return <p style={{ color: 'red', textAlign: 'center', padding: '2rem' }}>{error}</p>;

    return (
        <div style={{ padding: '2rem', maxWidth: '900px', margin: 'auto' }}>
            <h2 style={{ borderBottom: '2px solid #eee', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>My Access Requests</h2>
            {requests.length === 0 ? (
                <p style={{ textAlign: 'center' }}>You have not made any requests yet.</p>
            ) : (
                <div style={{ overflowX: 'auto' }}>
                    <table style={tableStyle}>
                        <thead>
                            <tr>
                                <th style={thStyle}>Software</th>
                                <th style={thStyle}>Access Type</th>
                                <th style={thStyle}>Reason</th>
                                <th style={thStyle}>Status</th>
                                <th style={thStyle}>Requested At</th>
                                <th style={thStyle}>Updated At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.map((req) => (
                                <tr key={req.id}>
                                    <td style={tdStyle}>{req.software?.name || 'N/A'}</td>
                                    <td style={tdStyle}>{req.accessType}</td>
                                    <td style={tdStyle}>{req.reason}</td>
                                    <td style={tdStyle}><span style={getStatusChipStyle(req.status)}>{req.status}</span></td>
                                    <td style={tdStyle}>{new Date(req.requestedAt).toLocaleString()}</td>
                                    <td style={tdStyle}>{new Date(req.updatedAt).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '1rem',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    backgroundColor: 'white',
};

const thStyle = {
    borderBottom: '2px solid #ddd',
    padding: '12px 15px',
    textAlign: 'left',
    backgroundColor: '#f8f9fa',
    fontWeight: 'bold',
};

const tdStyle = {
    borderBottom: '1px solid #eee',
    padding: '12px 15px',
    textAlign: 'left',
};

const getStatusChipStyle = (status) => {
    let backgroundColor = '#e9ecef'; // Default for Pending
    let color = '#495057';
    if (status === 'Approved') {
        backgroundColor = '#d4edda'; color = '#155724';
    } else if (status === 'Rejected') {
        backgroundColor = '#f8d7da'; color = '#721c24';
    }
    return {
        display: 'inline-block',
        padding: '4px 10px',
        borderRadius: '12px',
        fontSize: '0.85em',
        backgroundColor,
        color,
    };
};

export default MyRequests;
