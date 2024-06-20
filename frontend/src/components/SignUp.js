import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import "./signup.css"
import axios from 'axios';

const SignUpForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    resume: '',
    role: 'admin',
  });

  const handleChange = (e) => {
    if (e.target.name === 'resume') {
      setFormData({ ...formData, [e.target.name]: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post('api/users/register', {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        resumePath: formData.resume.name,
        role: formData.role,
      });
  
      console.log(response.data);
  
      setFormData({
        username: '',
        email: '',
        password: '',
        resume: '',
        role: '',
      });
      navigate('/login');
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert(error.response.data.message); 
      } else {
        console.error('Error registering user:', error);
      }
    }
  };
  
  return (
    <div>
      <form className="form-container" onSubmit={handleSubmit}>
        <input
          className="form-input" type="text" name="username" value={formData.username} 
          onChange={handleChange}  placeholder="Username" required
        />
        <input
          className="form-input" type="email" name="email" value={formData.email}
          onChange={handleChange} placeholder="Email" required
        />
        <input
          className="form-input" type="password" name="password" value={formData.password}
          onChange={handleChange} placeholder="Password" required
        />
        <label htmlFor="resume">Upload Resume (PDF, DOC, DOCX)</label>
        <input
          className="file-input" type="file" name="resume" onChange={handleChange}
          accept=".pdf,.doc,.docx" required
        />
        <button className="submit-btn" type="submit">Sign Up</button>
        <center>or</center>
        <center><Link to='/login'><button>Login</button></Link></center>
      </form>
    </div>
  );
};

export default SignUpForm;
