import React, { useState, useEffect } from 'react';
import ExamComponent from './ExamComponent';
import { useNavigate } from 'react-router-dom';
import './userpage.css';
import axios from 'axios';
import ScorePopup from './ScorePopup';
import ReactDOM from 'react-dom';

const UserComponent = () => {
  const navigate = useNavigate();
  const [examStarted, setExamStarted] = useState(false);
  const [examCompleted, setExamCompleted] = useState(false); // New state variable
  const userid = parseInt(localStorage.getItem('userid'), 10);
  const username = localStorage.getItem('username');
  const [questionPaper, setQuestionPaper] = useState([]);
  const [notificationText, setNotificationText] = useState('');
  const [score, setScore] = useState(0);
  const [categoryScores, setCategoryScores] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const fetchNotificationText = async (userId) => {
      try {
        const response = await fetch(`/api/users/notification/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch notification text');
        }
        const data = await response.json();
        setNotificationText(data.notification_text);
      } catch (error) {
        console.error('Error fetching notification text:', error);
      }
    };

    fetchNotificationText(userid);
  }, [userid]);

  const startExam = async () => {
    setExamStarted(true);

    try {
      const response = await axios.get(`api/users/getquestionpaper?userId=${userid}`);
      const data = response.data;
      setQuestionPaper(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSaveScore = () => {
    setScore(0);
  };

  const handleExamSubmit = async (selectedAnswers) => {
    let score = 0;
    const categoryScores = {};

    questionPaper.forEach(category => {
      let categoryScore = 0;
      category.questions.forEach(question => {
        const selectedOptions = selectedAnswers[question.id];

        if (selectedOptions && selectedOptions.includes(question.answer)) {
          categoryScore += 2;
          score += 2;
        }
      });
      categoryScores[category.category] = categoryScore;
    });

    setScore(score);
    setCategoryScores(categoryScores);

    const dateAndTime = new Date().toLocaleString();
    const resultData = {
      userId: userid,
      userName: username,
      score: score,
      categoryScores: categoryScores,
      dateAndTime: dateAndTime
    };

    try {
      const response = await axios.post('api/users/save-exam-result', resultData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Response:', response.data);
    } catch (error) {
      console.error('Error:', error);
    }

    const newTab = window.open('', '_blank');
    newTab.document.write('<div id="score-popup"></div>');

    if (timeLeft === 0) {
      ReactDOM.render(
        <ScorePopup
          username={username}
          userid={userid}
          score={score}
          categoryScores={categoryScores}
          onClose={handleSaveScore}
          questionPaper={questionPaper} 
        />,
        newTab.document.getElementById('score-popup')
      );
    }
    setExamStarted(false);
    setExamCompleted(true); // Set examCompleted to true after submitting the exam
  };

  const logout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('token');
    navigate('/');
  };

  // Redirect user away from the exam page after refreshing if the exam has been completed
  useEffect(() => {
    if (examCompleted) {
      navigate('/'); // Redirect to the home page or any other page
    }
  }, [examCompleted, navigate]);

  return (
    <div className="userpage-container">
      <div className="sidebar">
        <img src={`Images/${userid}.png`} alt="Avatar" className="avatar" />
        <h3 className="username">{username}</h3>
        <button className="sidebar-button" onClick={logout}>Logout</button>
      </div>
      <div className="content">
        <h1 className="notification-text" style={{textAlign: 'center'}}>{notificationText}</h1>

        {!examStarted && (
          <div>
            <h3>Instructions:</h3><br></br>
            <p>1. Answer all questions within the given time.</p><br></br>
            <p>2. Each question carries 2 marks.</p><br></br>
            <p>3. Read each question carefully before answering.</p><br></br>
            <p>4.Avoid accessing other browser tabs or windows.</p><br></br>
            <p>5.Automatic exam termination upon another tab or window  usage.</p><br></br>
            <button className="d-button" onClick={startExam}>Start Exam</button>
          </div>
        )}
        {examStarted && (
          <div>
            <ExamComponent
              onSubmit={handleExamSubmit}
              userid={userid}
              username={username}
              questionPaper={questionPaper}
              timeLeft={timeLeft}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default UserComponent;

