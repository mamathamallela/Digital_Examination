import React, { useState } from 'react';
import ExamComponent from './ExamComponent';
import questions from './questions';
import { useNavigate } from 'react-router-dom';
import './userpage.css';
import axios from 'axios'

const UserComponent = () => {
  const navigate = useNavigate();
  const [examStarted, setExamStarted] = useState(false);
  const userid = parseInt(localStorage.getItem('userid'), 10);
  const username = localStorage.getItem('username');

  const startExam = () => {
    setExamStarted(true);
  };

  const [scorePopup, setScorePopup] = useState(null);

  const showScorePopup = (score) => {
    setScorePopup(score);
    setTimeout(() => {
      setScorePopup(null);
    }, 5000);
  };

  const handleExamSubmit = async (selectedAnswers) => {
    let score = 0;

    questions.forEach(category => {
      category.questions.forEach(question => {
        const selectedOptions = selectedAnswers[question.id];

        if (selectedOptions && selectedOptions.includes(question.answer)) {
          score += 2;
        }
      });
    });


    const dateAndTime = new Date().toLocaleString();
    const resultData = {
      userId: userid,
      userName: username,
      score: score,
      dateAndTime: dateAndTime
    };
    console.log(resultData)
    try {
      const response = await axios.post('http://localhost:8000/api/users/save-exam-result', resultData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Response:', response.data);
    } catch (error) {
      console.error('Error:', error);
      console.log('Response Status:', error.response.status);
    }

    setExamStarted(false);
    showScorePopup(score);
  };

  const logout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('token');
    navigate('/'); // Redirect to the login page after logout
  };

  return (
    <div className="userpage-container">
      <div className="sidebar">
        <img src="user.png" alt="Avatar" className="avatar" />
        <h3 className="username">{username}</h3>
        <button className="sidebar-button" onClick={logout}>Logout</button>
      </div>
      {scorePopup !== null && (
        <div className="score-popup">
          <p>Your score is: {scorePopup}/50</p>
        </div>
      )}
      <div className="content">
        <div className='hd'><h2>User Dashboard</h2></div>
        {!examStarted && scorePopup === null && (
          <div>
            <h3>Instructions:</h3>
            <p>1. Answer all questions within the given time.</p>
            <p>2. Each question carries 2 marks.</p>
            <p>3. Read each question carefully before answering.</p>
            <button onClick={startExam}>Start Exam</button>
          </div>
        )}
        {examStarted && !scorePopup && (
          <div>
            <ExamComponent onSubmit={handleExamSubmit} userid={userid} username={username} />
          </div>
        )}
      </div>
    </div>
  );
};

export default UserComponent;

