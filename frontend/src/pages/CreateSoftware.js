import React, { useState } from 'react';
import * as api from '../services/api';

const CreateSoftware = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [accessLevels, setAccessLevels] = useState({ Read: false, Write: false, Admin: false });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleCheckboxChange = (e) => {
        setAccessLevels({ ...accessLevels, [e.target.name]: e.target.checked });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        const selectedLevels = Object.keys(accessLevels).filter(level => accessLevels[level]);
        if (selectedLevels.length === 0) {
            setError("Please select at least one access level.");
            return;
        }
        try {
            await api.createSoftware({ name, description, accessLevels: selectedLevels });
            setMessage('Software created successfully!');
            setName('');
            setDescription('');
            setAccessLevels({ Read: false, Write: false, Admin: false });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create software.');
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '2rem', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <h2>Create New Software (Admin)</h2>
            {message && <p style={{ color: 'green', textAlign: 'center' }}>{message}</p>}
            {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                    <label htmlFor="sw_name" style={{ display: 'block', marginBottom: '0.5rem' }}>Name:</label>
                    <input id="sw_name" type="text" value={name} onChange={(e) => setName(e.target.value)} required style={{ width: '100%', padding: '0.5rem' }} />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label htmlFor="sw_desc" style={{ display: 'block', marginBottom: '0.5rem' }}>Description:</label>
                    <textarea id="sw_desc" value={description} onChange={(e) => setDescription(e.target.value)} required style={{ width: '100%', padding: '0.5rem', minHeight: '80px' }} />
                </div>
                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Access Levels:</label>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <label><input type="checkbox" name="Read" checked={accessLevels.Read} onChange={handleCheckboxChange} /> Read</label>
                        <label><input type="checkbox" name="Write" checked={accessLevels.Write} onChange={handleCheckboxChange} /> Write</label>
                        <label><input type="checkbox" name="Admin" checked={accessLevels.Admin} onChange={handleCheckboxChange} /> Admin</label>
                    </div>
                </div>
                <button type="submit" style={{ padding: '0.75rem 1.5rem', backgroundColor: '#007bff', color: 'white' }}>Create Software</button>
            </form>
        </div>
    );
};

export default CreateSoftware;
