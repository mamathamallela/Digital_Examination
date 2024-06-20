import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Welcome from './components/Welcome';
import SignUpForm from './components/SignUp';
import Login from './components/Login';
import AdminComponent from './components/AdminPage';
import AdminLoginPage from './components/Adminlogin';
import UserComponent from './components/UserPage';
import CameraComponent from './components/CameraComponent';
import SuperAdminPage from './components/SuperAdminPage';
import ForgotPassword from './components/ForgotPassword';
import ChangeAdminPassword from './components/ChangeAdminPassword';
import Navbar from './components/Navbar';
import RG from './components/registerForNotification';

function App() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [role, setRole] = useState("");

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedRole = localStorage.getItem('role');
        
        if (token && storedRole) {
            setLoggedIn(true);
            setRole(storedRole);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        setLoggedIn(false);
        setRole("");
    };

    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Welcome />} />
                    <Route path="/signup" element={<SignUpForm />} />
                    <Route path="/login" element={<Login setLoggedIn={setLoggedIn} setRole={setRole} />} />
                    <Route path="/forgotpassword" element={<ForgotPassword />} />
                    <Route path="/user" element={loggedIn && role === 'users' ? <UserComponent /> : <Navigate to="/login" />} />
                    <Route path="/admin" element={loggedIn && role === 'admin' ? <AdminComponent handleLogout={handleLogout} /> : <Navigate to="/adminlogin" />} />
                    <Route path="/superadmin" element={loggedIn && role === 'superadmin' ? <SuperAdminPage handleLogout={handleLogout} /> : <Navigate to="/adminlogin" />} />
                    <Route path="/adminlogin" element={<AdminLoginPage />} />
                    <Route path="/changeadminpassword" element={loggedIn ? <ChangeAdminPassword /> : <Navigate to="/login" />} />
                    <Route path="/navbar" element={<Navbar />} />
                    <Route path="/registration/:notificationId/:notificationText" element={<RG />} />
                    <Route path="/camera" element={loggedIn && role === 'users' ? <CameraComponent /> : <Navigate to="/user" />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
