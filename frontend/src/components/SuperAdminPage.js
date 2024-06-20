import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './superadminpage.css';
import { useNavigate } from 'react-router-dom';

const SuperAdminPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [admins, setAdmins] = useState([]);
  const navigate = useNavigate();
  const username = localStorage.getItem('username');
  const token = localStorage.getItem('token');
  const [adminData, setAdminData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'admin'
  });

  const fetchAdmins = useCallback(async () => {
    try {
      const response = await axios.get('/api/users/admins', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setAdmins(response.data);
    } catch (error) {
      console.error('Error fetching admins:', error);
      alert('Failed to fetch admins. Please try again.');
    }
  }, [token]);

  useEffect(() => {
    if (!token) {
      navigate('/'); // Redirect to login if token is not present
    } else {
      fetchAdmins();
    }
  }, [token, navigate, fetchAdmins]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdminData({
      ...adminData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/users/register', adminData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      alert('Admin added successfully');
      setAdminData({
        username: '',
        email: '',
        password: '',
        role: 'admin'
      });
      setShowForm(false); // Hide the form after submission
      fetchAdmins(); // Fetch updated admins after adding new admin
    } catch (error) {
      console.error('Error adding admin:', error);
      alert('Failed to add admin. Please try again.');
    }
  };

  const logout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('userid');
    localStorage.removeItem('token');
    localStorage.removeItem('role'); 
    navigate('/');
  };

  const handleViewAdmins = () => {
    setShowForm(false); // Hide the form
    fetchAdmins();
  };

  const adminList = admins.filter(admin => admin.role === 'admin');

  return (
    <div className="adminpage-container">
      <div className="asidebar">
        <img src="user.png" alt="Avatar" className="avatar" />
        <h3 className="username">{username}</h3>
        <button className="sidebar-button" onClick={() => setShowForm(true)}>
          Add Admin
        </button>
        <button className="sidebar-button" onClick={handleViewAdmins}>
          View Admins
        </button>
        <button className="sidebar-button" onClick={logout}>
          Logout
        </button>
      </div>
      <div className="content">
        <h2>Super Admin Dashboard</h2>
        {showForm && (
          <div className="add-admin-form">
            <h3>Add Admin</h3>
            <form onSubmit={handleSubmit}>
              <input type="text" name="username" placeholder="Name" value={adminData.username} onChange={handleChange} required />
              <input type="email" name="email" placeholder="Email" value={adminData.email} onChange={handleChange} required/>
              <input type="password" name="password" placeholder="Password" value={adminData.password} onChange={handleChange} required/>
              <button type="submit">Add Admin</button>
            </form>
          </div>
        )}
        {!showForm && (
          <div>
            <h3>Admins</h3>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Created At</th>
                </tr>
              </thead>
              <tbody>
                {adminList.map(admin => (
                  <tr key={admin.id}>
                    <td>{admin.id}</td>
                    <td>{admin.username}</td>
                    <td>{admin.email}</td>
                    <td>{new Date(admin.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default SuperAdminPage;
