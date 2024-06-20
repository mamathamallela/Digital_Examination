import React, { useState } from 'react';
import axios from 'axios';
import './ForgotPassword.css'; 
import { useNavigate } from 'react-router-dom'; // Importing useNavigate

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [otp, setOTP] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [verified, setVerified] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate(); // Initializing useNavigate

    const handleChange = (e) => {
        setEmail(e.target.value);
    };

    const handleOTPChange = (e) => {
        setOTP(e.target.value);
    };

    const handleNewPasswordChange = (e) => {
        setNewPassword(e.target.value);
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post('/api/users/forgot-password', { email });
            if (response.status === 200) {
                setMessage('OTP sent to your email');
            }
        } catch (error) {
            setMessage('Error sending OTP');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post('/api/users/verify-otp', { email, otp });
            if (response.status === 200) {
                setMessage('OTP verified successfully');
                setVerified(true);
            }
            
        } catch (error) {
            setMessage('Error verifying OTP');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Add password validation logic if needed
            if (newPassword !== confirmPassword) {
                setMessage('Passwords do not match');
                return;
            }
            const response = await axios.post('/api/users/reset-password', { email, newPassword });
            if (response.status === 200) {
                setMessage('Password reset successfully');
                // You may want to redirect the user to a login page after successful password reset
            }
            navigate('/adminlogin');
        } catch (error) {
            setMessage('Error resetting password');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="forgot-password-container">
            <p>{message}</p>
            {!verified && !message && (
                <form onSubmit={handleSubmit} className="forgot-password-form">
                    <h1>Forgot Password</h1>
                    <p>Please enter your email address to reset your password.</p>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={email}
                        onChange={handleChange}
                        required
                    />
                    <button type="submit" disabled={loading}>Reset Password</button>
                    {loading && <p>Loading...</p>}
                </form>
            )}
            {!verified && message && (
                <form onSubmit={handleVerifyOTP} className="verify-otp-form">
                    <h1>Verify OTP</h1>
                    <p>{message}</p>
                    <p>Please enter the OTP sent to your email.</p>
                    <input
                        type="text"
                        name="otp"
                        placeholder="OTP"
                        value={otp}
                        onChange={handleOTPChange}
                        required
                    />
                    <button type="submit" disabled={loading}>Verify OTP</button>
                    {loading && <p>Loading...</p>}
                </form>
            )}
            {verified && (
                <form onSubmit={handleResetPassword} className="reset-password-form">
                    <h1>Reset Password</h1>
                    <p>Enter your new password.</p>
                    <input
                        type="password"
                        name="newPassword"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={handleNewPasswordChange}
                        required
                    />
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={handleConfirmPasswordChange}
                        required
                    />
                    <button type="submit" disabled={loading}>Reset Password</button>
                    {loading && <p>Loading...</p>}
                </form>
            )}
        </div>
    );
};

export default ForgotPasswordPage;
