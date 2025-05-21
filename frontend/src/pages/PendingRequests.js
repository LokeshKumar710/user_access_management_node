import React, { useState, useEffect } from 'react';
import * as api from '../services/api';

const PendingRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const fetchPendingRequests = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await api.getPendingRequests();
            setRequests(response.data.sort((a,b) => new Date(b.requestedAt) - new Date(a.requestedAt)));
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch pending requests.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingRequests();
    }, []);

    const handleUpdateRequest = async (requestId, status) => {
        setMessage('');
        setError('');
        try {
            await api.updateRequestStatus(requestId, { status });
            setMessage(`Request ${status.toLowerCase()} successfully.`);
            fetchPendingRequests(); 
        } catch (err) {
            setError(err.response?.data?.message || `Failed to ${status.toLowerCase()} request.`);
        }
    };

    if (loading) return <p style={{ textAlign: 'center', padding: '2rem' }}>Loading pending requests...</p>;
    
    return (
        <div style={{ padding: '2rem', maxWidth: '1000px', margin: 'auto' }}>
            <h2 style={{ borderBottom: '2px solid #eee', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>Pending Access Requests</h2>
            {message && <p style={{ color: 'green', textAlign: 'center' }}>{message}</p>}
            {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

            {requests.length === 0 && !loading && <p style={{ textAlign: 'center' }}>No pending requests.</p>}

            {requests.length > 0 && (
                 <div style={{ overflowX: 'auto' }}>
                    <table style={tableStyle}>
                        <thead>
                            <tr>
                                <th style={thStyle}>User</th>
                                <th style={thStyle}>Software</th>
                                <th style={thStyle}>Access Type</th>
                                <th style={thStyle}>Reason</th>
                                <th style={thStyle}>Requested At</th>
                                <th style={thStyle}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.map((req) => (
                                <tr key={req.id}>
                                    <td style={tdStyle}>{req.user?.username || 'N/A'}</td>
                                    <td style={tdStyle}>{req.software?.name || 'N/A'}</td>
                                    <td style={tdStyle}>{req.accessType}</td>
                                    <td style={tdStyle}>{req.reason}</td>
                                    <td style={tdStyle}>{new Date(req.requestedAt).toLocaleString()}</td>
                                    <td style={tdStyle}>
                                        <button onClick={() => handleUpdateRequest(req.id, 'Approved')} style={{ ...actionButtonStyle, backgroundColor: '#28a745', marginRight: '8px' }}>Approve</button>
                                        <button onClick={() => handleUpdateRequest(req.id, 'Rejected')} style={{ ...actionButtonStyle, backgroundColor: '#dc3545' }}>Reject</button>
                                    </td>
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

const actionButtonStyle = {
    color: 'white',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9em'
};

export default PendingRequests;
