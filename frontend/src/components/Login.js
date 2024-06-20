import React, { useState } from 'react';
import './Login.css'; // Import your CSS file
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [registerNumber, setRegisterNumber] = useState('');
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch('http://192.168.30.104:8000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          registerNumber,
        }),
      });
  
      if (response.ok) {
        const data = await response.json(); // Assuming the response contains user details
  
        // Save user details in local storage
        localStorage.setItem('userid', data.registerNumber.toString());
        localStorage.setItem('username', `${data.firstName} ${data.lastName}`);
  

        console.log('Login successful');
        // Handle successful login (e.g., redirect to a new page)
        navigate('/camera');
      } else {
        const errorText = await response.text();
        setLoginError(errorText || 'Login failed');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setLoginError('Error logging in');
    }
  };
  
  return (
    <div className="login-form">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Register Number</label>
          <input
            type="text"
            value={registerNumber}
            onChange={(e) => setRegisterNumber(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <button type="submit">Login</button>
        </div>
        {loginError && <p className="error-message">{loginError}</p>}
      </form>
    </div>
  );
};

export default Login;
