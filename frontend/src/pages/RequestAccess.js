import React, { useState, useEffect } from 'react';
import * as api from '../services/api';

const RequestAccess = () => {
    const [softwareList, setSoftwareList] = useState([]);
    const [selectedSoftware, setSelectedSoftware] = useState('');
    const [selectedSoftwareDetails, setSelectedSoftwareDetails] = useState(null);
    const [accessType, setAccessType] = useState('');
    const [reason, setReason] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loadingSoftware, setLoadingSoftware] = useState(true);

    useEffect(() => {
        const fetchSoftware = async () => {
            setLoadingSoftware(true);
            try {
                const response = await api.getAllSoftware();
                setSoftwareList(response.data);
            } catch (err) {
                setError('Failed to load software list.');
                console.error(err);
            } finally {
                setLoadingSoftware(false);
            }
        };
        fetchSoftware();
    }, []);

    useEffect(() => {
        if (selectedSoftware) {
            const details = softwareList.find(s => s.id === parseInt(selectedSoftware));
            setSelectedSoftwareDetails(details);
            setAccessType(''); 
        } else {
            setSelectedSoftwareDetails(null);
        }
    }, [selectedSoftware, softwareList]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        if (!selectedSoftware || !accessType || !reason) {
            setError('All fields are required.');
            return;
        }
        try {
            await api.submitAccessRequest({
                softwareId: parseInt(selectedSoftware),
                accessType,
                reason,
            });
            setMessage('Access request submitted successfully!');
            setSelectedSoftware('');
            setAccessType('');
            setReason('');
            setSelectedSoftwareDetails(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit request.');
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '2rem', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <h2>Request Software Access</h2>
            {message && <p style={{ color: 'green', textAlign: 'center' }}>{message}</p>}
            {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
            {loadingSoftware && <p>Loading software list...</p>}
            
            {!loadingSoftware && softwareList.length === 0 && !error && <p>No software available to request.</p>}

            {!loadingSoftware && softwareList.length > 0 && (
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label htmlFor="req_software" style={{ display: 'block', marginBottom: '0.5rem' }}>Software:</label>
                        <select id="req_software" value={selectedSoftware} onChange={(e) => setSelectedSoftware(e.target.value)} required style={{ width: '100%', padding: '0.5rem' }}>
                            <option value="">Select Software</option>
                            {softwareList.map((sw) => (
                                <option key={sw.id} value={sw.id}>
                                    {sw.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    {selectedSoftwareDetails && (
                         <div style={{ marginBottom: '1rem' }}>
                            <label htmlFor="req_access_type" style={{ display: 'block', marginBottom: '0.5rem' }}>Access Type:</label>
                            <select id="req_access_type" value={accessType} onChange={(e) => setAccessType(e.target.value)} required style={{ width: '100%', padding: '0.5rem' }}>
                                <option value="">Select Access Type</option>
                                {selectedSoftwareDetails.accessLevels.map(level => (
                                    <option key={level} value={level}>{level}</option>
                                ))}
                            </select>
                        </div>
                    )}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label htmlFor="req_reason" style={{ display: 'block', marginBottom: '0.5rem' }}>Reason:</label>
                        <textarea id="req_reason" value={reason} onChange={(e) => setReason(e.target.value)} required style={{ width: '100%', padding: '0.5rem', minHeight: '80px' }} />
                    </div>
                    <button type="submit" style={{ padding: '0.75rem 1.5rem', backgroundColor: '#007bff', color: 'white' }}>Submit Request</button>
                </form>
            )}
        </div>
    );
};

export default RequestAccess;
