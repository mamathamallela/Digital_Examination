import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './adminpage.css';
import ViewQuestionsComponent from './ViewQuestionsComponent';
import axios from 'axios';

const AdminComponent = () => {
  const navigate = useNavigate();
  const [viewQuestions, setViewQuestions] = useState(false);
  const [results, setResults] = useState([]);
  const [users, setUsers] = useState([]);
  const userid = localStorage.getItem('userid');
  const username = localStorage.getItem('username');

  const logout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('userid');
    navigate('/login');
    window.history.replaceState(null, '', '/login');
  };

  const handleViewQuestions = () => {
    setViewQuestions(true);
    setResults([]);
    setUsers([]);
  };

  const handleViewUsers = () => {
    axios
      .get('http://localhost:8000/api/users/getusers')
      .then((response) => {
        setUsers(response.data);
        setViewQuestions(false);
        setResults([]);
        console.log(response.data);
      })
      .catch((error) => console.error('Error fetching users:', error.response));

  };


  const handleViewResults = () => {
    axios
      .get('http://localhost:8000/api/users/getresults')
      .then((response) => {
        setResults(response.data);
        setViewQuestions(false);
        setUsers([]);
        console.log(response.data);
      })
      .catch((error) => console.error('Error fetching results:', error));
  };

  return (
    <div className="adminpage-container">
      <div className="asidebar">
        <img src="user.png" alt="Avatar" className="avatar" />
        <h3 className="username">{username}</h3>
        <button className="sidebar-button" onClick={handleViewQuestions}>
          View questions
        </button>
        <button className="sidebar-button" onClick={handleViewUsers}>
          View Users
        </button>
        <button className="sidebar-button" onClick={handleViewResults}>
          View Results
        </button>
        <button className="sidebar-button" onClick={logout}>
          Logout
        </button>
      </div>
      <div className="content">
        <h2>Admin Dashboard</h2>
        {viewQuestions && <ViewQuestionsComponent />}

        {results.length > 0 && (
          <div className="results-table">
            <h3>Results:</h3>
            <table>
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Username</th>
                  <th>Score</th>
                  <th>Date and Time</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result, index) => (
                  <tr key={index}>
                    <td>{result.user_id}</td>
                    <td>{result.user_name}</td>
                    <td>{result.score}</td>
                    <td>{new Date(result.date_and_time).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {users.length > 0 && (
          <div className="users-table">
            <h3>Users:</h3>
            <table>
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Resume Path</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.resumePath}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminComponent;

 