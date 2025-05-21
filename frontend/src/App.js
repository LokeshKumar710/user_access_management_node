import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/common/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import CreateSoftware from './pages/CreateSoftware';
import RequestAccess from './pages/RequestAccess';
import MyRequests from './pages/MyRequests';
import PendingRequests from './pages/PendingRequests';

function AppContent() {
    const { user, loading } = useAuth();

    if (loading) {
        return <div style={{textAlign: 'center', padding: '50px', fontSize: '1.5em'}}>Loading Application...</div>;
    }

    return (
        <>
            <Navbar />
            <div className="container" style={{padding: "1rem"}}>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    
                    <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
                    
                    <Route element={<ProtectedRoute allowedRoles={['Admin', 'Manager', 'Employee']} />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                    </Route>

                    <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
                        <Route path="/admin/create-software" element={<CreateSoftware />} />
                    </Route>

                    <Route element={<ProtectedRoute allowedRoles={['Manager', 'Admin']} />}> {/* Admin can also see pending */}
                        <Route path="/manager/pending-requests" element={<PendingRequests />} />
                    </Route>

                    {/* Employee routes can also be accessed by Admin/Manager for viewing specific employee data if needed */}
                    <Route element={<ProtectedRoute allowedRoles={['Employee', 'Admin', 'Manager']} />}>
                        <Route path="/employee/request-access" element={<RequestAccess />} />
                        <Route path="/employee/my-requests" element={<MyRequests />} />
                    </Route>
                    
                    <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
                </Routes>
            </div>
        </>
    );
}

function App() {
    return (
        <Router>
            <AuthProvider>
                <AppContent />
            </AuthProvider>
        </Router>
    );
}

export default App;
