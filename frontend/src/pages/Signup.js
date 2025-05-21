import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate

const Signup = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('Employee'); // Add state for role, default to Employee
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const { signupUser } = useAuth();
    const navigate = useNavigate(); // For redirection after successful signup

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }
        
        // Send the selected role along with username and password
        const result = await signupUser({ username, password, role }); 

        if (result.success) {
            setMessage(result.message || 'Signup successful! Please login.');
            setUsername('');
            setPassword('');
            setConfirmPassword('');
            setRole('Employee'); // Reset role to default
            // Optionally redirect to login after a short delay
            // setTimeout(() => navigate('/login'), 2000);
        } else {
            setError(result.message || 'Signup failed. Username might be taken or server error.');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '2rem auto', padding: '2rem', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <h2>Sign Up</h2>
            {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
            {message && <p style={{ color: 'green', textAlign: 'center' }}>{message}</p>}
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                    <label htmlFor="username_signup" style={{ display: 'block', marginBottom: '0.5rem' }}>Username:</label>
                    <input id="username_signup" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required style={{ width: '100%', padding: '0.5rem' }}/>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label htmlFor="password_signup" style={{ display: 'block', marginBottom: '0.5rem' }}>Password:</label>
                    <input id="password_signup" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: '0.5rem' }}/>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label htmlFor="confirm_password_signup" style={{ display: 'block', marginBottom: '0.5rem' }}>Confirm Password:</label>
                    <input id="confirm_password_signup" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required style={{ width: '100%', padding: '0.5rem' }}/>
                </div>
                {/* --- Role Selection Dropdown --- */}
                <div style={{ marginBottom: '1rem' }}>
                    <label htmlFor="role_signup" style={{ display: 'block', marginBottom: '0.5rem' }}>Role:</label>
                    <select 
                        id="role_signup" 
                        value={role} 
                        onChange={(e) => setRole(e.target.value)} 
                        required 
                        style={{ width: '100%', padding: '0.5rem' }}
                    >
                        <option value="Employee">Employee</option>
                        <option value="Manager">Manager</option>
                        {/* Be VERY careful about allowing Admin selection from a public form */}
                        {/* <option value="Admin">Admin</option>  */}
                    </select>
                </div>
                {/* --- End of Role Selection --- */}
                <button type="submit" style={{ width: '100%', padding: '0.75rem', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}>Sign Up</button>
            </form>
            <p style={{ textAlign: 'center', marginTop: '1rem' }}>
                Already have an account? <Link to="/login">Login</Link>
            </p>
        </div>
    );
};

export default Signup;